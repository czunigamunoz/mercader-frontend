const btnClose = document.getElementById("btnClose");
const btnMenu = document.getElementById("btnMenu");
const sideMenu = document.querySelector("aside");

/**
 * Show side menu
 */
btnMenu.addEventListener("click", () => sideMenu.style.display = "block");

/**
 * Hide side menu
 */
btnClose.addEventListener("click", () => sideMenu.style.display = "none");