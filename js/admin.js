// BUTTONS
const btnClose = document.getElementById("btnClose");
const btnMenu = document.getElementById("btnMenu");
const sideMenu = document.querySelector("aside");
// DOM ELEMENTS
const userIdentification = document.getElementById("identificationUser");
const userName = document.getElementById("nameUser");
const userEmail = document.getElementById("emailUser");
const userType = document.getElementById("typeUser");
const userZone = document.getElementById("zoneUser");

/**
 * Function to detect change in user window size and fix menu
 */
window.addEventListener("resize", () => {
    if (window.innerWidth > 800) {
        sideMenu.style.display = "block";
    }
});

/**
 * Show side menu
 */
btnMenu.addEventListener("click", () => sideMenu.style.display = "block");

/**
 * Hide side menu
 */
btnClose.addEventListener("click", () => sideMenu.style.display = "none");

const profile = async () => {
    const userId = sessionStorage.getItem("ref");
    const userProfile = await ajaxHandler.connectGet(`${URL_USER}/${userId}`);
    userName.textContent = userProfile.name;
    userName.style.fontWeight = "bold";
    userIdentification.textContent = `c.c. ${userProfile.identification}`;    
    userEmail.textContent = userProfile.email;
    userType.textContent = userProfile.type === "ASE" ? "Asesor Comercial" : userProfile.type === "COORD" ? "Coordinador de Zona" : "Administrador";
    userZone.textContent = userProfile.zone;
}

document.addEventListener("DOMContentLoaded", () => profile())