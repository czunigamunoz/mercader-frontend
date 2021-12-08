// GLOBAL VARIABLES
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

/**
 * Add listener to show modal
 */
btnAddUser.addEventListener("click", () => modal.classList.add("modal--active"));

/**
 * Close modal, set user's id to null and clear input fields
 */
btnCloseModal.addEventListener("click", () => {
    ID_USER = null;
    clearFields();
    modal.classList.remove("modal--active");
});

/**
 * Add click listener to save button
 */
btnSave.addEventListener("click", () => saveUser());

/**
 * Set empty all input fields
 */
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

/**
 * Manage all input fields to an object data
 * @returns PUser object
 */
const getFieldsInfo = () => {
    return {
        identification: identificationUser.value,
        name: nameUser.value,
        address: addressUser.value,
        cellPhone: phoneUser.value,
        email: emailUser.value,
        password: passwordUser.value,
        zone: zoneUser.value,
        type: typeUser.value,
    };
}

/**
 * Set all input fields from an object data
 * @param {User} user
 */
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

/**
 * Validate all fields
 * @param {String} identification 
 * @param {String} name 
 * @param {String} address 
 * @param {String} cellPhone 
 * @param {String} email 
 * @param {String} password 
 * @param {String} zone 
 * @param {String} type 
 * @returns Boolean
 */
const validate = async (identification, name, address, cellPhone, email, password, zone, type) => {
    if (identification.length === 0 || name.length === 0 || address.length === 0 || cellPhone.length === 0 
        || email.length === 0 || password.length === 0 || zone.length === 0 || type.length === 0)  {
        swalHandler("!Error", "error", "All fields are required", true, "#DC143C");
        return false;
    }
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))){
        swalHandler("!Error", "error", "Please enter a valid email address", true, "#DC143C");
        return false;
    }
    if (name.length > 80) {
        swalHandler("!Error", "error", "Name must not exceed 80 characters", true, "#DC143C");
        return false;
    }
    if (email.length > 50) {
        swalHandler("!Error", "error", "Email must not exceed 50 characters", true, "#DC143C");
        return false;
    }
    if (password.length > 50) {
        swalHandler("!Error", "error", "assword must not exceed 50 characters", true, "#DC143C");
        return false;
    }
    const isEmail = await ajaxHandler.connectGet(`${URL_USER}/emailexist/${email}`);
    if (ID_USER !== null) {
        const user = await ajaxHandler.connectGet(`${URL_USER}/${ID_USER}`);
        if (user.email === email) {
            return true;
        }
    }
    if (isEmail){    
        swalHandler("!Error", "error", "Email already exists", true, "#DC143C");
        return false;
    }
    return true;
}

/**
 * Save or Update user to database
 */
const saveUser = async () => {
    const { identification, name, address, cellPhone, email, password, zone, type } = getFieldsInfo();
    const areValid = await validate(identification, name, address, cellPhone, email, password, zone, type);
    if (!areValid) {
        return;
    }    
    const data = {
        id: !!ID_USER ? ID_USER : null,
        identification,
        name,
        address,
        cellPhone,
        email,
        password,
        zone,
        type
    }
    const resp = !!ID_USER ? await ajaxHandler.connectUpdate(`${URL_USER}/update`, data) : await ajaxHandler.connectPost(`${URL_USER}/new`, data);
    if (resp.id === null){
        swalHandler("!Error", "error", "It was not possible to create user", true, "#DC143C");
        return;
    }
    const message = !!ID_USER ? "USer updated successfully" : "User created successfully";
    ID_USER = null;
    swalHandler("", "success", message, false, "", 1500);
    clearFields();
    await getUsers();
    modal.classList.remove("modal--active");
}

/**
 * Function to update user
 * @param {Number} id
 */
const updateUser = async (id) => {
    const user = await ajaxHandler.connectGet(`${URL_USER}/${id}`);
    setFieldsInfo(user);
    ID_USER = id;    
    modal.classList.add("modal--active");
}

/**
 * function to delete a user
 * @param {Number} id
 */
const deleteUser = async (id) => {
    const isConfirmed = await swalHandlerConfirm();
    if (!isConfirmed){
        return;
    }
    await ajaxHandler.connectDelete(`${URL_USER}/${id}`);    
    swalHandler("", "success", "User eliminated successfully", false, "", 1500);
    await getUsers();
}

/**
 * Function to insert users from database to a table
 */
const getUsers = async () => {
    const users = await ajaxHandler.connectGet(`${URL_USER}/all`);
    if (users?.length > 0 || users !== null) {
        const table = document.getElementById("tableContent");
        const fragment = document.createDocumentFragment();

        users.forEach(user => {
            const row = document.createElement("tr");
            row.innerHTML +=
                `
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
                `;
            fragment.appendChild(row);
        });
        table.innerHTML = "";
        table.appendChild(fragment);
    }
}

window.onload = async () => { await getUsers()};