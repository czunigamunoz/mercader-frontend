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
const formModal = document.getElementById("formModal");

// BUTTONS ====================================
const btnCloseModal = document.getElementById("btnCloseModal");
const btnAddUser = document.getElementById("btnAddUser");
const btnSave = document.getElementById("btnSave");

btnAddUser.addEventListener("click", () => modal.classList.add("modal--active"));

btnCloseModal.addEventListener("click", () => modal.classList.remove("modal--active"));

const modalUser = () => {
    const {identification, name, address, cellPhone, email, password, zone, type} = getFieldsInfo();
    formModal += 
    `   
    <div class="form__input">
    <label for="identification">Identification</label>
    <input type="text" name="identification" id="identification">
    </div>

    <div class="form__input">
        <label for="name">Name</label>
        <input type="text" name="name" id="name">
    </div>

    <div class="form__input">
        <label for="address">Address</label>
        <input type="text" name="address" id="address">
    </div>

    <div class="form__input">
        <label for="phone">Phone</label>
        <input type="text" name="phone" id="phone">
    </div>

    <div class="form__input">
        <label for="email">Email</label>
        <input type="email" name="email" id="email">
    </div>

    <div class="form__input">
        <label for="password">Password</label>
        <input type="text" name="password" id="password">
    </div>

    <div class="form__input">
        <label for="zone">Zone</label>
        <input type="text" name="zone" id="zone">
    </div>

    <div class="form__input">
        <label for="type" data-label="Select rol">Select rol</label></label>
        <select name="type" id="type">
            <option value="">Select one option</option>
            <option value="ADM">Administrator</option>
            <option value="COORD">Coordinator</option>
            <option value="ASE">Sales Advisor</option>
        </select>
    </div>

    <button id="btnSave" type="button">Save</button>
    `
}

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

const getFieldsInfo = () => {
    const identification = identificationUser.value;
    const name = nameUser.value;
    const address = addressUser.value;
    const cellPhone = phoneUser.value;
    const email = emailUser.value;
    const password = passwordUser.value;
    const zone = zoneUser.value;    
    const type = typeUser.value;
    return identification, name, address, cellPhone, email, password, zone, type;
}

btnSave.addEventListener("click", async () => {
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
    const resp = await ajaxHandler.connectPost(`${URL}/new`, data);
    if (resp.id === null){
        swalHandler("!Error", "error", "It was not possible to create the account", true, "#DC143C");
        return;
    }
    swalHandler("", "success", "Acount created successfully", false, "", 1500);
    clearFields();
    getUsers();
});

const updateUser = (id) => {
    const {identification, name, address, cellPhone, email, password, zone, type} = getFieldsInfo();
    console.log({identification, name, address, cellPhone, email, password, zone, type})
}

const deleteUser = async (id) => {
    const isConfirmed = await swalHandlerConfirm();
    if (!isConfirmed){
        return;
    }
    const user = await ajaxHandler.connectDelete(`${URL}/${id}`);
    getUsers();
    swalHandler("", "success", "Acount eliminated successfully", false, "", 1500);
}

const getUsers = async () => {
    const users = await ajaxHandler.connectGet(`${URL}/all`);
    if (users?.length === 0 || users === null) {
        swalHandler("No users in database", "warning", "", false, "#3085d6", 2000);
        return;
    }
    const table = document.getElementById("tableContent");
    table.innerHTML = "";
    users.forEach(user => {
        table.innerHTML += `
            <tr>
                <td data-label="Identification">${user.identification}</td>
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
                </td>
            </tr>`;
    });
}

window.onload = getUsers();