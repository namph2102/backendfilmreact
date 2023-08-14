import ToastMessage, { validatorImage } from "../js/style.module.js";

mobiscroll.setOptions({
  theme: "ios",
  themeVariant: "light",
});
const thumb = document.getElementById("thumb");
const poster = document.getElementById("poster");

function uploadFileModule(e, name) {
  const file = e.target.files[0];
  const formData = new FormData();
  formData.append("file", file);
  fetch("/uploadfile", { method: "POST", body: formData })
    .then((res) => res.json())
    .then((data) => {
      if (data.status == 200) {
        const { url, path } = data.image;
        if (name) {
          document.getElementById(`${name}_path`).setAttribute("value", path);
          document.getElementById(`${name}_url`).setAttribute("value", url);
          document.getElementById(`${name}img`).setAttribute("src", url);
        }
        ToastMessage.success("Tải ảnh thành công");
      }
    });
}

thumb.addEventListener("change", function (e) {
  uploadFileModule(e, "thumb");
});

poster.addEventListener("change", function (e) {
  uploadFileModule(e, "poster");
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
