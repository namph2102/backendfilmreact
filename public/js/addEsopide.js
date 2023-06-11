import ToastMesage, {
  renderKingofModalStatus,
  dateTimeFormat,
  coverNumber,
} from "./style.module.js";
import { modal_btnApply, modalStatus, modalView } from "./utils.module.js";
const inputID = document.getElementById("idFilm");
const formAdd = document.getElementById("formadd");
let fullLink = [];
let formEditOne = "";
formAdd.addEventListener("submit", function (e) {
  e.preventDefault();
  let listEsopideEmbeded = [],
    listEsopideStream = [];
  const valueListEsopideEmbeded = this.listEsopideEmbeded.value.trim();
  const valueListEsopideStream = this.listEsopideStream.value.trim();

  listEsopideEmbeded = CoverToListEsopide(valueListEsopideEmbeded);
  listEsopideStream = CoverToListEsopide(valueListEsopideStream, 2);

  if (
    !listEsopideEmbeded ||
    (listEsopideEmbeded.length > 0 && listEsopideEmbeded.some((item) => !item))
  ) {
    listEsopideEmbeded = [];
    console.log("Kiểm tra lại dữ liệu embed");
  }
  if (
    !listEsopideStream ||
    (listEsopideStream.length > 0 && listEsopideStream.some((item) => !item))
  ) {
    listEsopideStream = [];
    console.log("Kiểm tra lại dữ liệu m3u8");
  }

  if (listEsopideEmbeded.length >= 0 || listEsopideStream >= 0) {
    console.log(listEsopideEmbeded);
    console.log(listEsopideStream);
    // get data
    fetch("/filmdetail/addListFilm", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        idFilm: inputID.value,
        m3u8: listEsopideStream,
        embed: listEsopideEmbeded,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        ToastMesage.success(data.message);
        renderListEsopideContainer();
        this.listEsopideEmbeded.value = "";
        this.listEsopideStream.value = "";
      })
      .catch((err) => {
        ToastMesage.warning(err.message);
      });
  }
});
function replaceManySpace(str) {
  if (!str) return "";
  return str.replace(/  +/g, " ").trim();
}
function CoverToListEsopide(valueListTextarea, kind) {
  valueListTextarea = replaceManySpace(valueListTextarea);
  if (!valueListTextarea.includes("|")) {
    return false;
  }
  if (kind == 2) {
    if (!valueListTextarea.includes("m3u8")) {
      return false;
    }
  }
  if (valueListTextarea.includes("\n")) {
    const list = valueListTextarea.split("\n");
    return list.map((esopide) => {
      if (!esopide?.includes("|")) {
        console.log("List film không đúng theo yêu cầu");
        return false;
      }
      const [es, link] = esopide.split("|");
      return { esopide: `Tập ${Number(es)}`, link };
    });
  } else if (valueListTextarea.includes("|")) {
    const [es, link] = valueListTextarea.split("|");
    return [{ esopide: `Tập ${es}`, link }];
  }
  return false;
}

const displayEditView = (formEditOne) => {
  formEditOne.addEventListener("submit", function (e) {
    e.preventDefault();
    renderKingofModalStatus("Bạn chắc chắn thay đổi ?");
    modalView.classList.add("hideElement");
    modal_btnApply.onclick = () => {
      const data = {
        idembed: this.idembed.value,
        idm3u8: this.idm3u8.value,
        linkembed: this.linkembed.value,
        linkm3u8: this.linkm3u8.value,
        esopidem3u8: this.m3u8.value,
        esopideembed: this.embed.value,
        idFilm: inputID.value,
      };

      fetch("/filmdetail/uploadEsopide", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((data) => {
          ToastMesage.success(data.message);
          modalStatus.classList.add("hideElement");
          renderListEsopideContainer();
        })
        .catch((res) => ToastMesage.warning(res.message));
    };
  });
};
// formEditOne?.addEventListener("submit", function (e) {
//   e.preventDefault();
//   console.log(this.embed.value);
//   console.log(this.linkembed.value);
//   console.log(this.m3u8.value);
//   console.log(this.linkm3u8.value);
// });

// render view Dataview
const renderDataView = (item) => {
  console.log(item);
  const html = `
  <h6 class="text-center pb-4 text-2xl">Edit Esopide</h6>
  <form class="lg:min-w-[600px]" id="editOne">
    <input type="text" hidden  name="idembed"   value="${item.idembed}" />
    <input type="text" hidden name="idm3u8"   value="${item.idm3u8}" />

    <div class="mt-3 mb-1">
      <label for="esopideView" class="mb-2">Esopide Embed</label>
      <input
        type="text"
        class="input_style"
        name="embed"
        id="esopideView"
        value="${item.esopideembed}"
        placeholder="Enter Esopide"
        required
      />
    </div>
    <div class="mt-3 mb-1">
      <label for="esopideViewlinkembed" class="mb-2">Link embed</label>
      <input
        type="text"
        class="input_style"
        name="linkembed"
        id="esopideViewlinkembed"
        value="${item.embed}"
        placeholder="Enter Esopide"
        required
      />
    </div>
    <div class="my-2"></div>
    <div class="mt-3 mb-1">
      <label for="esopidem3u8" class="mb-2">Esopide m3u8</label>
      <input
        type="text"
        class="input_style"
        name="m3u8"
        id="esopidem3u8"
        value="${item.esopidem3u8}"
        placeholder="Enter Esopide"
        required
      />
    </div>
    <div class="mt-3 mb-1">
      <label for="esopideViewlinkm3u8" class="mb-2">Link m3u8</label>
      <input
        type="text"
        class="input_style"
        value="${item.m3u8}"
        name="linkm3u8"
        id="esopideViewlinkm3u8"
        placeholder="Enter Esopide"
        required
      />
    </div>
    <div class="basis-full text-center mt-4">
      <button
        type="submit"
        class="py-2 px-3 rounded-xl bg-blue-700 text-gray-100 hover:bg-white hover:text-black ease-linear duration-100 sm:w-[200px] w-4/5"
      >
        Edit
      </button>
    </div>
  </form>
    <button title="Close (Esc)" type="button"
        class="absolute -top-2 right-1 text-4xl hover:text-red-500 btn_close-modal">
        ×
    </button>`;
  document.querySelector("#modal_views-container").innerHTML = html;
  modalView.classList.remove("hideElement");
  formEditOne = document.getElementById("editOne");
  displayEditView(formEditOne);
};

const listItem_container = document.getElementById("listItem_container");
// render content
const renderList = (dataSource) => {
  $("#pagination").pagination({
    dataSource,
    pageSize: 5,
    formatResult: function (list) {
      return (
        list.map(
          (item, index) => `
          <tr data-embed="${
            item.idembed
          }" data-index="${index}"  data-esopide="${
            item.esopideembed || item.esopidem3u8
          }" data-m3u8="${
            item.idm3u8
          }" class="bg-[#151F30] border-y-[10px] border-[#131720] tr_item">
          <td  class="btn_actions">
                        <div class="min-w-[160px]"  >
                         
                            <button class="btn_edit">
                                <i class="fa-solid fa-pencil"></i>
                            </button>
                            <button class="btn_delete">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                    </td>
                    <td>
                        <div class="">${item.esopideembed}</div>
                    </td>
                    <td>
                        <div class="mx-2 py-3 overflow-auto scroll_with-none">
                            ${item.embed}
                        </div>
                    </td>
                    <td>
                    <div class="">${item.esopidem3u8}</div>
                    </td>
                    <td>
                        <div class="mx-2 py-3 overflow-auto scroll_with-none">
                        ${item.m3u8}
                        </div>
                    </td>

                    
                </tr>
        `
        ) || []
      );
    },
    callback: function (data, pagination) {
      listItem_container.innerHTML = data.join("");
    },
  });
};
// end content

// Featch data
const renderListEsopideContainer = () => {
  // inputID.value
  fetch("/catelog/showEsopide", {
    method: "post",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ idFilm: inputID.value }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.infoEsopide) {
        const { listEsopideEmbeded, listEsopideStream } = data.infoEsopide;
        console.log(listEsopideEmbeded);
        const max = Math.max(
          listEsopideEmbeded.length || 0,
          listEsopideStream.length || 0
        );

        fullLink = new Array(max).fill(0).map((_, index) => {
          return {
            idembed: listEsopideEmbeded[index]?._id || "",
            idm3u8: listEsopideStream[index]?._id || "",
            esopideembed: listEsopideEmbeded[index]?.esopide || "",
            esopidem3u8: listEsopideStream[index]?.esopide || "",
            embed: listEsopideEmbeded[index]?.link || "",
            m3u8: listEsopideStream[index]?.link || "",
          };
        });
      }
      renderList(fullLink);
    });
};
renderListEsopideContainer();

listItem_container.addEventListener("click", (e) => {
  if (e.target.closest("button")) {
    const buttonElement = e.target.closest("button");
    if (!e.target.closest(".tr_item")) {
      return;
    }
    const itemContent = e.target.closest(".tr_item").dataset;
    const esopide = itemContent.esopide;
    const idembed = itemContent.embed;
    const idm3u8 = itemContent.m3u8;
    const index = itemContent.index;
    if (buttonElement.classList.contains("btn_delete")) {
      renderKingofModalStatus(`Bạn chắc chắn muốn xóa ${esopide} không ?`);
      modal_btnApply.onclick = () => {
        console.log(esopide, inputID.value);
        fetch("/filmdetail/deleteesopide", {
          method: "POST",
          headers: {
            "content-type": "Application/json",
          },
          body: JSON.stringify({
            idembed,
            idm3u8,
            idFilm: inputID.value,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            ToastMesage.success(data.message + " " + esopide);
            modalStatus.classList.add("hideElement");
            renderListEsopideContainer();
          })
          .catch((err) => {
            ToastMesage.warning(err.message);
          });
      };
    } else if (buttonElement.classList.contains("btn_edit")) {
      const findItem = fullLink.find(
        (item, i) => item.idm3u8 == idm3u8 && item.idembed == idembed
      );
      console.log(findItem);
      renderDataView(findItem);
    }
  }
});
