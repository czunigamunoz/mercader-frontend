/* GLOBAL VARIABLES */
const URL = "http://localhost:8080/api/user";
const email = document.getElementById("loginEmail");
const password = document.getElementById("loginPassword");
const formInputs = document.querySelectorAll(".form__input");
const btnLogin = document.getElementById("btnLogin");

formInputs.forEach(function (inputs) {
    inputs.addEventListener("focus", function(e){
        e.target.nextElementSibling.classList.add("active");        
    });
    inputs.addEventListener("focusout", function(e){
        if (!e.target.value) e.target.nextElementSibling.classList.remove("active");        
    });
});

btnLogin.addEventListener("click", async () => {
    if (email.value.length === 0 || password.value.length === 0) {
        swalHandler("!Error", "error", "All fields are required", true, "#DC143C");
        return;
    }
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.value))){
        swalHandler("!Error", "error", "Please enter a valid email address", true, "#DC143C");
        return;
    }
    const resp = await ajaxHandler.connectGet(`${URL}/${email.value}/${password.value}`);
    if (resp.id === null){
        swalHandler("!Error", "error", "There is no user with these credentials", true, "#DC143C");
        return;
    }
    swalHandler("", "success", `Welcome ${resp.name}`, false, "", 1500);
    setTimeout(() => {
        window.location.href = "../pages/admin.html";
        return;
    }, 1500);    
});
