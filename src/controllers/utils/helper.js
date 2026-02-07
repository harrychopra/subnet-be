export const isValidId = idStr => {
  const id = parseInt(idStr, 10);
  return !isNaN(id) && id > 0;
};

export const formatZodErrors = errStr => {
  const validationErrors = JSON.parse(errStr);
  const invalidFields = validationErrors.map(err => err.path).join(', ');
  return `Invalid input: ${invalidFields}`;
};
