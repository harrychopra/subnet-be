export const isValidId = idStr => {
  const id = parseInt(idStr, 10);
  return !isNaN(id) && id > 0;
};

export const formatZodErrors = result => {
  const validationErrors = JSON.parse(result.error.message);
  const invalidFields = validationErrors.map(err => err.path).join(', ');
  return `Invalid input: ${invalidFields}`;
};

// export const validatedId = idStr => {
//   const id = parseInt(idStr, 10);
//   if (isNaN(id) || id < 1) {
//     throw new ValidationError('Invalid article id/ format');
//   }
//   return id;
// };
