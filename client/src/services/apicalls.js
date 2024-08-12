import axios from "axios";

export const commonrequest = (method, url, body={}, header) => {
  const config = {
    method,
    url,
    data: body,
    headers: header || {
      "Content-Type": "application/json",
    },
    withCredentials: true
  };

  return axios(config).then((data) => {
      return data;
    }).catch((error) => {
      return error;
    });
};
