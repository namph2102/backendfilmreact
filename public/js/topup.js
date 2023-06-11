import ToastMessage, { cleanListActive } from "./style.module.js";

import {
  btnFilterSort,
  sortContainer,
  inputSearch,
  handleSearch,
  renderListTopup,
  payment_container,
} from "./utils.module.js";
let listTopup = [];
const renderSearchItem = (valueSearch) => {
  return listTopup
    .filter(
      (item) =>
        item._id.includes(valueSearch) ||
        item.account.username.trim().toLowerCase().includes(valueSearch) ||
        item.account._id.trim().toLowerCase().includes(valueSearch) ||
        item.payCode.trim().toLowerCase().includes(valueSearch) ||
        item.nameWallet.trim().toLowerCase().includes(valueSearch) ||
        item.nameBank.trim().toLowerCase().includes(valueSearch)
    )
    .map(
      (item) => `<li>
  <a class="block p-1 hover:bg-slate-950" href="/topup/show/${item._id}">
      <figure class="flex gap-x-2">
          <img src="${
            item.account.avata
          }" width="40" height="80" class="object-cover" >
          <figcaption>
              <div class="flex flex-col">
                  <span class="text-base hover:text-yellow-400">
                     ${item.account.fullname}</span>
                     ${
                       item.status == 1
                         ? `<span class="text-yellow-300">Chờ xử lý</span>`
                         : item.status == 2
                         ? `<span class="text-green-500">Thành công</span>`
                         : `<span class="text-red-500">Thất bại</span>`
                     }
              </div>
          </figcaption>
      </figure>
  </a>
  </li>`
    )
    .join("");
};
// search topup
inputSearch.addEventListener("input", (e) => handleSearch(e, renderSearchItem));
//
const idPayment = document.getElementById("idPayment").value;

const fetchDAta = () => {
  fetch("/topup/show", {
    method: "post",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ getdata: true }),
  })
    .then((res) => res.json())
    .then((data) => {
      listTopup = data.listTopup || [];

      if (idPayment) {
        const item = listTopup.find((item) => item._id == idPayment);
        listTopup = listTopup.filter((item) => item._id != idPayment);
        item && listTopup.unshift(item);
      }
      renderListTopup(listTopup, 6);
    })
    .catch((err) => {
      console.log(err.message);
    });
};
fetchDAta();
//search

// sort
sortContainer.addEventListener("click", function (e) {
  if (e.target.closest("li")) {
    const liElement = e.target.closest("li");
    let newlistopup = [...listTopup];
    btnFilterSort.click();
    let isSortZa = !liElement.classList.contains("active");

    if (liElement.dataset?.type == "time") {
      console.log(isSortZa);
      ToastMessage.success(
        `Sắp xếp ${isSortZa ? " giảm dần " : " tăng dần "} theo ` +
          liElement.dataset.name
      );
      newlistopup = listTopup.sort((a, b) => {
        return (
          new Date(a[liElement.dataset.kind]) -
          new Date(b[liElement.dataset.kind])
        );
      });
    } else {
      newlistopup = listTopup.filter(
        (item) => item.status == liElement.dataset.value
      );
      ToastMessage.success(
        `Lọc theo trạng thái thanh toán ` + liElement.dataset.name
      );
    }
    renderListTopup(newlistopup, 6);
    cleanListActive(sortContainer.querySelectorAll("li"));
    liElement.classList.add("active");
  }
});
