export const createColumn = (title, dataIndex, key, render, sorter = null) => {
  return {
    title,
    dataIndex,
    key,
    render,
    sorter,
  };
};
