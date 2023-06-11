import ToastMesage from "./style.module.js";
fetch("/user/admin/login")
  .then((res) => res.json())
  .then((data) => {
    if (data.status == 404) {
      ToastMesage.warning(data.message);
      return;
    }
    const { fullname, permission, avata } = data.account;
    document.getElementById("header_permission").innerHTML = permission;
    document.getElementById("header_fullname").innerHTML = fullname;
    document.getElementById("header_avata").src = avata;
    document.getElementById("info_admin").classList.remove("hideElement");
  })
  .catch((err) => {
    console.log(err);
  });
