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

class Order {
    products = [];
    quantity = {};
    productsFormat = {};
    constructor(){} 

    getProducts() {
        return this.products;
    }

    getAllQuantity() {
        return this.quantity;
    }

    getQuantity(idProduct) {
        return this.quantity[idProduct];
    }

    setQuantity(idProduct, quantity) {
        this.quantity[idProduct] = quantity;
    }

    getProductsFormatted(){
        return this.productsFormat;
    }

    addProduct(product){
        this.products.push(product);
        this.productsFormat[product.id] = product;
        this.quantity[product.id] = null;
    }

    deleteProduct(productId){
        this.products = this.products.filter(p => p.id !== productId);
        delete this.productsFormat[productId];
        delete this.quantity[productId];
    }

    deleteAll(){
        this.products = [];
        this.quantity = {};
        this.productsFormat = {};
    }
}

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