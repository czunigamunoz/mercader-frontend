const btnClose = document.getElementById("btnClose");
const btnMenu = document.getElementById("btnMenu");
const sideMenu = document.querySelector("aside");

window.addEventListener("resize", () => {
    if (window.innerWidth > 768){
        sideMenu.style.display = "block";
    }
});

btnMenu.addEventListener("click", () => sideMenu.style.display = "block");

btnClose.addEventListener("click", () => sideMenu.style.display = "none");

const sidebarButtons = document.querySelectorAll(".sidebar a");

sidebarButtons.forEach(function(btn){
    btn.addEventListener("click", function(){
        let current = document.querySelectorAll(".active");
        current[0].className = current[0].className.replace("active", "");
        this.className += " active";
    });
});