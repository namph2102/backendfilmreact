function handleMenu() {
  // remove menu with mobile
  const btn_menu = document.getElementById("btn_menu");
  const header_container = document.getElementById("header_container");
  btn_menu.addEventListener("click", function () {
    this.classList.toggle("btn_close");
    header_container.classList.toggle("menu_mobile");
  });
  //end remove menu
}
handleMenu();
const options = {
  className: "toast-success",
  duration: 3000,
  newWindow: true,
  close: true,
};
class ToastMessage {
  success(text) {
    Toastify({
      text,
      ...options,
      style: {
        background: "linear-gradient(to right,#008000 , #008000)",
      },
    }).showToast();
  }
  warning(text) {
    Toastify({
      text,
      ...options,
      style: {
        background: "linear-gradient(to right,#5a6303 , #5a6303)",
      },
    }).showToast();
  }
}
export const average = (total, Amount) => {
  if (!Amount || !total) return 5;
  const avgerage = total / Amount + "";
  if (avgerage.includes(".")) {
    return Number(avgerage).toFixed(2);
  }
  return avgerage;
};
export const cleanListActive = (list = [], elementActive = "active") => {
  [...list].forEach((item) => item.classList.remove(elementActive));
};
export const coverNumber = (number = 0) => {
  if (typeof number != "number") return number;
  return number.toLocaleString("en-vi");
};
export const renderKingofModalStatus = (message) => {
  document.querySelector("#modal_status .modal__message").innerHTML = message;
  document.querySelector("#modal_status").classList.remove("hideElement");
  document
    .querySelector("#modal_status .modal__btn--apply")
    .setAttribute("data-status", false);
};
export const dateFormat = (time) => {
  return moment(time).format("DD/MM/YYYY");
};
export const dateTimeFormat = (time) => {
  return moment(time).format("DD/MM/YYYY - HH:mm:ss");
};

const ToastMesageInfo = new ToastMessage();
// Validator Image
const validImageTypes = ["image/gif", "image/jpeg", "image/png", "image/jpg"];
export const validatorImage = (e, ImageElement, sizeImage = 200) => {
  const file = e.target.files[0];
  if (file.size >= 1024 * sizeImage) {
    ToastMesageInfo.warning(
      `Ảnh bạn đang có dung lượng ${Math.ceil(
        file.size / 1024
      )} KB > ${sizeImage}KB`
    );
    return false;
  }
  const fileType = file["type"];
  if (!validImageTypes.includes(fileType)) {
    ToastMesageInfo.warning("Chỉ chấp nhận ảnh có đuôi git, png, jpg, jpeg !");
    return false;
  }
  ToastMesageInfo.success("Bạn có thẻ sử dụng ảnh này!");
  if (ImageElement.src) {
    URL.revokeObjectURL(ImageElement.src);
  }
  const srcImage = URL.createObjectURL(file);
  ImageElement.src = srcImage;
  return true;
};
export default new ToastMessage();
