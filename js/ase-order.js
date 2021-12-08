let PRODUCTS = null;
// USER INFORMATION ==========================
const tablaProduct = document.getElementById("tablaProduct");
const btnAddProduct = document.getElementById("btnAddProduct");
const btnCloseModal = document.getElementById("btnCloseModal");
const btnSendOrder = document.getElementById("btnSendOrder");

// DOM ELEMENTS
const modal = document.querySelector(".modal");

/**
 * Function to active modal and set default value
 */
 btnAddProduct.addEventListener("click", () => {
    modal.classList.add("modal--active");
});

/**
 * Function to close modal, set product's id to null and clear all input fields
 */
btnCloseModal.addEventListener("click", () => {
    modal.classList.remove("modal--active");
});

/**
 * function to load all products on database into PRODUCTS
 */
document.addEventListener("DOMContentLoaded", async () => {
    PRODUCTS = await ajaxHandler.connectGet(`${URL_PROD}/all`);
});

/**
 * Function to load products data from database to modal table
 */
btnAddProduct.addEventListener("click", async () => await loadProducts());

btnSendOrder.addEventListener("click", async () => makeOrder());

const filterProducts = () => {
    const prodInOrder = productOrder.getProducts();
    const productsFilter = [];
        PRODUCTS.forEach(product => {
            prodInOrder.forEach(p => {
                if (product.id !== p.id) productsFilter.push(product);
            })
        });
    if (PRODUCTS.every(product => prodInOrder.includes(product))){
        document.getElementById("tablaProduct").innerHTML = "";
        swalHandler("Warning!", "warning", "There are no more products to be added", true, "#ffc302");
        return [];
    }
    return productsFilter;
}

const loadProducts = async () => {    
    if (PRODUCTS?.length > 0) {    
        const products = filterProducts().length > 0 ? 
                            filterProducts() : 
                            productOrder.getProducts().length !== PRODUCTS.length ? PRODUCTS : [];
        const table = document.getElementById("tablaProduct");
        const fragment = document.createDocumentFragment(); 
        products.map(product => {
            const row = document.createElement("tr");
            row.innerHTML =  `           
                    <td data-label="Category">${product.brand}</td>
                    <td data-label="Name">${product.category}</td>
                    <td data-label="Description">${product.name}</td>
                    <td data-label="Price">${product.price}</td>
                    <td data-label="Add">
                        <span role="button" class="material-icons-sharp warning" onclick="addProduct(${product.id})">control_point</span>
                    </td>
            `;
            fragment.appendChild(row);
        });
        table.innerHTML = "";
        table.appendChild(fragment);   
    }    
}

const addProduct = (productId) => {
    productOrder.addProduct(
        PRODUCTS.filter(p => p.id === productId)[0]
    );
    modal.classList.remove("modal--active");
    orderProducts();
}

const updateProdQuantity = (productId, quantity) => {
    productOrder.setQuantity(productId, Number(quantity));
}

const deleteProduct = (productId) => {
    productOrder.deleteProduct(productId);
    orderProducts();
}

const orderProducts = () => {
    const products = productOrder.getProducts();
    const tableOrder = document.getElementById("tableContent");
    if (products?.length > 0) {        
        const fragment = document.createDocumentFragment();
        products.map(product => {
            const row = document.createElement("tr");
            row.innerHTML =  `           
                    <td data-label="Name">${product.name}</td>
                    <td data-label="Category">${product.category}</td>
                    <td data-label="Description">${product.description}</td>
                    <td data-label="Price">${product.price}</td>
                    <td data-label="Photography">
                        <img src="${product.photography}" alt="${product.name}">
                    </td>
                    <td data-label="Quantity">
                        <input type="number"
                        placeholder="0" 
                        onchange="updateProdQuantity(${product.id}, this.value)"
                        value="${productOrder.getQuantity(product.id) || 0}"/>
                    </td>
                    <td data-label="Add">
                        <span role="button" class="material-icons-sharp danger" onclick="deleteProduct(${product.id})">delete</span>
                    </td>
            `;
            fragment.appendChild(row);
        });
        tableOrder.innerHTML = "";
        tableOrder.appendChild(fragment);
    } else {
        tableOrder.innerHTML = "";
    }    
}

/**
 * Funcion que obtiene la fecha actual del sistema
 * @returns Fecha en formato yyyy-mm-dd
 */
const getCurrentDate = () => {
    const offset = new Date().getTimezoneOffset();
    const date = new Date(new Date().getTime() - offset * 60 * 1000);
    return date.toISOString().split("T")[0];
}

const validateQuantity = () => {
    const quantities = productOrder.getAllQuantity();
    return Object.values(quantities).every(value => value !== null);
}

const makeOrder = async () => {
    const table = document.getElementById("tableContent");
    if (table.innerHTML === "") {
        swalHandler("!Error", "error", "You must add at least one product", true, "#DC143C");
        return;
    }
    if (!validateQuantity()){
        swalHandler("!Error", "error", "You must add quantity in the corresponding field", true, "#DC143C");
        return;
    }
    const salesMan = await ajaxHandler.connectGet(`${URL_USER}/${sessionStorage.getItem('ref')}`);
    const data = {
        registerDay: getCurrentDate(),
        status: "Pendiente",
        salesMan,
        products: {...productOrder.getProductsFormatted()},
        quantities: productOrder.getAllQuantity()
    };
    const order = await ajaxHandler.connectPost(`${URL_ORDER}/new`, data);
    if (order?.id === null) {
        swalHandler("!Error", "error", "It was not possible to create order", true, "#DC143C");
        return;
    }
    swalHandler("", "success", `Order ${order.id} added successfully`, true, "#1675f2");
    table.innerHTML = "";
    productOrder.deleteAll();
}
