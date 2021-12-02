class AjaxRequestHandler{    
    DATATYPE = "json";
    constructor(){   
    }

    connectGet = (url) => {
        return $.ajax({
            url: url,
            type: "GET",
            dataType: this.DATATYPE
        });
    }

    connectPost = (url, data) => {
        return $.ajax({
            url,
            type: "POST",
            dataType: this.DATATYPE,
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(data)         
        });
    }
}

const ajaxHandler = new AjaxRequestHandler();

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