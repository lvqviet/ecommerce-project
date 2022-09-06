import { create } from "apisauce";

const baseURL = "https://houseware-ecommerce.herokuapp.com";

const api = create({ baseURL });

export const setNewToken = (token) => {
  console.log("============TOKEN===========");
  console.log(token);
  if (token) {
    api.setHeader("Authorization", "Bearer " + token);
  } else {
    api.deleteHeader("Authorization");
  }
};

export default api;
