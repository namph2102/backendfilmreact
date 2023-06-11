import ToastMessage, { renderKingofModalStatus } from "./style.module.js";

import { modalView, modalStatus, modal_btnApply } from "./utils.module.js";
let listCountry = [];
const renderListComment = (dataSource) => {
  $("#pagination").pagination({
    dataSource,
    pageSize: 5,
    formatResult: function (listComment) {
      return listComment.map(
        (
          comment,
          index
        ) => ` <tr class="bg-[#151F30] border-y-[10px] border-[#131720]">
              <td>
                  <div class="max-w-[80px] overflow-auto scroll_with-none mt-4 mx-2">
                      #${comment._id}
                  </div>
              </td>
              <td>
                  <div class="py-4 mt-2 min-w-fit whitespace-nowrap px-4 capitalize">
                  ${comment.country}
                  </div>
              </td>
              <td>
                  <div class="py-4 mt-2 min-w-fit whitespace-nowrap px-4">
                  ${comment.slug}
                  </div>
              </td>
              <td data-id="${comment._id}" data-index="${index}" class="btn_actions">
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
  fetch("/country/getall")
    .then((res) => res.json())
    .then((data) => {
      listCountry = data.listCountry || [];
      renderListComment(listCountry);
    });
};
feactData();
const btnAddCountry = document.getElementById("btn_add-country");
// /country/show
const renderModalViewAdd = () => {
  const html = `<form method="post" action="/country/show" id="addcountry">
  <h6 class="text-center pb-4 text-2xl">New Country</h6>
  <div>
    <label  for="Country">Country</label>
    <input
      type="text"
      class="input_style"
      id="create_country"
      name="country"
      required
      placeholder="Enter new country...."
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
    .querySelector("#addcountry")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      modalView.classList.toggle("hideElement");
      const country = this.country.value;
      renderKingofModalStatus(`Bạn chắn muốn thêm ${country} không!`);
      modal_btnApply.onclick = () => {
        fetch("/country/show", {
          method: "post",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ country }),
        })
          .then((res) => res.json())
          .then((data) => {
            feactData();
            ToastMessage.success(data.message);
          })
          .catch((err) => {
            ToastMessage.warning(err.message);
          });
        this.country.value = "";
        modalStatus.classList.toggle("hideElement");
      };
    });
};
const renderModalViewEdit = (country) => {
  const html = `  <form method="post" id="editCountry">
  <h6 class="text-center pb-4 text-2xl">Edit Country</h6>
  <div>
    <label for="name_Country">Country</label>
    <input type="text" hidden name="id_country" value="${country._id}" />
    <input
      type="text"
      class="input_style capitalize"
      id="name_country"
      name="name_country"
      value="${country.country}"
      required
      placeholder="Enter new country...."
    />
  </div>
  <div>
    <label for="slug_country">Slug</label>
    <input
      type="text"
      class="input_style"
      id="slug_country"
      name="slug_country"
      value="${country.slug}"
      required
      placeholder="Enter new slug country...."
    />
  </div>
  <div class="basis-full text-center mt-8">
    <button
      type="submit"
      class="py-2 px-3 rounded-xl bg-blue-700 text-gray-100 hover:bg-white hover:text-black ease-linear duration-100 sm:w-[200px] w-4/5"
    >
      Edit Country
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
    .getElementById("editCountry")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const country = this.name_country.value;
      const slug = this.slug_country.value;
      const id = this.id_country.value;
      fetch("/country/show", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ country: country, slug: slug, idCountry: id }),
      })
        .then((res) => res.json())
        .then((data) => ToastMessage.success(data.message))
        .catch((err) => ToastMessage.warning(err.message));
    });
};
btnAddCountry.onclick = () => {
  renderModalViewAdd();
};
document.getElementById("table_container").addEventListener("click", (e) => {
  if (e.target.closest("button")) {
    const buttonElement = e.target.closest("button");
    const id = buttonElement.closest(".btn_actions").dataset.id;
    console.log(buttonElement);
    if (buttonElement.classList.contains("btn_edit")) {
      const country = listCountry.find((item) => item._id == id);
      renderModalViewEdit(country);
    } else if (buttonElement.classList.contains("btn_delete")) {
      renderKingofModalStatus("Bạn  muốn xóa phải không?");
      modal_btnApply.onclick = () => {
        fetch(`/country/${id}`, {
          method: "delete",
        })
          .then((res) => res.json())
          .then((data) => ToastMessage.success(data.message))
          .catch((err) => ToastMessage.warning(err.message));
        modalStatus.classList.add("hideElement");
        feactData();
      };
    }
  }
});
