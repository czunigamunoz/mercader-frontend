const btnClose = document.getElementById("btnClose");
const btnMenu = document.getElementById("btnMenu");
const sideMenu = document.querySelector("aside");

const modal = document.querySelector(".modal");
const btnCloseModal = document.getElementById("btnCloseModal");
const btnAddUser = document.getElementById("btnAddUser");

// window.addEventListener("resize", () => {
//     if (window.innerWidth > 768){
//         sideMenu.style.display = "block";
//     }
// });

btnMenu.addEventListener("click", () => sideMenu.style.display = "block");

btnClose.addEventListener("click", () => sideMenu.style.display = "none");