// GLOBAL VARIABLES
const URL = "http://localhost:8080/api/gadget";
let ID_PRODUCT = null;

// USER INFORMATION ==========================
// const idProduct = document.getElementById("id");
const brandProduct = document.getElementById("brand");
const categoryProduct = document.getElementById("category");
const nameProduct = document.getElementById("name");
const descriptionProduct = document.getElementById("description");
const priceProduct = document.getElementById("price");
const availabilityProduct = document.getElementById("availability");
const quantityProduct = document.getElementById("quantity");
const photoProduct = document.getElementById("photography");

// DOM ELEMENTS
const modal = document.querySelector(".modal");

// BUTTONS ====================================
const btnCloseModal = document.getElementById("btnCloseModal");
const btnAdd = document.getElementById("btnAddProduct");
const btnSave = document.getElementById("btnSave");

/**
 * Function to active modal and set default value
 */
btnAdd.addEventListener("click", () => {
    categoryProduct.value = "Gadgets";
    modal.classList.add("modal--active")
});

/**
 * Function to close modal, set product's id to null and clear all input fields
 */
btnCloseModal.addEventListener("click", () => {
    ID_PRODUCT = null;
    clearFields();
    modal.classList.remove("modal--active");
});

/**
 * Add click listener to save button
 */
btnSave.addEventListener("click", () => saveProduct());

/**
 * Set empty all input fields
 */
const clearFields = () => {
    brandProduct.value = "";
    categoryProduct.value = "";
    nameProduct.value = "";
    descriptionProduct.value = "";
    priceProduct.value = "";
    availabilityProduct.value = "";
    quantityProduct.value = "";
    photoProduct.value = "";
}

/**
 * Manage all input fields to an object data
 * @returns Product object
 */
const getFieldsInfo = () => {
    return {
        brand: brandProduct.value,
        category: categoryProduct.value,
        name: nameProduct.value,
        description: descriptionProduct.value,
        price: parseInt(priceProduct.value),
        availability: availabilityProduct.value,
        quantity: parseInt(quantityProduct.value),
        photography: photoProduct.value
    }
}

/**
 * Set all input fields from an object data
 * @param {Product} product 
 */
const setFieldsInfo = (product) => {
    brandProduct.value = product.brand;
    categoryProduct.value = product.category;
    nameProduct.value = product.name;
    descriptionProduct.value = product.description;
    priceProduct.value = parseInt(product.price);
    availabilityProduct.value = product.availability;
    quantityProduct.value = parseInt(product.quantity);
    photoProduct.value = product.photography;
}

/**
 * 
 * @param {String} brand 
 * @param {String} category 
 * @param {String} name 
 * @param {String} description 
 * @param {Number} price 
 * @param {String} availability 
 * @param {Number} quantity 
 * @param {String} photography 
 * @returns Boolean
 */
const validate = (brand, category, name, description, price, availability, quantity, photography) => {
    if (brand.length === 0 || category.length === 0 || name.length === 0 
        || description.length === 0 || price.length === 0 || availability.length === 0 
        || quantity.length === 0 || photography === 0)  {
        swalHandler("!Error", "error", "All fields are required", true, "#DC143C");
        return false;
    }
    if (description.length > 80) {
        swalHandler("!Error", "error", "Description must not exceed 80 characters", true, "#DC143C");
        return false;
    }
    if (typeof price !== "number") {
        swalHandler("!Error", "error", "Price must be a numerical", true, "#DC143C");
        return false;
    }
    if (typeof quantity !== "number") {
        swalHandler("!Error", "error", "Quantity must be a numerical", true, "#DC143C");
        return false;
    }
    if (!(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi.test(photography))){
        swalHandler("!Error", "error", "Photography must be a URL", true, "#DC143C");
        return false;
    }
    return true;
}

/**
 * Save or Update product to database
 */
const saveProduct = async () => {
    const { brand, category, name, description, price, availability, quantity, photography } = getFieldsInfo();

    const areValid = validate(brand, category, name, description, price, availability, quantity, photography);
    if (!areValid) {
        return;
    }
    const data = {
        id: !!ID_PRODUCT ? ID_PRODUCT: null,
        brand,
        category,
        name,
        description,
        price,
        availability,
        quantity,
        photography
    }
    const resp = !!ID_PRODUCT ? await ajaxHandler.connectUpdate(`${URL}/update`, data) : await ajaxHandler.connectPost(`${URL}/new`, data)
    if (resp.id === null){
        swalHandler("!Error", "error", "It was not possible to create product", true, "#DC143C");
        return;
    }
    const message = !!ID_PRODUCT ? "Product updated successfully" : "Product created successfully";
    ID_PRODUCT = null;
    swalHandler("", "success", message, false, "", 1500);
    clearFields();
    await getProducts();
    modal.classList.remove("modal--active");
}

/**
 * Function to update product
 * @param {Integer} id 
 */
const updateProduct = async (id) => {
    const product = await ajaxHandler.connectGet(`${URL}/${id}`);
    setFieldsInfo(product);
    ID_PRODUCT = id;    
    modal.classList.add("modal--active");
}

/**
 * function to delete a product
 * @param {Integer} id 
 */
const deleteProduct = async (id) => {
    const isConfirmed = await swalHandlerConfirm();
    if (!isConfirmed){
        return;
    }
    await ajaxHandler.connectDelete(`${URL}/${id}`);
    swalHandler("", "success", "Product eliminated successfully", false, "", 1500);
    await getProducts();
}

/**
 * Function to insert products from database to a table
 */
const getProducts = async () => {
    const products = await ajaxHandler.connectGet(`${URL}/all`);
    if (products?.length > 0 || products !== null) {
        const table = document.getElementById("tableContent");
        table.innerHTML = "";
        products.forEach(product => {
            table.innerHTML += `
                <tr>
                    <td data-label="Id">${product.id}</td>
                    <td data-label="Brand">${product.brand}</td>
                    <td data-label="Category">${product.category}</td>
                    <td data-label="Name">${product.name}</td>
                    <td data-label="Description">${product.description}</td>
                    <td data-label="Price">${product.price}</td>
                    <td data-label="Availability">${product.availability}</td>
                    <td data-label="Quantity">${product.quantity}</td>
                    <td data-label="Photography"><img src="${product.photography}" alt="${product.brand}"></td>
                    <td data-label="Edit">
                        <span role="button" class="material-icons-sharp warning" onclick="updateProduct(${product.id})">edit</span>
                    </td>
                    <td data-label="Delete">                                        
                        <span role="button" class="material-icons-sharp danger" onclick="deleteProduct(${product.id})">delete</span>
                    </td>
                </tr>
                `;
        });        
    }
}

window.onload = async () => { await getProducts()};