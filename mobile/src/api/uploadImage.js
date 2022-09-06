import { create } from "apisauce";

const baseURL = "https://api.imgur.com/3";

const api = create({ baseURL });
const ID = "546c25a59c58ad7";

api.setHeader("Authorization", "Client-ID " + ID);

export const uploadAvatar = (avatar) => {
  const formData = new FormData();
  formData.append("image", {
    uri: avatar,
    type: "image/jpeg",
    name: "avatar.jpg",
  });
  return api.post("upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
