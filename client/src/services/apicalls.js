import axios from "axios";

export const commonrequest = async (method, url, body, header) => {
  const config = {
    method,
    url,
    data: body,
    headers: header || {
      "Content-Type": "application/json",
    },
  };

  return axios(config)
    .then((data) => {
      return data;
    })
    .catch((error) => {
      return error;
    });
};
