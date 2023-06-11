import ToastMesage, {
  coverNumber,
  dateTimeFormat,
  renderKingofModalStatus,
} from "./style.module.js";
export const btnFilterSort = document.getElementById("btn_filter");
export const sortContainer = document.getElementById("sort_container");
btnFilterSort?.addEventListener("click", function () {
  this.classList.toggle("btn_close");
  sortContainer?.classList.toggle("hideElement");
});
export const listItem_container = document.querySelector("#listItem_container");
export const btnSearch = document.getElementById("btn_search");
export const inputSearch = document.getElementById("search");
export const inputKeyword = document.getElementById("input_keyword");
export const resultContainer = document.getElementById("result_container");
export const searchcontent = document.getElementById("search_content");
export const search_box = document.getElementById("search_box");

const iconSearch = btnSearch?.querySelector("i");
// Search
export const handleSearch = (e, renderSearchItem) => {
  if (e.target.value) {
    inputKeyword.innerHTML = e.target.value;
    const valueSearch = e.target.value.toLowerCase().trim();
    searchcontent.innerHTML = renderSearchItem(valueSearch);
    resultContainer.classList.remove("hidden");
    search_box.classList.remove("rounded-full");
  } else {
    resultContainer.classList.add("hidden");
    search_box.classList.add("rounded-full");
  }
  changeStatusbtnSearch();
};

if (iconSearch && btnSearch && resultContainer) {
  resultContainer.querySelector("h5").onclick = (e) => e.preventDefault();
  //end search
  btnSearch.onclick = changeStatusbtnSearch;
}

function changeStatusbtnSearch() {
  if (!iconSearch) return;
  if (inputSearch.value) {
    resultContainer.classList.remove("hidden");
  } else {
    resultContainer.classList.add("hidden");
  }
  const checkIconisSearch = iconSearch.classList.contains(
    "fa-magnifying-glass"
  );
  if (!inputSearch.value && !checkIconisSearch) {
    iconSearch.className =
      "fa-solid fa-magnifying-glass text-blue-600 hover:text-blue-700";
  } else if (checkIconisSearch && inputSearch.value) {
    iconSearch.className =
      "fa-solid fa-circle-xmark text-blue-600 hover:text-blue-700";
  }
}

// modal select
export const modalView = document.getElementById("modal_views");
export const modalStatus = document.getElementById("modal_status");
modalView.addEventListener("click", closeModalPro);
modalStatus.addEventListener("click", closeModalPro);
export const modal_btnApply = modalStatus.querySelector(".modal__btn--apply");
function closeModalPro(e) {
  if (
    e.target.closest(".modal-content") &&
    !e.target.closest(".btn_close-modal")
  ) {
    return;
  }
  this.classList.toggle("hideElement");
}
//close modal
document.addEventListener("keydown", function (e) {
  if (e.key == "Escape") {
    modalView.classList.add("hideElement");
    modalStatus.classList.add("hideElement");
    inputSearch.value = "";
  }
  changeStatusbtnSearch();
});
document.addEventListener("click", () => {
  if (!inputSearch) return;
  if (inputSearch.value) {
    inputSearch.value = "";
  }
  changeStatusbtnSearch();
});
export const payment_container = document.getElementById("payment_container");
export const renderListTopup = (dataSource, row = 4) => {
  $("#pagination_payment").pagination({
    dataSource,
    pageSize: row,
    formatResult: function (listTopup) {
      return listTopup.map(
        (topup, index) => `  <tr id="${
          topup._id
        }" class="bg-[#151F30] border-y-[10px] border-[#131720] rounded-3xl topup_item">
        <td>
            <div class="max-w-[80px] overflow-auto scroll_with-none mt-4 mx-2">
                #${topup._id}
            </div>
        </td>
        <td>${topup.payCode}</td>

        <td>${topup.nameWallet || topup.nameBank}</td>
        <td>${coverNumber(topup.money)}</td>
        <td>${
          topup.status == 1
            ? `<span class="text-yellow-300">Chờ xử lý</span>`
            : topup.status == 2
            ? `<span class="text-green-500">Thành công</span>`
            : `<span class="text-red-500">Thất bại</span>`
        }</td>
        <td>${dateTimeFormat(topup.createdAt)}</td>
        <td data-id="${topup._id}" data-index="${index}" class="btn_actions">
            <div class="min-w-[160px]">
            ${
              (topup.status == 1 &&
                ` <button title="Đồng ý" class="btn_agree">
            <i class="fa-solid fa-handshake"></i>
        </button>
        <button title="Thất bại" class="btn_fail">
            <i class="fa-solid fa-heart-crack"></i>
        </button>`) ||
              ""
            }
                <button title="View" class="btn_view">
                    <i class="fa-solid fa-eye"></i>
                </button>

                <button title="Xóa" class="btn_delete">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        </td>
    </tr>`
      );
    },
    callback: function (data, pagination) {
      document.getElementById("payment_container").innerHTML = data.join("");
    },
  });
  renderPayment(dataSource, row);
};

export const renderDisplayviewTopup = (topupItem) => {
  const html = `
<div class="flex gap-3 mb-2  min-w-[300px]">
  <img
    src="${topupItem.account.avata}"
    width="40"
    height="40"
    class="object-cover rounded-lg"
    alt=""
  />
  <div>
    <p><strong>Auhor:</strong> <sub>${topupItem.account.fullname}</sub></p>
    <p class="text-base"> ${dateTimeFormat(
      topupItem.updatedAt
    )}   <sub class="text-xs">${moment(
    topupItem.createdAt
  ).fromNow()}</sub> </p>
  </div>
</div>
</div>
  <article
  class="lg:max-w-[800px] sm:max-w-full  w-full mt-4 text-sm"
>
  <h2 class="mb-2 text-xl text-center font-bold">TopUp Detail</h2>
  <div class="grid sm:grid-cols-2 grid-cols-1   gap-3">
    <div>
      <label for="idpaycode"> ID </label>
      <input
        type="text"
        readonly
        class="input_style"
        value="#${topupItem._id}"
        id="idpaycode"
      />
    </div>
    <div>
      <label for="paycode">Payment </label>
      <input type="text" readonly class="input_style" value="${
        topupItem.nameWallet || topupItem.nameBank
      }" />
    </div>
    <div>
      <label for="paycode"> Pay Code </label>
      <input
        type="text"
        readonly
        class="input_style"
        value="${topupItem.payCode}"
        id="paycode"
      />
    </div>
    <div>
      <label for="Seri"> Seri </label>
      <input
        type="text"
        readonly
        id="Seri"
        class="input_style"
        value="${topupItem.seri}"
      />
    </div>
    <div>
      <label for="Money"> Money </label>
      <input
        type="text"
        readonly
        id="Money"
        class="input_style"
        value="${coverNumber(topupItem.money)}"
      />
    </div>
    <div>
      <label for="Status"> Status </label>
      <input
        type="text"
        readonly
        id="Status"
        class="input_style"
        value="${
          topupItem.status == 1
            ? `Chờ xử lý`
            : topupItem.status == 2
            ? `Thành công`
            : `Thất bại`
        }"
      />
    </div>
    <div>
      <label for="CreateAt"> CreateAt </label>
      <input
        type="text"
        readonly
        id="CreateAt"
        class="input_style"
        value="${dateTimeFormat(topupItem.createdAt)}"
      />
    </div>
    <div>
      <label for="UpdateAt"> UpdateAt </label>
      <input
        type="text"
        readonly
        id="UpdateAt"
        class="input_style"
        value="${dateTimeFormat(topupItem.updatedAt)}"
      />
    </div>
  </div>
</article>
<button
  title="Close (Esc)"
  type="button"
  class="absolute -top-2 right-1 text-4xl hover:text-red-500 btn_close-modal"
>
  ×
</button>`;
  document.querySelector("#modal_views-container").innerHTML =
    html || "   <tr><td>Không có dữ liệu</td></tr>";
  modalView.classList.remove("hideElement");
};
// handle Topup

export const renderPayment = (listTopup = [], row = 4) => {
  if (!payment_container) return;
  payment_container.onclick = (e) => {
    if (e.target.closest("button")) {
      const buttonElement = e.target.closest("button");
      const idTopup = buttonElement.closest(".btn_actions").dataset.id;
      const index = buttonElement.closest(".btn_actions").dataset.index;

      if (!idTopup) return false;

      if (buttonElement.classList.contains("btn_view")) {
        const itemTopup = listTopup.find((item) => item._id == idTopup);
        itemTopup && renderDisplayviewTopup(itemTopup);
        return;
      } else if (buttonElement.classList.contains("btn_delete")) {
        renderKingofModalStatus("Bạn muốn xóa nội dung nạp này!");
        modal_btnApply.onclick = () => {
          fetch("/topup/admin/" + idTopup, {
            method: "delete",
          })
            .then((res) => res.json())
            .then((data) => {
              ToastMesage.success(data.message);
              listTopup.splice(index, 1);
              buttonElement.closest(".topup_item").classList.add("hideElement");
              modalStatus.classList.add("hideElement");
              renderListTopup(listTopup);
            })
            .catch((err) => {
              ToastMesage.warning(err.message);
            });
        };
      } else {
        const status = buttonElement.classList.contains("btn_agree")
          ? 2
          : buttonElement.classList.contains("btn_fail")
          ? 3
          : 0;

        if (status) {
          renderKingofModalStatus(
            `Thanh toán này là ${status == 2 ? "thành công" : "thất bại"}?`
          );
          modal_btnApply.onclick = () => {
            fetch("/topup/admin/checktopup", {
              method: "post",
              headers: {
                "content-type": "application/json",
              },
              body: JSON.stringify({ idTopup, status }),
            })
              .then((res) => res.json())
              .then((data) => {
                const { coin, expLv, vip } = data.account;
                const vipElement = document.querySelector("#vip");
                const expLvElement = document.querySelector("#expLv");
                const coinElement = document.querySelector("#coin");
                if (vipElement && coinElement) {
                  vipElement.value = vip;
                  expLvElement.value = expLv;
                  coinElement.value = coin;
                }

                ToastMesage.success(data.message);
                const itemTopup = listTopup.find((item) => item._id == idTopup);
                itemTopup.status = status;
                modalStatus.classList.add("hideElement");
                renderListTopup(listTopup, row);
              })
              .catch((err) => {
                ToastMesage.warning(err.message);
              });
          };
        }
      }
    }
  };
};

//// handle comment

//render viewComment
const renderDisplayViewComment = (comment) => {
  const html = `
  <div class="flex gap-3 mb-2  min-w-[300px]">
  <img
    src="${comment.user_comment.avata}"
    width="40"
    height="40"
    class="object-cover rounded-lg"
    alt=""
  />
  <div>
    <p><strong>Auhor:</strong> <sub>${comment.user_comment.fullname}</sub></p>
    <p class="text-base"> ${dateTimeFormat(
      comment.updatedAt
    )}   <sub class="text-xs">${moment(comment.updatedAt).fromNow()}</sub> </p>
  </div>
</div>
<article id="view_container" class="lg:max-w-[600px] sm:max-w-[400px] w-full mt-4 text-sm">
 ${comment.comment}
</article>

<button
title="Close (Esc)"
type="button"
class="absolute -top-2 right-1 text-4xl hover:text-red-500 btn_close-modal"
>
×
</button>
  `;
  document.querySelector("#modal_views-container").innerHTML = html;
  modalView.classList.remove("hideElement");
};
// render comment list follow user
const commentContainer = document.getElementById("comment_body");

export const renderListComment = (dataSource, row = 4) => {
  $("#paginacomment").pagination({
    dataSource,
    pageSize: row,
    formatResult: function (listComment) {
      return listComment.map(
        (
          comment,
          index
        ) => ` <tr class="bg-[#151F30] border-y-[10px] border-[#131720] rounded-3xl comment_list-item">
      <td>
          <div class="max-w-[80px] overflow-auto scroll_with-none mt-4 mx-2">
              #${comment._id}
          </div>
      </td>
      <td>${comment.user_comment.fullname}</td>
      <td>
          <div class="whitespace-nowrap text-ellipsis overflow-hidden max-w-[120px] py-4">
             ${comment.comment}
          </div>
      </td>
      <td> ${comment.subcomment?.length || 0}</td>
      <td> ${comment.total_like}</td>
      <td>${comment.is_edit ? "Edited" : "No"}</td>
      <td>${dateTimeFormat(comment.createdAt)}</td>
  
      <td data-index="${index}" data-id="${comment._id}" class="btn_actions">
          <div class="min-w-[160px]">
              <button class="btn_view">
                  <i class="fa-solid fa-eye"></i>
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
      commentContainer.innerHTML = data.join("");
    },
  });
  commentAcciton(dataSource);
};
const commentAcciton = (listComment, row = 4) => {
  commentContainer.onclick = (e) => {
    if (e.target.closest("button")) {
      const buttonElement = e.target.closest("button");
      const idComment = buttonElement.closest(".btn_actions").dataset.id || 0;
      if (!idComment) {
        return false;
      }

      if (buttonElement.classList.contains("btn_view")) {
        const comment = listComment.find((comment) => comment._id == idComment);
        if (!comment) return false;
        renderDisplayViewComment(comment);
      } else if (buttonElement.classList.contains("btn_delete")) {
        renderKingofModalStatus("Bạn có chắc chắn xóa bình luận này không !");
        modal_btnApply.onclick = () => {
          fetch("/comments/admin/delete", {
            method: "post",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({ data: { idcommemt: idComment } }),
          })
            .then((res) => res.json())
            .then((res) => {
              ToastMesage.success(res.message);
              e.target
                .closest(".comment_list-item")
                .classList.add("hideElement");
              listComment.splice(Number(buttonElement.dataset.index), 1);
              modalStatus.classList.add("hideElement");
              renderListComment(listComment, row);
            })
            .catch((err) => ToastMesage.warning(err.message));
        };
      }
    }
  };
};
