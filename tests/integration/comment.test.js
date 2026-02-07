import request from 'supertest';
import db from '../../db/db.js';
import seed from '../../db/seeds/seed.js';
import app from '../../src/app.js';
import {
  testInvalidId,
  testMethodNotAllowed
} from './test-utils/test-errors.js';

beforeEach(() => seed());
afterAll(() => db.end());

describe('\nComments', () => {
  describe('api/articles/:article_id/comments', () => {
    describe('GET', () => {
      test('returns all comments for an article', async () => {
        const articleIds = [1, 2, 3];
        const requests = articleIds.map(async articleId => {
          const resp = await request(app).get(
            `/api/articles/${articleId}/comments`
          ).expect(200);

          const { body: { comments } } = resp;
          expect(comments).toBeArray();

          const { rows } = await db.query(
            `--sql
            select *
            from comments
            where article_id = $1`,
            [articleId]
          );
          expect(comments.length).toBe(rows.length);
        });

        await Promise.all(requests);
      });
      test('returns comments with correct properties', async () => {
        const resp = await request(app).get('/api/articles/1/comments');

        const { body: { comments } } = resp;
        comments.forEach(comment => {
          expect(comment).toContainAllKeys([
            'comment_id',
            'votes',
            'created_at',
            'author',
            'body',
            'article_id'
          ]);
        });
      });
      test('returns comments with correct data types', async () => {
        const resp = await request(app).get('/api/articles/1/comments');
        const { body: { comments } } = resp;

        comments.forEach(comment => {
          expect(comment.comment_id).toBeNumber();
          expect(comment.article_id).toBeNumber();
          expect(comment.votes).toBeNumber();
          expect(comment.created_at).toBeString();
          expect(comment.author).toBeString();
          expect(comment.body).toBeString();
        });
      });
      test('returns comments sorted by newest first', async () => {
        const resp = await request(app).get('/api/articles/1/comments');

        const { body: { comments } } = resp;
        expect(comments).toBeSorted({ descending: true, key: 'created_at' });
      });
      test('returns 404 with a message when article does not exist', async () => {
        const resp = await request(app).get('/api/articles/100/comments')
          .expect(
            404
          );

        const { body: { error } } = resp;
        expect(error).toBe('Article id not found');
      });
      test('returns 400 with a message when article id is invalid', async () => {
        await testInvalidId('/api/articles/:id/comments', 'article');
      });
    });

    describe('POST', () => {
      test('responds with correct status code', async () => {
        const articleId = 1;
        const url = `/api/articles/${articleId}/comments`;
        const payload = {
          username: 'icellusedkars',
          body: 'At least the lighting in consistent'
        };

        await request(app).post(url).send(payload).expect(201);
      });
      test('responds with newly created comment with correct props and values', async () => {
        const articleId = 1;
        const url = `/api/articles/${articleId}/comments`;
        // username: 'SecondPlaceForever',
        const payload = {
          username: 'icellusedkars',
          body: 'At least the lighting in consistent'
        };
        const requestTime = Date.now();

        const resp = await request(app).post(url).send(payload);

        const { body: { comment } } = resp;
        const { comment_id, article_id, body, votes, author, created_at } =
          comment;

        expect(comment_id).toBeGreaterThan(0);
        expect(article_id).toBe(articleId);
        expect(body).toBe(payload.body);
        expect(author).toBe(payload.username);
        expect(votes).toBe(0);
        const createdTime = new Date(created_at).getTime();
        expect(createdTime).toBeGreaterThan(requestTime);
      });
      test('persists comment to database', async () => {
        const articleId = 1;
        const url = `/api/articles/${articleId}/comments`;
        const payload = {
          username: 'icellusedkars',
          body: 'At least the lighting in consistent'
        };

        // Get the last row id from the comments table
        const { rows } = await db.query(`--sql
        select comment_id
        from comments
        order by comment_id desc
        limit 1
        `);

        const { comment_id: lastRowId } = rows[0];

        const resp = await request(app).post(url).send(payload);

        const { body: { comment } } = resp;
        const { comment_id, article_id, body, votes, author } = comment;
        expect(comment_id).toBe(lastRowId + 1);
        expect(article_id).toBe(articleId);
        expect(body).toBe(payload.body);
        expect(author).toBe(payload.username);
        expect(votes).toBe(0);
      });
      test('returns 404 with a message when article does not exist', async () => {
        const payload = {
          username: 'icellusedkars',
          body: 'At least the lighting in consistent'
        };
        const resp = await request(app).post('/api/articles/100/comments').send(
          payload
        ).expect(404);

        const { body: { error } } = resp;
        expect(error).toBe('Article id not found');
      });
      test('returns 400 with a message when required fields are missing', async () => {
        const articleId = 1;
        const url = `/api/articles/${articleId}/comments`;

        const testData = [
          { payload: {}, expError: 'Invalid input: username, body' },
          {
            payload: { username: 'icellusedkars' },
            expError: 'Invalid input: body'
          },
          {
            payload: { body: 'At least the lighting in consistent' },
            expError: 'Invalid input: username'
          }
        ];

        for (const data of testData) {
          const resp = await request(app).post(url).send(data.payload).expect(
            400
          );
          const { body: { error } } = resp;
          expect(error).toBe(data.expError);
        }
      });
      test('returns 400 when article id is not a valid number', async () => {
        await testInvalidId('/api/articles/:id/comments', 'article', 'post');
      });
    });
    describe('Method not allowed', () =>
      testMethodNotAllowed('/api/articles/1/comments', [
        'put',
        'patch',
        'delete'
      ]));
  });

  describe('api/comments/:comment_id', () => {
    describe('DELETE', () => {
      test('deletes the comment and returns 204', async () => {
        await request(app).delete('/api/comments/1').expect(204);
      });
      test('deletes the comment from the database', async () => {
        await request(app).delete('/api/comments/1');
        const { rows } = await db.query(
          `select exists(select 1 from comments where comment_id = 1)`
        );
        const { exists } = rows[0];
        expect(exists).toBe(false);
      });
      test('returns 404 with a message when comment does not exist', async () => {
        const resp = await request(app).delete('/api/comments/100').expect(404);

        const { body: { error } } = resp;
        expect(error).toBe('Comment id not found');
      });
      test('returns 400 with a message when comment id is invalid', async () => {
        await testInvalidId('/api/comments/:id', 'comment', 'delete');
      });
    });

    describe('Method not allowed', () =>
      testMethodNotAllowed('/api/comments/1', [
        'get',
        'post',
        'put',
        'patch'
      ]));
  });
});
