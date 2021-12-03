class AjaxRequestHandler{    
    constructor(){   
    }

    connectGet = async (url) => {
        try {
            const resp = await $.ajax({
                url: url,
                type: "GET",
                dataType: "json"
            });
            return resp;
        } catch (error) {
            console.error(error);
            return null;            
        }      
    }

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
        if (result.isConfirmed) {
            return true;
        }
        return false;
    });
}