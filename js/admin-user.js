// GLOBAL VARIABLES
const URL = "http://localhost:8080/api/user";
let ID_USER = null;

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
const btnSave = document.getElementById("btnSave");

btnAddUser.addEventListener("click", () => modal.classList.add("modal--active"));

btnCloseModal.addEventListener("click", () => {
    ID_USER = null;
    clearFields();
    modal.classList.remove("modal--active");
});

btnSave.addEventListener("click", () => saveUser());

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
    const user = {
        identification: identificationUser.value,
        name: nameUser.value,
        address: addressUser.value,
        cellPhone: phoneUser.value,
        email: emailUser.value,
        password: passwordUser.value,
        zone: zoneUser.value,   
        type: typeUser.value,
    }
    return user;
}

const setFieldsInfo = (user) => {
    identificationUser.value = user.identification;
    nameUser.value = user.name;
    addressUser.value = user.address;
    phoneUser.value = user.cellPhone;
    emailUser.value = user.email;
    passwordUser.value = user.password;
    zoneUser.value = user.zone;
    typeUser.value = user.type;
}

const saveUser = async () => {
    const { identification, name, address, cellPhone, email, password, zone, type } = getFieldsInfo();

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
    
    let id;
    if (!!ID_USER){
        id = ID_USER;      
    } else {        
        const isEmail = await ajaxHandler.connectGet(`${URL}/emailexist/${email}`);
        if (isEmail){
            swalHandler("!Error", "error", "Email already exists", true, "#DC143C");
            return;
        }
        const users = await ajaxHandler.connectGet(`${URL}/all`);
        id = users.length > 0 ? users.at(-1).id+1 : 1;
    }

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
    const resp = !!ID_USER ? await ajaxHandler.connectUpdate(`${URL}/update`, data) : await ajaxHandler.connectPost(`${URL}/new`, data)
    if (resp.id === null){
        swalHandler("!Error", "error", "It was not possible to create user", true, "#DC143C");
        return;
    }
    const message = !!ID_USER ? "USer updated successfully" : "User created successfully";
    ID_USER = null;
    swalHandler("", "success", message, false, "", 1500);
    clearFields();
    getUsers();
    modal.classList.remove("modal--active");
}

const updateUser = async (id) => {
    const user = await ajaxHandler.connectGet(`${URL}/${id}`);
    setFieldsInfo(user);
    ID_USER = id;    
    modal.classList.add("modal--active");
}

const deleteUser = async (id) => {
    const isConfirmed = await swalHandlerConfirm();
    if (!isConfirmed){
        return;
    }
    await ajaxHandler.connectDelete(`${URL}/${id}`);
    getUsers();
    swalHandler("", "success", "User eliminated successfully", false, "", 1500);
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
                <td data-label="Email">${user.email}</td>
                <td data-label="Role">${user.type}</td>
                <td data-label="Zone">${user.zone}</td>                
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