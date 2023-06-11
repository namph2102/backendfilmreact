import ToastMessage, { validatorImage } from "../js/style.module.js";

mobiscroll.setOptions({
  theme: "ios",
  themeVariant: "light",
});
const thumb = document.getElementById("thumb");
const poster = document.getElementById("poster");
const thumbimg = document.getElementById("thumbimg");
const posterimg = document.getElementById("posterimg");

thumb.addEventListener("change", function (e) {
  validatorImage(e, thumbimg, 1000);
});

poster.addEventListener("change", function (e) {
  validatorImage(e, posterimg, 1500);
});
fetch("/category")
  .then((res) => res.json())
  .then((responsve) => {
    if (responsve.status == 200) {
      document.getElementById("categories").innerHTML = responsve.listCate.map(
        (cate) => ` <option value="${cate._id}">${cate.category}</option>`
      );
    }

    mobiscroll.select("#categories", {
      inputElement: document.getElementById("categories-input"),
    });
  })
  .catch((err) => {
    console.log(err.message);
  });

const categoryContainer = document.getElementById("category-container");
categoryContainer.addEventListener("click", (e) => {
  if (e.target.closest("button")) {
    e.target.closest("li").classList.add("hidden");
    const idFilm = document.getElementById("idFilm").value;
    const buttonElement = e.target.closest("button");
    const idCate = buttonElement.dataset.id;
    const data = {
      idFilm,
      idCate,
    };
    console.log(data);
    fetch("/category/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        ToastMessage.success(data.message + " " + buttonElement.dataset.name);
      })
      .catch(() => {
        ToastMessage.warning("Xóa thất bại" + " " + buttonElement.dataset.name);
      });
  }
});
