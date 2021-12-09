// DOM ELEMENTS
const modal = document.querySelector(".modal");
const tableContent = document.getElementById("tableContent");
const zone = sessionStorage.getItem("zone");

//BUTTONS ==========================
const btnCloseModal = document.getElementById("btnCloseModal");


/**
 * Function to close modal, set product's id to null and clear all input fields
 */
btnCloseModal.addEventListener("click", () => {
    modal.classList.remove("modal--active");
});

document.addEventListener("DOMContentLoaded", async () => {        
    await loadProducts(); 
});

const loadProducts = async () => {    
    const orders = await ajaxHandler.connectGet(`${URL_ORDER}/zona/${zone}`);
    if (orders?.length > 0) {    
        const fragment = document.createDocumentFragment(); 
        orders.forEach(order => {
            const row = document.createElement("tr");
            row.innerHTML =  `           
                    <td data-label="Identification">${order.salesMan.identification}</td>
                    <td data-label="Name">${order.salesMan.name}</td>
                    <td data-label="Email">${order.salesMan.email}</td>
                    <td data-label="Date">${order.registerDay.split("T")[0]}</td>
                    <td data-label="No. Order">${order.id}</td>
                    <td data-label="Status">${order.status}</td>
                    <td data-label="Detail">
                        <span role="button" class="material-icons-sharp warning" onclick="getOrderDetails(${order.id})">open_in_new</span>
                    </td>
            `;
            fragment.appendChild(row);
        });
        tableContent.innerHTML = "";
        tableContent.appendChild(fragment);   
    }    
}

const saveStatusOrder = async (orderId) => {
    const statusOrder = document.getElementById("statusOrder").value;
    if (statusOrder === "") {
        swalHandler("Error!", "error", "You must select a status order", true, "#DC143C");
        return;
    }
    const order = await ajaxHandler.connectGet(`${URL_ORDER}/${orderId}`);
    data = {
        id: order.id,
        registerDay: order.registerDay,
        status: statusOrder,
        salesMan: order.salesMan,
        products: order.products,
        quantities: order.quantities
    }
    const resp = await ajaxHandler.connectUpdate(`${URL_ORDER}/update`, data);
    if (resp.id === null){
        swalHandler("Error!", "error", "It was not possible to update order", true, "#DC143C");
        return;
    }
    swalHandler("", "success", "Order updated successfully", false, "", 1500);
    await loadProducts();
    modal.classList.remove("modal--active");
}

const paintTableTop = (order) => {
    const tableTop = document.getElementById("tableTop");
    tableTop.innerHTML = `
        <tr>
            <td data-label="Date">${order.registerDay.split("T")[0]}</td>
            <td data-label="No. Order">${order.id}</td>
            <td data-label="Status">${order.status}</td>
            <td data-label="Change Status">
                <select id="statusOrder">
                    <option value="">Seleccionar...</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Aprobado">Aprobado</option>
                    <option value="Rechazado">Rechazado</option>
                </select>
            </td>
            <td data-label="Save">
                <span role="button" class="material-icons-sharp warning" onclick="saveStatusOrder(${order.id})">save</span>
            </td>
        </tr>
        `
}

const painTableBottom = (order) => {
    const tableBottom = document.getElementById("tableBottom");
    const fragment = document.createDocumentFragment();
    const products = Object.values(order.products);
    products.forEach(product => {
        const row = document.createElement("tr");
        row.innerHTML =  `           
            <td data-label="Photography">
                <img src="${product.photography}" alt="${product.name}">
            </td>
            <td data-label="Name">${product.name}</td>
            <td data-label="Category">${product.category}</td>
            <td data-label="Description">${product.description}</td>
            <td data-label="Price">${product.price}</td>
            <td data-label="Quantity">${order.quantities[product.id]}</td>
            <td data-label="Stock">${product.quantity}</td>
            `;
        fragment.appendChild(row);       
    });
    tableBottom.innerHTML = "";
    tableBottom.appendChild(fragment);
}

const getOrderDetails = async (orderId) => {
    modal.classList.add("modal--active");
    const order = await ajaxHandler.connectGet(`${URL_ORDER}/${orderId}`);
    paintTableTop(order);
    painTableBottom(order);
}