const getNestedError = (errors, path) => {
  const fields = path.split(".");
  return fields.reduce((acc, field) => {
    if (field.includes("[") && field.includes("]")) {
      const [arrayName, index] = field.split("[");
      const idx = parseInt(index.replace("]", ""), 10);
      return acc?.[arrayName]?.[idx];
    }
    return acc?.[field];
  }, errors);
};
export default getNestedError;
