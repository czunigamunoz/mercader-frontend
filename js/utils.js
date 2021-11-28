class AjaxRequestHandler{    
    URL = "http://localhost:8080/api/user";
    DATATYPE = "json";
    constructor(){   
    }

    connectGet = (path) => {
        return $.ajax({
            url: this.URL + path,
            type: "GET",
            dataType: this.DATATYPE
        });
    }

    connectPost = (path, data) => {
        return $.ajax({
            url: this.URL + path,
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

const tabLoginRegister = () => {
    $(".nav-pills .nav-link").each(function() {
        $(this).toggleClass("nav-active");
    });
}

const clickSwitchTab = () => {
    tabLoginRegister();
    $(".tab-pane").each(function() {
        $(this).toggleClass("show active");
    });
    $(".nav-pills .nav-link").removeClass("active");
}

const showMessage = (title, body, error) => {
    $("#titleMessage").html(title);
    $("#bodyMessage").html(body);
    $("#titleMessage").removeClass();
    $("#bodyMessage").removeClass();
    $("#myToast").removeClass();
    if (error) {
        $("#titleMessage").addClass("text-danger");
        $("#bodyMessage").addClass("text-white");
        $("#myToast").addClass("toast bg-danger")
    } else {
        $("#titleMessage").addClass("text-success");
        $("#bodyMessage").addClass("text-white");
        $("#myToast").addClass("toast text-white bg-success")
    }
    $("#myToast").toast("show");
}