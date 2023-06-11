import { renderListComment } from "./utils.module.js";

const fetchData = () => {
  fetch("/comment/show", {
    method: "post",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ getAll: true }),
  })
    .then((res) => res.json())
    .then((data) => {
      renderListComment(data.listComments, 6);
    });
};
fetchData();
