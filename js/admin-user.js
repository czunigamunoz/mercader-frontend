const URL = "http://localhost:8080/api/user";
const identificationUser = document.getElementById("identification");
const nameUser = document.getElementById("name");
const addressUser = document.getElementById("address");
const phoneUser = document.getElementById("phone");
const emailUser = document.getElementById("email");
const zoneUser = document.getElementById("zone");
const passwordUser = document.getElementById("password");
const typeUser = document.getElementById("type");

const btnRegister = document.getElementById("btnRegister");

btnAddUser.addEventListener("click", () => modal.classList.add("modal--active"));

btnCloseModal.addEventListener("click", () => modal.classList.remove("modal--active"));

const clearFields = () => {
    identificationUser.value = "";
    nameUser.value = "";
    addressUser.value = "";
    phoneUser.value = "";
    emailUser.value = "";
    zoneUser.value = "";
    passwordUser.value = "";
    typeUser.value = "";
}

btnRegister.addEventListener("click", async () => {
    const identification = identificationUser.value;
    const name = nameUser.value;
    const address = addressUser.value;
    const cellPhone = phoneUser.value;
    const email = emailUser.value;
    const password = passwordUser.value;
    const zone = zoneUser.value;    
    const type = typeUser.value;

    if (name.length === 0 || email.length === 0 || password.length === 0)  {
        swalHandler("!Error", "error", "All fields are required", true, "#DC143C");
        return;
    }
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))){
        swalHandler("!Error", "error", "Please enter a valid email address", true, "#DC143C");
        return;
    }
    if (name.length > 80) {
        swalHandler("!Error", "error", "Name must not exceed 80 characters", true, "#DC143C");
        return;
    }
    if (email.length > 50) {
        swalHandler("!Error", "error", "Email must not exceed 50 characters", true, "#DC143C");
        return;
    }
    if (password.length > 50) {
        swalHandler("!Error", "error", "assword must not exceed 50 characters", true, "#DC143C");
        return;
    }
    const isEmail = await ajaxHandler.connectGet(`${URL}/emailexist/${email}`);
    if (isEmail){
        swalHandler("!Error", "error", "Email already exists", true, "#DC143C");
        return;
    }

    const data = {
        id: 6,
        identification,
        name,
        address,
        cellPhone,
        email,
        password,
        zone,
        type
    }
    console.log(JSON.stringify(data));
    const resp = await ajaxHandler.connectPost(`${URL}/new`, data);
    if (resp.id === null){
        swalHandler("!Error", "error", "It was not possible to create the account", true, "#DC143C");
        return;
    }
    swalHandler("", "success", "Acount created successfully", false, "", 1500);
    clearFields();
});