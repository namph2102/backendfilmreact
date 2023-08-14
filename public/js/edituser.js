import ToastMesage, { renderKingofModalStatus } from "./style.module.js";
import {
  modal_btnApply,
  modalStatus,
  renderListTopup,
  renderListComment,
  uploadFileModule,
} from "./utils.module.js";
let listComment,
  listTopup = [];
const hideAllElement = (list = [], elementHidden = "hideElement") => {
  [...list].forEach((item) => item.classList.add(elementHidden));
};
const removeAllActive = (list = [], classActive = "active") => {
  [...list].forEach((item) => item.classList.remove(classActive));
};
const handleOpenContainerContent = (e) => {
  if (e.target.closest("li")) {
    hideAllElement(content_menuList, "hideElement");
    const liElement = e.target.closest("li");

    const nameMenu = liElement.dataset.menu;
    menuActive.innerHTML = `<span class="capitalize">${nameMenu}</span>`;
    document.getElementById(nameMenu).classList.remove("hideElement");
    removeAllActive(listLiNameMenu);
    removeAllActive(listLinameMenuMobile);

    liElement.classList.add("active");
  }
};

// change UI view container main
const menuContainerLarge = document.getElementById("menu_tablet-large");
const menu_mobile = document.getElementById("menu_mobile");
const listLiNameMenu = menuContainerLarge.querySelectorAll("li");
const listLinameMenuMobile = menu_mobile.querySelectorAll("li");
const menuActive = document.getElementById("name_menu-selector");
const content_menuList = document.querySelectorAll(".content_menu");
menuContainerLarge.addEventListener("click", handleOpenContainerContent);
menu_mobile.addEventListener("click", handleOpenContainerContent);

const btnFilterSort = document.getElementById("btn_filter");

btnFilterSort.addEventListener("click", function () {
  this.classList.toggle("btn_close");
  menu_mobile.classList.toggle("hideElement");
});
// id input
const idUserInput = document.getElementById("iduser");
//delete icon
const iconsContainer = document.getElementById("icons_container");
iconsContainer.addEventListener("click", (e) => {
  if (e.target.closest(".icon_delete")) {
    const buttonDelete = e.target.closest(".icon_delete");
    const idUser = idUserInput.value;
    const idIcon = buttonDelete.dataset.id;
    if (!idUser) {
      console.log("Không tìm thấy idUser");
      return;
    }
    renderKingofModalStatus(
      `Bạn có muốn xóa icon <span class="text-red-600"> ${buttonDelete.dataset.title}</span> không`
    );
    modal_btnApply.onclick = () => {
      fetch("/user/deleteicon", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ idUser, idIcon }),
      })
        .then((res) => res.json())
        .then((data) => {
          ToastMesage.success(data.message);
          e.target.closest(".icon_content-box").classList.add("hideElement");
        })
        .catch((err) => {
          ToastMesage.warning(err.message);
        });
      modalStatus.classList.add("hideElement");
    };
  }
});

// change password submitPassword
const btnSubmitPassword = document.getElementById("submitPassword");
const passwordInput = document.getElementById("password");
const rpasswordInput = document.getElementById("rpassword");

btnSubmitPassword.onclick = () => {
  if (!idUserInput.value) return;
  const valuePassword = passwordInput.value.trim();
  const valueRPassword = rpasswordInput.value.trim();

  if (!valuePassword || !valueRPassword) {
    ToastMesage.warning("Dữ liệu không được bỏ trống !");
  } else if (valuePassword != valueRPassword) {
    ToastMesage.warning("Dữ liệu không khớp nhau!");
  } else {
    fetch("/user/admin/changePassword", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        idUser: idUserInput.value,
        newpassword: valueRPassword,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        ToastMesage.success(data.message);
        passwordInput.value = "";
        rpasswordInput.value = "";
      });
  }
};
// change avata
const avataInputFile = document.getElementById("avata");
const showAvata = document.getElementById("showAvata");

avataInputFile.onchange = async (e) => {
  const { url, path } = await uploadFileModule(e);
  showAvata.setAttribute("src", url);
  document.getElementById("user_link").setAttribute("value", url);
  document.getElementById("user_path").setAttribute("value", path);
};

//end handle comment

// end handle Topup
fetch("/user/admin/getinfomation", {
  method: "post",
  headers: {
    "content-type": "application/json",
  },
  body: JSON.stringify({ idUser: idUserInput.value }),
})
  .then((res) => res.json())
  .then((data) => {
    listComment = data.listcomment;
    listTopup = data.listTopup;

    renderListComment(listComment);
    renderListTopup(listTopup);
  })
  .catch((err) => {
    ToastMesage.warning(err.message);
  });
mobiscroll.setOptions({
  theme: "ios",
  themeVariant: "light",
});

mobiscroll.select("#icons", {
  inputElement: document.getElementById("icons-input"),
});
