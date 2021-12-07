// GLOBAL VARIABLES
const URL_PROD = "http://localhost:8080/api/gadget";
// USER INFORMATION ==========================
const tablaProduct = document.getElementById("tablaProduct");
const btnAddProduct = document.getElementById("btnAddProduct");
const btnCloseModal = document.getElementById("btnCloseModal");

// DOM ELEMENTS
const modal = document.querySelector(".modal");

/**
 * Function to active modal and set default value
 */
 btnAddProduct.addEventListener("click", () => {
    modal.classList.add("modal--active")
});

/**
 * Function to close modal, set product's id to null and clear all input fields
 */
btnCloseModal.addEventListener("click", () => {
    // clearFields();
    modal.classList.remove("modal--active");
});

btnAddProduct.addEventListener("click", async () => await loadProducts());

const loadProducts = async () => {
    const products = await ajaxHandler.connectGet(`${URL_PROD}/all`);
    if (products?.length > 0 || products !== null) {
        const table = document.getElementById("tablaProduct");
        table.innerHTML = "";
        products.forEach(product => {
            table.innerHTML += `            
                <tr>
                    <td data-label="Category">${product.brand}</td>
                    <td data-label="Name">${product.category}</td>
                    <td data-label="Description">${product.name}</td>
                    <td data-label="Price">${product.price}</td>
                    <td data-label="Add">
                        <span role="button" class="material-icons-sharp warning" onclick="addProduct(${product.id})">control_point</span>
                    </td>
                </tr>
            `;
        });        
    }
}

