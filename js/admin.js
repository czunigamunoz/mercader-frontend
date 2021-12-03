const btnClose = document.getElementById("btnClose");
const btnMenu = document.getElementById("btnMenu");
const sideMenu = document.querySelector("aside");

btnMenu.addEventListener("click", () => sideMenu.style.display = "block");

btnClose.addEventListener("click", () => sideMenu.style.display = "none");