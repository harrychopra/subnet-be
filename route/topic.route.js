import express from 'express';
import { getTopics } from '../controller/topic.controller.js';

const router = express.Router();

router.route('/').get(getTopics).all((req, res) => {
  try {
    res.status(405).json({
      error: `Method ${req.method} not allowed`
    });
  } catch (err) {
    console.error(err);
  }
});

export default router;
