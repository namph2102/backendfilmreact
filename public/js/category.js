import ToastMessage, { renderKingofModalStatus } from "./style.module.js";

import { modalView, modalStatus, modal_btnApply } from "./utils.module.js";
let listCategory = [];
const renderListComment = (dataSource) => {
  $("#pagination").pagination({
    dataSource,
    pageSize: 5,
    formatResult: function (listCategory) {
      return listCategory.map(
        (
          category,
          index
        ) => ` <tr class="bg-[#151F30] border-y-[10px] border-[#131720]">
              <td>
                  <div class="max-w-[80px] overflow-auto scroll_with-none mt-4 mx-2">
                      #${category._id}
                  </div>
              </td>
              <td>
                  <div class="py-4 mt-2 min-w-fit whitespace-nowrap px-4 capitalize">
                  ${category.category}
                  </div>
              </td>
              <td>
                  <div class="py-4 mt-2 min-w-fit whitespace-nowrap px-4">
                  ${category.slug}
                  </div>
              </td>
              <td data-id="${category._id}" data-index="${index}" class="btn_actions">
                  <div class="min-w-[160px]">
                      <button class="btn_edit">
                          <i class="fa-solid fa-pencil"></i>
                      </button>
                      <button class="btn_delete">
                          <i class="fa-solid fa-trash-can"></i>
                      </button>
                  </div>
              </td>
          </tr>`
      );
    },
    callback: function (data, pagination) {
      document.getElementById("country").innerHTML = data.join("");
    },
  });
};
const feactData = () => {
  fetch("/category")
    .then((res) => res.json())
    .then((data) => {
      listCategory = data.listCate || [];
      console.log(listCategory);
      renderListComment(listCategory);
    });
};
feactData();
const btnAddCategory = document.getElementById("btn_add-category");
// /country/show
const renderModalViewAdd = () => {
  const html = `<form method="post"  id="AddCategory">
  <h6 class="text-center pb-4 text-2xl">New Category</h6>
  <div>
    <label  for="category">Category</label>
    <input
      type="text"
      class="input_style"
      id="create_category"
      name="category"
      required
      placeholder="Enter new category...."
    />
  </div>
  <div class="basis-full text-center mt-8">
    <button
      type="submit"
      class="py-2 px-3 rounded-xl bg-blue-700 text-gray-100 hover:bg-white hover:text-black ease-linear duration-100 sm:w-[200px] w-4/5"
    >
      Create
    </button>
  </div>
</form>
<button
title="Close (Esc)"
type="button"
class="absolute -top-2 right-1 text-4xl hover:text-red-500 btn_close-modal"
>
×
</button>
`;
  document.querySelector("#modal_views-container").innerHTML = html;
  modalView.classList.toggle("hideElement");
  document
    .querySelector("#AddCategory")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      modalView.classList.toggle("hideElement");
      const category = this.category.value;
      renderKingofModalStatus(`Bạn chắn muốn thêm ${category} không!`);
      modal_btnApply.onclick = () => {
        fetch("/category/addcate", {
          method: "post",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ data: { category } }),
        })
          .then((res) => res.json())
          .then((data) => {
            feactData();
            ToastMessage.success(data.message);
          })
          .catch((err) => {
            ToastMessage.warning(err.message);
          });
        this.category.value = "";
        modalStatus.classList.toggle("hideElement");
      };
    });
};
const renderModalViewEdit = (category) => {
  const html = `  <form method="post" id="editCategory">
  <h6 class="text-center pb-4 text-2xl">Edit Category</h6>
  <div>
    <label for="name_category">Category</label>
    <input type="text" hidden name="id_category" value="${category._id}" />
    <input
      type="text"
      class="input_style capitalize"
      id="name_category"
      name="name_category"
      value="${category.category}"
      required
      placeholder="Enter new category...."
    />
  </div>
  <div>
    <label for="slug_category">Slug</label>
    <input
      type="text"
      class="input_style"
      id="slug_category"
      name="slug_category"
      value="${category.slug}"
      required
      placeholder="Enter new slug category...."
    />
  </div>
  <div class="basis-full text-center mt-8">
    <button
      type="submit"
      class="py-2 px-3 rounded-xl bg-blue-700 text-gray-100 hover:bg-white hover:text-black ease-linear duration-100 sm:w-[200px] w-4/5"
    >
      Edit Category
    </button>
  </div>
</form>
<button
title="Close (Esc)"
type="button"
class="absolute -top-2 right-1 text-4xl hover:text-red-500 btn_close-modal"
>
×
</button>
`;
  document.querySelector("#modal_views-container").innerHTML = html;
  modalView.classList.toggle("hideElement");
  document
    .getElementById("editCategory")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const category = this.name_category.value;
      const slug = this.slug_category.value;
      const id = this.id_category.value;
      if (
        category == category.category &&
        id == category._id &&
        slug == category.slug
      ) {
        ToastMessage.warning("Bạn chưa thay đổi gì!");
        return;
      }
      modalView.classList.toggle("hideElement");

      renderKingofModalStatus(`Bạn muốn thay đổi ${category} ?`);
      modal_btnApply.onclick = () => {
        fetch("/category/edit", {
          method: "post",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            category: category,
            slug: slug,
            id: id,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            ToastMessage.success(data.message);
            feactData();
          })
          .catch((err) => ToastMessage.warning(err.message));

        modalStatus.classList.add("hideElement");
      };
    });
};
btnAddCategory.onclick = () => {
  renderModalViewAdd();
};
document.getElementById("table_container").addEventListener("click", (e) => {
  if (e.target.closest("button")) {
    const buttonElement = e.target.closest("button");
    const id = buttonElement.closest(".btn_actions").dataset.id;
    if (buttonElement.classList.contains("btn_edit")) {
      const country = listCategory.find((item) => item._id == id);
      renderModalViewEdit(country);
    } else if (buttonElement.classList.contains("btn_delete")) {
      renderKingofModalStatus("Bạn  muốn xóa phải không?");
      modal_btnApply.onclick = () => {
        fetch(`/category/${id}`, {
          method: "delete",
        })
          .then((res) => res.json())
          .then((data) => {
            ToastMessage.success(data.message);
            feactData();
          })
          .catch((err) => ToastMessage.warning(err.message));
        modalStatus.classList.add("hideElement");
      };
    }
  }
});
