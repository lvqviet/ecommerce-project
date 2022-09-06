// eslint-disable-next-line import/no-anonymous-default-export
export const format = {
  currency: (price) =>
    price.toLocaleString("it-IT", { style: "currency", currency: "VND" }),
};
