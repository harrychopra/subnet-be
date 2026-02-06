export const isValidId = idStr => {
  const id = parseInt(idStr, 10);
  return !isNaN(id) && id > 0;
};
