// GLOBAL VARIABLES
const URL_ORDER = "http://localhost:8080/api/order";
const URL_PROD = "http://localhost:8080/api/gadget";
const URL_USER = "http://localhost:8080/api/user";

/**
 * Represents an AjaxRequest
 * @version 1.0
 * @author czm
 */
class AjaxRequestHandler{    
    constructor(){   
    }

    /**
     * function to handle get request
     * @param {String} url 
     * @returns request resolved or null
     */
    connectGet = async (url) => {
        try {
            const resp = await $.ajax({
                url,
                type: "GET",
                dataType: "json"
            });
            return resp;
        } catch (error) {
            console.error(error);
            return null;            
        }      
    }

    /**
     * function to handle post request
     * @param {String} url 
     * @param {Object} data 
     * @returns request resolved or null
     */
    connectPost = async (url, data) => {
        try {
            const resp = await $.ajax({
                url,
                type: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(data)         
            });
            return resp;            
        } catch (error) {
            console.error(error);
            return null; 
        }  
    }

    /**
     * function to handle put request
     * @param {String} url 
     * @param {Object} data 
     * @returns request resolved or null
     */
    connectUpdate = async (url, data) => {
        try {
            const resp = await $.ajax({
                url,
                type: "PUT",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(data)         
            });
            return resp;            
        } catch (error) {
            console.error(error);
            return null; 
        } 
    }

    /**
     * function to handle delete request
     * @param {String} url 
     * @returns request resolved or null
     */
    connectDelete = async (url) => {
        try {
            const resp = await $.ajax({
                url,
                type: "DELETE",
                dataType: "json",
                contentType: "application/json; charset=utf-8"     
            });
            return resp;            
        } catch (error) {
            console.error(error);
            return null; 
        }  
    }
}
/**
 * AjaxRequestHandler object
 */
const ajaxHandler = new AjaxRequestHandler();

/**
 * Represents an order
 * @version 1.0
 * @author czm
 */
class Order {
    products = [];
    quantity = {};
    productsFormat = {};
    constructor(){}

    /**
     * Function to send order's products
     * @returns {Array}
     */
    getProducts() {
        return this.products;
    }

    /**
     * Function to send order's quantities
     * @returns {Object}
     */
    getAllQuantity() {
        return this.quantity;
    }

    /**
     * Function to send quantity from a product
     * @param idProduct
     * @returns {*}
     */
    getQuantity(idProduct) {
        return this.quantity[idProduct];
    }

    /**
     * Function to set product's quantity
     * @param {Number} idProduct
     * @param {Number} quantity
     */
    setQuantity(idProduct, quantity) {
        this.quantity[idProduct] = quantity;
    }

    /**
     * Function to send products as object
     * @returns {Object}
     */
    getProductsFormatted(){
        return this.productsFormat;
    }

    /**
     * Function to add product to order
     * @param product
     */
    addProduct(product){
        this.products.push(product);
        this.productsFormat[product.id] = product;
        this.quantity[product.id] = null;
    }

    /**
     * Function to delete a order's product
     * @param {Number} productId
     */
    deleteProduct(productId){
        this.products = this.products.filter(p => p.id !== productId);
        delete this.productsFormat[productId];
        delete this.quantity[productId];
    }

    /**
     * Delete all products from order
     */
    deleteAll(){
        this.products = [];
        this.quantity = {};
        this.productsFormat = {};
    }
}

/**
 * object from Order class
 * @type {Order}
 */
const productOrder = new Order();

/**
 * Function to handle Swal modal
 * @param {String} title 
 * @param {String} icon 
 * @param {String} text 
 * @param {Boolean} showConfirmButton 
 * @param {String} btnColor 
 * @param {Number} timer 
 * @returns Modal
 */
const swalHandler = (title, icon, text, showConfirmButton, btnColor, timer) => {
    return Swal.fire({
        title,
        icon,        
        text,
        showConfirmButton,
        confirmButtonColor: btnColor,
        timer
    });
}

/**
 * function to handle decision modal
 * @returns True if is confirmed or false
 */
const swalHandlerConfirm = () => {
    return Swal.fire({
        title: "Are you sure to proceed?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: "Yes, I'm sure"
    }).then((result) => {
        return !!result.isConfirmed;
    });
}