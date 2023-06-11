import ToastMessage, {
  renderKingofModalStatus,
  validatorImage,
} from "./style.module.js";

import { modalView, modalStatus, modal_btnApply } from "./utils.module.js";
let listIcons = [];
/// addd icon
const renderFormAdd = () => {
  const html = ` <h6 class="text-center pb-4 text-2xl">Add Icon</h6>
    <form action="/icon/addIcon" id="formAddIcon" method="post" enctype="multipart/form-data">
      <div>
        <label for="name"> Name </label>
        <input
          type="text"
          id="icon_title"
          class="input_style"
          name="title"
          required
          placeholder="Enter your Icon ...."
        />
      </div>
      <p class="mb-2 basis-full">Icons</p>
      <div class="flex items-center justify-center">
        <label for="icon_add" class="cursor-pointer relative">
          <div
            class="w-40 h-40 border-2 flex items-center justify-center border-dashed border-white"
          >
            Upload Icons
          </div>
          <img class="absolute inset-0 w-full h-full" src="" id="image_id" />
        </label>
        <input type="file"  name="uploads" id="icon_add" hidden />
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
    </button>`;

  document.querySelector("#modal_views-container").innerHTML = html;
  modalView.classList.toggle("hideElement");
  let checkExtended = "";
  document.getElementById("icon_title").addEventListener("blur", (e) => {
    if (e.target.value) {
      checkExtended = listIcons.find(
        (icon) =>
          icon.title.toLowerCase() == e.target.value.toLowerCase().trim()
      );
    }
  });
  const imageElement = document.getElementById("image_id");
  let checkimage = false;
  document.getElementById("icon_add").addEventListener("change", (e) => {
    checkimage = validatorImage(e, imageElement, 200);
  });
  document
    .getElementById("formAddIcon")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      if (checkExtended) {
        ToastMessage.warning("Đã tồn tại icon này");
        return;
      }
      if (!checkimage) {
        ToastMessage.warning("Vui lòng chọn ảnh khác");
        return;
      }
      ToastMessage.success("Upload ảnh thành công!");

      this.submit();
    });
};
const btnAddIcon = document.getElementById("btn_add-icon");
btnAddIcon.onclick = () => {
  renderFormAdd();
};
///end add icon
const icon_container = document.getElementById("icon_container");
// render user list container
const renderList = (dataSource) => {
  $("#pagination").pagination({
    dataSource,
    pageSize: 6,
    formatResult: function (listIcons) {
      return listIcons.map(
        (icon, index) => `
      <tr data-id="${icon._id}" data-index="${index}" 
      class="bg-[#151F30] border-y-[10px] border-[#131720] tr_item">
      <td>
          <div
              class="lg:max-w-[200px] max-w-[80px] pt-3 overflow-auto whitespace-nowrap scroll_with-none px-2">
              #${icon._id}
          </div>
      </td>

      <td>
          <div class="admin px-2 pt-3 overflow-auto whitespace-nowrap capitalize">${icon.title}</div>
      </td>
      <td>
          <div class="flex justify-center">
              <img width="40" height="40" class="object-cover"
                  src="${icon.link}" alt="" />
          </div>
      </td>

      <td class="btn_actions">
          <div class="min-w-[160px]">
            
              <button class="btn_edit">
                  <i class="fa-solid fa-pencil"></i>
              </button>
              <button class="btn_delete">
                  <i class="fa-solid fa-trash-can"></i>
              </button>
          </div>
      </td>
  </tr>
      `
      );
    },
    callback: function (data, pagination) {
      icon_container.innerHTML = data.join("");
    },
  });
};

const fetchDAta = () => {
  fetch("/icon/show", {
    method: "post",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ getAll: true }),
  })
    .then((res) => res.json())
    .then((data) => {
      listIcons = data.listIcons;
      renderList(listIcons);
    });
};
fetchDAta();
/// addd icon
const renderViewEditIcon = (icon) => {
  const html = ` <h6 class="text-center pb-4 text-2xl">Edit Icon</h6>
      <form  class="min-w-[300px]" action="/icon/editIcon" id="formEditicon" method="post" enctype="multipart/form-data">
        <div>
        <input hidden name="id" value="${icon._id}" />
          <label for="name"> Name </label>
          <input
            type="text"
            id="icon_title"
            class="input_style"
            name="title"
            required
            value="${icon.title}"
            placeholder="Enter your Icon ...."
          />
        </div>

        <div>
        <label for="icon_link"> Link </label>
        <input
          type="text"
          id="icon_link"
          class="input_style"
          name="link"
          value="${icon.link}"
          required
          placeholder="Enter your Link ...."
        />
      </div>

        <p class="mb-2 basis-full">Icons</p>
        <div class="flex items-center justify-center">
          <label for="icon_edit" class="cursor-pointer relative">
            <div
              class="w-40 h-40 border-2 flex items-center justify-center border-dashed border-white"
            >
              Upload Icons
            </div>
            <img class="absolute inset-0 w-full h-full" src="${icon.link}" id="image_id" />
          </label>
          <input type="file"  name="uploads" id="icon_edit" hidden />
        </div>
        <div class="basis-full text-center mt-8">
          <button
            type="submit"
            class="py-2 px-3 rounded-xl bg-blue-700 text-gray-100 hover:bg-white hover:text-black ease-linear duration-100 sm:w-[200px] w-4/5"
          >
            Edit Icon
          </button>
        </div>
      </form>
      <button
        title="Close (Esc)"
        type="button"
        class="absolute -top-2 right-1 text-4xl hover:text-red-500 btn_close-modal"
      >
        ×
      </button>`;

  document.querySelector("#modal_views-container").innerHTML = html;
  modalView.classList.toggle("hideElement");
  const imageElement = document.getElementById("image_id");
  let checkimage = false;
  document.getElementById("icon_edit").addEventListener("change", (e) => {
    checkimage = validatorImage(e, imageElement, 200);
  });
  const formEdit = document.getElementById("formEditicon");
  formEdit.addEventListener("submit", function (e) {
    e.preventDefault();
    const title = this.title.value;
    const link = this.link.value;
    const data = {
      id: icon._id,
      title,
      link,
    };
    renderKingofModalStatus("Bạn chắc chắn sửa chứ?");
    modalView.classList.toggle("hideElement");
    modal_btnApply.onclick = () => {
      if (checkimage) {
        formEdit.submit();
      } else {
        fetch("/icon/editicon", {
          method: "post",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then((res) => res.json())
          .then((data) => {
            ToastMessage.success(data.message);
            fetchDAta();
          })
          .catch((err) => ToastMessage.warning(err.message))
          .finally(() => {
            modalStatus.classList.toggle("hideElement");
          });
      }
    };
  });
};

icon_container.onclick = (e) => {
  if (e.target.closest("button")) {
    const buttonElement = e.target.closest("button");
    const id = e.target.closest(".tr_item").dataset.id;
    const index = e.target.closest(".tr_item").dataset.index;
    if (buttonElement.classList.contains("btn_delete")) {
      renderKingofModalStatus("Bạn chắc chắn muốn xóa icon này không?");
      modal_btnApply.onclick = () => {
        fetch("/icon/delete/" + id, {
          method: "delete",
        })
          .then((res) => res.json())
          .then((data) => {
            ToastMessage.success(data.message);
            fetchDAta();
          })
          .catch((err) => ToastMessage.warning(err.message))
          .finally(() => {
            modalStatus.classList.toggle("hideElement");
          });
      };
    }
    if (buttonElement.classList.contains("btn_edit")) {
      const icon = listIcons.find((icon) => icon._id == id);
      if (!icon) {
        ToastMessage.warning("Icon không tồn tại");
        return;
      }
      renderViewEditIcon(icon);
    }
  }
};
