import ToastMessage, {
  average,
  cleanListActive,
  coverNumber,
  dateTimeFormat,
  dateFormat,
  renderKingofModalStatus,
} from "./style.module.js";
import {
  btnFilterSort,
  sortContainer,
  handleSearch,
  inputSearch,
  modalView,
  modalStatus,
  listItem_container,
} from "./utils.module.js";

let listUser = [];
// get api data
fetch("/user/getListUserRank", {
  method: "post",
  headers: {
    "content-type": "application/json",
  },
  body: JSON.stringify({ data: { getall: "oke" } }),
})
  .then((res) => res.json())
  .then((data) => {
    listUser = data.listUser || [];
    console.log(listUser);
    renderList(listUser);
    document.getElementById("total_item").textContent = listUser.length;
  })
  .catch((err) => {
    ToastMessage.warning(err.message);
  });
// end content

const renderSearchItem = (valueSearch) => {
  console.log(listUser);
  return listUser
    .filter(
      (item) =>
        item._id.includes(valueSearch) ||
        item.username.toLowerCase().trim().includes(valueSearch) ||
        item.fullname.toLowerCase().trim().includes(valueSearch) ||
        item.permission.toLowerCase().trim().includes(valueSearch)
    )
    .map(
      (item) => `<li>
<a class="block p-1 hover:bg-slate-950" href="/user/edituser/${item._id}">
  <figure class="flex gap-x-2">
      <img src="${item.avata}" width="40" height="80" class="object-cover" >
      <figcaption>
          <div class="flex flex-col">
              <span class="text-base hover:text-yellow-400">
                 ${item.fullname}</span>
              <span class="text-sm"> ${item.username}</span>
          </div>
      </figcaption>
  </figure>
</a>
</li>`
    )
    .join("");
};
// search input
inputSearch.addEventListener("input", (e) => handleSearch(e, renderSearchItem));
// sort container
sortContainer.addEventListener("click", function (e) {
  if (e.target.closest("li")) {
    const liElement = e.target.closest("li");

    btnFilterSort.click();
    const isSortZa = !liElement.classList.contains("active");
    ToastMessage.success(
      `Sắp xếp ${isSortZa ? " giảm dần " : " tăng dần "} theo ` +
        liElement.dataset.name
    );
    if (liElement.dataset?.type == "time") {
      listUser = listUser.sort((a, b) => {
        if (isSortZa) {
          return new Date(b[liElement.dataset.kind]) >
            new Date(a[liElement.dataset.kind])
            ? 1
            : -1;
        }
        new Date(b[liElement.dataset.kind]) <
        new Date(a[liElement.dataset.kind])
          ? 1
          : -1;
      });
    } else if (liElement.dataset?.type == "permission") {
      let result = [];
      listUser.forEach((user) => {
        switch (user.permission) {
          case "admin":
            isSortZa ? result.unshift(user) : result.push(user);
            break;
          case "member":
            isSortZa ? result.push(user) : result.unshift(user);
            break;
          default:
            result.splice(
              result.findIndex(
                (item) => item.permission == (isSortZa ? "member" : "admin")
              ) || 0,
              0,
              user
            );
        }
      });
      listUser = result;
    } else {
      listUser = listUser.sort((a, b) => {
        if (isSortZa) {
          return (
            Number(b[liElement.dataset.kind]) -
            Number(a[liElement.dataset.kind])
          );
        }
        return (
          Number(a[liElement.dataset.kind]) - Number(b[liElement.dataset.kind])
        );
      });
    }
    renderList(listUser);
    cleanListActive(sortContainer.querySelectorAll("li"));
    liElement.classList.add("active");
  }
});

// render user list container
const renderList = (dataSource) => {
  $("#pagination").pagination({
    dataSource,
    pageSize: 4,
    formatResult: function (listUser) {
      return listUser.map(
        (user) => `<tr class="bg-[#151F30] border-y-[10px] border-[#131720]">
      <td>
          <div class="max-w-[80px] overflow-auto scroll_with-none mt-4 mx-2">
              #${user._id}
          </div>
      </td>
      <td>
          <div class="py-3 mt-2 min-w-fit whitespace-nowrap px-4 flex items-center justify-center">
              <img src="${
                user.avata
              }" class="object-cover w-14 h-14 rounded-lg" 
                  class="rounded-full" alt="" />
              <div class="text-left pl-2 min-w-[200px] max-w-[300px] overflow-hidden text-clip whitespace-nowrap">
                  <p>${user.fullname}</p>
                  <p>${user.username}</p>
              </div>
          </div>
      </td>
      <td><span class="${user.permission} capitalize">${
          user.permission
        }</span></td>
      <td>
          <div class="px-2">${user.icons.length} </div>
      </td>
      <td>
          <div class="px-2 whitespace-nowrap">${coverNumber(user.coin)}</div>
      </td>
      <td>${dateFormat(user.updatedAt)}</td>
      <td class="btn_actions actions_list-btn" data-id="${user._id}">
          <div class="min-w-[160px]">
          <button title=${user.blocked ? "Mở khóa" : "Khóa"} class="btn_lock ${
          user.blocked && "lock"
        }">
              <i class="fa-solid fa-lock"></i>
          </button>
              <button class="btn_view">
                  <i class="fa-solid fa-eye"></i>
              </button>
              <a href="/user/edituser/${user._id}"> <button class="btn_edit">
              <i class="fa-solid fa-pencil"></i>
          </button></a>
            
              <button class="btn_delete">
                  <i class="fa-solid fa-trash-can"></i>
              </button>
          </div>
      </td>
  </tr>`
      );
    },
    callback: function (data, pagination) {
      listItem_container.innerHTML = data.join("");
    },
  });
};
// renderDataView modal view
const renderDataView = (user) => {
  console.log(user);
  const html = `  <h6 class="text-center pb-4 text-2xl">Account Detail</h6>
  <figure class="flex flex-col items-center mb-4">
    <a href="/user/edituser/${user._id}">
      <img
        class="w-[50px] object-cover h-[50px] rounded-full"
        src="${user.avata}"
        alt=""
      />
    </a>
  </figure>
  <article>
    <div class="grid sm:grid-cols-2 grid-cols-1 gap-2">
      <div>
        <span class="px-2">Id:</span>
        <div>
          <input
            class="input_style style_text-nomarl w-full"
            readonly
            value="#${user._id}"
          />
        </div>
      </div>
      <div>
        <span class="px-2">Username:</span>
        <div>
          <input class="input_style w-full" readonly value="${user.username}" />
        </div>
      </div>
    </div>
    <div">
      <div class="px-2">Icons:</d>
      <div class="flex flex-wrap gap-2 my-2">
      ${user.icons
        .map(
          (icon) => `   <img
      width="30px"
      height="30px"
      src="${icon.link}"
      alt=""
    />`
        )
        .join("")}
      
      
      </div>
    </div>
    <div class="grid gap-2 sm:grid-cols-3 grid-cols-2">
      <div>
        <span class="px-2">Permission:</span>
        <div>
          <input class="input_style w-full" readonly value="${
            user.permission
          }" />
        </div>
      </div>
      <div>
        <span class="px-2">Fullname:</span>
        <div>
          <input class="input_style w-full" readonly value="${user.fullname}" />
        </div>
      </div>
      <div>
        <span class="px-2">Total Coin:</span>
        <div>
          <input class="input_style w-full" readonly value="${coverNumber(
            user.coin
          )}" />
        </div>
      </div>
      <div>
        <span class="px-2">Name Level:</span>
        <div>
          <input class="input_style w-full" readonly value="${
            user.nameLevel.name
          }" />
        </div>
      </div>
      <div>
        <span class="px-2">Vip :</span>
        <div>
          <input class="input_style w-full" readonly value="${user.vip}" />
        </div>
      </div>
      <div>
        <span class="px-2">Block:</span>
        <div>
          <input class="input_style w-full" readonly value="${user.blocked}" />
        </div>
      </div>
      <div class="sm:col-span-3 col-span-2">
        <span class="px-2">Description:</span>
        <textarea
          name=""
          id=""
          rows="3"
          value="${user.description || "không có...."}"
          class="bg-[#151f30] w-full py-1 px-2 text-white"
        >
${user.description || ""}</textarea
        >
      </div>
    </div>
    <div class="grid gap-2 sm:grid-cols-2 grid-cols-1">
      <div>
        <span class="px-2">CreatedAt:</span>
        <div>
          <input class="input_style w-full" readonly value="${dateTimeFormat(
            user.createdAt
          )}" />
        </div>
      </div>
      <div>
        <span class="px-2">UpdatedAt:</span>
        <div>
          <input class="input_style w-full" readonly value="${dateTimeFormat(
            user.updatedAt
          )}" />
        </div>
      </div>
    </div>
  </article>
  <button title="Close (Esc)" type="button"
      class="absolute -top-2 right-1 text-4xl hover:text-red-500 btn_close-modal">
      ×
  </button>`;
  document.querySelector("#modal_views-container").innerHTML = html;
  modalView.classList.remove("hideElement");
};

// actction button handle
const tableContainer = document.getElementById("table_container");
tableContainer.addEventListener("click", function (e) {
  if (!e.target.closest("button")) return;
  const buttonelement = e.target.closest("button");
  if (buttonelement && buttonelement.className) {
    const id = e.target.closest(".actions_list-btn").dataset.id;
    const account = listUser.find((user) => user._id == id);
    if (buttonelement.classList.contains("btn_view")) {
      if (account) {
        renderDataView(account);
      } else {
        ToastMessage.warning("Không tìm thấy User");
      }
    } else {
      let link = "",
        type = "";
      if (buttonelement.classList.contains("btn_lock")) {
        if (account.blocked) {
          renderKingofModalStatus(
            `Bạn có muốn <span class="text-yellow-400"> mở khóa</span> tên "${account.fullname}" không ?`
          );
        } else {
          renderKingofModalStatus(
            `Bạn có muốn  <span class="text-yellow-400"> khóa</span>   tên "${account.fullname}" không ?`
          );
        }
        link = "/user/block";
        type = "block";
      } else if (buttonelement.classList.contains("btn_delete")) {
        renderKingofModalStatus(
          `Bạn có muốn <span class="text-yellow-400"> Xóa </span> tên "${account.fullname}" không ?`
        );

        link = "/user/deleteUser";
        type = "delete";
      }
      modalStatus.querySelector(".modal__btn--apply").onclick = () => {
        fetch(link, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: { _id: id, blocked: !account.blocked },
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (type == "block") {
              account.blocked = !account.blocked;
              buttonelement.title = account.blocked ? "Mở khóa" : "Khóa";
              buttonelement.classList.toggle("lock");
            } else {
              e.target.closest("tr").classList.add("hidden");
              console.log(e.target.closest("tr"));
              const findIndex = listUser.findIndex((item) => item._id === id);
              findIndex >= 0 && listUser.splice(findIndex, 1);
            }

            ToastMessage.success(data.message);
            modalStatus.classList.toggle("hideElement");
          })
          .catch((data) => {
            ToastMessage.success(data.message);
          });
      };
    }
  }
});
