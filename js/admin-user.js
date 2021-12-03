// URL API
const URL = "http://localhost:8080/api/user";

// USER INFORMATION ==========================
const identificationUser = document.getElementById("identification");
const nameUser = document.getElementById("name");
const addressUser = document.getElementById("address");
const phoneUser = document.getElementById("phone");
const emailUser = document.getElementById("email");
const zoneUser = document.getElementById("zone");
const passwordUser = document.getElementById("password");
const typeUser = document.getElementById("type");

// DOM ELEMENTS
const modal = document.querySelector(".modal");

// BUTTONS ====================================
const btnCloseModal = document.getElementById("btnCloseModal");
const btnAddUser = document.getElementById("btnAddUser");
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

    const users = await ajaxHandler.connectGet(`${URL}/all`);
    const id = users.length > 0 ? users.at(-1).id+1 : 1;

    const data = {
        id,
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

const updateUser = (id) => {
    console.log("update", id);
}

const deleteUser = (id) => {
    console.log("delete", id);
}

const getUsers = async () => {
    const users = await ajaxHandler.connectGet(`${URL}/all`);
    if (users.length === 0) {
        swalHandler("No users in database", "info", "", false, "#3085d6", 2000);
        return;
    }
    const table = document.getElementById("tableContent");
    table.innerHTML = "";
    let row = document.createElement("tr");
    users.forEach(user => {
        row = "";
        row += `<td data-label="Identification">${user.identification}</td>
            <td data-label="Name">${user.name}</td>
            <td data-label="Address">${user.address}</td>
            <td data-label="Phone">${user.cellPhone}</td>
            <td data-label="Email">${user.email}</td>
            <td data-label="Zone">${user.zone}</td>
            <td data-label="Role">${user.role}</td>
            <td data-label="Edit">
                <span role="button" class="material-icons-sharp warning" onclick="updateUser(${user.id})">edit</span>
            </td>
            <td data-label="Delete">                                        
                <span role="button" class="material-icons-sharp danger" onclick="deleteUser(${user.id})">delete</span>
            </td>`;
    });    
    table.innerHTML = row;
}

window.onload = getUsers();