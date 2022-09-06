export default {
  currency: (price) =>
    price.toLocaleString("it-IT", { style: "currency", currency: "VND" }),
};
