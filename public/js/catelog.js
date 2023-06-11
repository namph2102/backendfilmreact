import ToastMessage, {
  average,
  cleanListActive,
  coverNumber,
  renderKingofModalStatus,
  dateTimeFormat,
  dateFormat,
} from "./style.module.js";

import {
  btnFilterSort,
  sortContainer,
  handleSearch,
  inputSearch,
  modalView,
  listItem_container,
  modal_btnApply,
  modalStatus,
} from "./utils.module.js";
const renderSearchItem = (valueSearch) => {
  return listfilm
    .filter(
      (item) =>
        item._id.includes(valueSearch) ||
        item.name.trim().toLowerCase().includes(valueSearch)
    )
    .map(
      (item) => `<li>
<a class="block p-1 hover:bg-slate-950" href="/catelog/additem?idFilm=${item._id}">
    <figure class="flex gap-x-2">
        <img src="${item.thumb_url}" width="40" height="80" class="object-cover" >
        <figcaption>
            <div class="flex flex-col">
                <span class="text-base hover:text-yellow-400">
                   ${item.name}</span>
                <span class="text-sm"> ${item.origin_name}</span>
            </div>
        </figcaption>
    </figure>
</a>
</li>`
    )
    .join("");
};

// search hre
inputSearch.addEventListener("input", (e) => handleSearch(e, renderSearchItem));

// sort
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
      listfilm = listfilm.sort((a, b) => {
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
    } else {
      listfilm = listfilm.sort((a, b) => {
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
    renderList(listfilm, listRating);
    cleanListActive(sortContainer.querySelectorAll("li"));
    liElement.classList.add("active");
  }
});

// end sort
let listfilm = [];
let listRating = [];

// render content
const renderList = (dataSource, listRating) => {
  listfilm = [];
  $("#pagination").pagination({
    dataSource,
    pageSize: 5,
    formatResult: function (list) {
      return (
        list.map((film) => {
          film.averageStar = average(
            listRating.find((item) => item._id == film._id)?.sumstar,
            film.star
          );
          listfilm.push(film);
          return `
          <tr class="bg-[#151F30] border-y-[10px] border-[#131720] itemSort">
            <td>
                <div class="max-w-[80px] overflow-auto scroll_with-none mt-4 mx-2">
                    #${film._id}
                </div>
            </td>
            <td>
                <div class="py-4 mt-2 min-w-fit whitespace-nowrap px-4">
                ${film.name}
                </div>
            </td>
            <td><i class="fa-regular fa-star text-blue-800"></i>  
            <span class="sort_star">${film.averageStar || 5}</span>
            </td>
            <td>
                <div class="px-2 capitalize"> ${film.like}</div>
            </td>
            <td>
                <div class="px-2 whitespace-nowrap">${film.view}</div>
            </td>
            <td>
            <div class="px-2 whitespace-nowrap">${film.episode_current} / ${
            film.eposode_total
          }</div>
        </td>
            <td><div class="whitespace-nowrap">${dateFormat(
              film.updatedAt
            )}</div></td>
            <td class="btn_actions">
                <div class="min-w-[200px] actions_list-btn" data-id="${
                  film._id
                }" >
                    <button title=${
                      film.block ? "Mở khóa" : "Khóa"
                    } class="btn_lock ${film.block && "lock"}">
                        <i class="fa-solid fa-lock"></i>
                    </button>
                    <button  class="btn_view">
                        <i class="fa-solid fa-eye"></i>
                    </button>  
                    <a  class="block_btn-film"  href="/catelog/showEsopide/${
                      film._id
                    }">
                     <button ><i class="fa-solid fa-film"></i></button></a>
                   <a  class="block_btn-edit"  href="/catelog/additem?idFilm=${
                     film._id
                   }">
                    <button > <i class="fa-solid fa-pencil"></i></button></a>
                    <button class="btn_delete">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </td>
        </tr>
          `;
        }) || []
      );
    },
    callback: function (data, pagination) {
      listItem_container.innerHTML = data.join("");
    },
  });
};
// end content

// Get data
fetch("/api/getall")
  .then((res) => res.json())
  .then((data) => {
    listRating = data.listRating;
    renderList(data.listFilm, listRating);
    document.getElementById("total_item").textContent =
      data.listFilm.length.toLocaleString("en-vi");
  })
  .catch((err) => {
    ToastMessage.warning(err.message);
  });
// end  data

// render view Dataview
const renderDataView = (film) => {
  const html = `<h6 class="text-center pb-4 text-2xl">Film Detail</h6>
  <figure class="flex flex-col items-center mb-4">
      <a href="http://">
          <img class="w-[50px]  object-cover h-[80px]"
              src="${film.thumb_url}" alt="" />
      </a>
      <figcaption class="text-sm mt-2">${film.name}</figcaption>
  </figure>
  <article class="grid sm:grid-cols-2  grid-cols-1 gap-2">
      <div>
          <span class="px-2">Id:</span>
          <div>
              <input class="input_style style_text-nomarl w-full" readonly value="#${
                film._id
              }" />
          </div>
      </div>
      <div>
          <span class="px-2">Origin Name:</span>
          <div>
              <input class="input_style w-full" readonly value="${
                film.origin_name
              }" />
          </div>
      </div>
      <div class="col-span-1 sm:col-span-2">
          <span class="px-2">Category:</span>
          <div class="modal_views-category flex flex-wrap gap-2">
             ${film.category
               .map((item) => `<span>${item.category}</span>`)
               .join("")}
          </div>
      </div>

      <div class="grid sm:grid-cols-3 grid-cols-2  gap-2 sm:col-span-2 col-span-1">
          <div>
              <span class="px-2">Kind:</span>
              <div>
                  <input class="input_style w-full" readonly value="${
                    film.kind
                  }" />
              </div>
          </div>
          <div>
              <span class="px-2">Views:</span>
              <div>
                  <input class="input_style w-full" readonly value="${coverNumber(
                    film.view
                  )}" />
              </div>
          </div>
          <div>
              <span class="px-2">Like:</span>
              <div>
                  <input class="input_style w-full" readonly value="${coverNumber(
                    film.like
                  )}" />
              </div>
          </div>
          <div>
          <span class="px-2">Esopide Current:</span>
          <div>
              <input class="input_style w-full" readonly value="${coverNumber(
                film.episode_current
              )}" />
          </div>
      </div>
      <div>
      <span class="px-2">Esopide Total:</span>
      <div>
          <input class="input_style w-full" readonly value="${coverNumber(
            film.eposode_total
          )}" />
      </div>
  </div>
          <div>
              <span class="px-2">time:</span>
              <div>
                  <input class="input_style w-full" readonly value="${
                    film.time
                  }" />
              </div>
          </div>
          <div>
              <span class="px-2">Years:</span>
              <div>
                  <input class="input_style w-full" readonly value="${
                    film.year
                  }" />
              </div>
          </div>
          <div>
              <span class="px-2">Status:</span>
              <div>
                  <input class="input_style w-full" readonly value="${
                    film.status
                  }" />
              </div>
          </div>
      </div>
      <div>
          <span class="px-2">CreateAt:</span>
          <div>
              <input class="input_style w-full" readonly value="${dateTimeFormat(
                film.createdAt
              )}" />
          </div>
      </div>
      <div>
          <span class="px-2">UpdateAt:</span>
          <div>
              <input class="input_style w-full" readonly value="${dateTimeFormat(
                film.updatedAt
              )}" />
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
    const film = listfilm.find((film) => film._id == id);
    if (buttonelement.classList.contains("btn_view")) {
      if (film) {
        renderDataView(film);
      } else {
        ToastMessage.warning("Không tìm thấy phim");
      }
    } else {
      let link = "",
        type = "block";
      if (buttonelement.classList.contains("btn_lock")) {
        if (film.block) {
          renderKingofModalStatus(
            `Bạn có muốn <span class="text-yellow-400"> mở khóa</span> phim "${film.name}" không ?`
          );
        } else {
          renderKingofModalStatus(
            `Bạn có muốn  <span class="text-yellow-400"> khóa</span>   phim "${film.name}" không ?`
          );
        }
        link = "/api/blockfilm";
        type = "block";
      } else if (buttonelement.classList.contains("btn_delete")) {
        renderKingofModalStatus(
          `Bạn có muốn <span class="text-yellow-400"> Xóa </span> phim "${film.name}" không ?`
        );

        link = "/api/deleteFilm";
        type = "delete";
      }
      modal_btnApply.onclick = () => {
        fetch(link, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idFilm: id, block: !film.block }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (type == "block") {
              film.block = !film.block;
              buttonelement.title = film.block ? "Mở khóa" : "Khóa";
              buttonelement.classList.toggle("lock");
            } else {
              e.target.closest("tr").classList.add("hidden");
              const findIndex = listfilm.findIndex((item) => item._id === id);
              findIndex >= 0 && listfilm.splice(findIndex, 1);
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
