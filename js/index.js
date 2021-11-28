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
        })
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
        })
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

const clearFields = () => {
    $("#loginEmail").val("");
    $("#loginPassword").val("");
    $("#registerName").val("");
    $("#registerEmail").val("");
    $("#registerPassword").val("");
    $("#registerPasswordConfirmation").val("");
}

$("#btnLogin").click(async (e) => {
    e.preventDefault();
    const email = $.trim($("#loginEmail").val());
    const password = $.trim($("#loginPassword").val());
    if (email.length === 0 || password.length === 0) {
        showMessage("Error", "All fields are required", true);
        return;
    }
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))){
        showMessage("Error", "Please enter a valid email address", true);
        return;
    }
    const resp = await ajaxHandler.connectGet(`/${email}/${password}`);
    if (resp.id === null){
        showMessage("Error", "Wrong user and/or password", true);
    }else {
        showMessage("Confirmation", `Welcome ${resp.name}`);
        clearFields();
    }    
    console.log(resp)
    // $.ajax({
    //     url: `${URL}/${email}/${password}`,
    //     type: "GET",
    //     dataType: "json",
    //     success: function(response) {
    //         if (response.id === null){
    //             showMessage("Error", "Wrong user and/or password", true);
    //         }else {
    //             showMessage("Confirmation", `Welcome ${response.name}`);
    //             clearFields();
    //         }
    //     }
    // })
})

$("#btnRegister").click(async (e) => {
    e.preventDefault();
    const name = $.trim($("#registerName").val());
    const email = $.trim($("#registerEmail").val());
    const password = $.trim($("#registerPassword").val());
    const passwordConfirmation = $.trim($("#registerPasswordConfirmation").val());
    if (name.length === 0 || email.length === 0 || password.length === 0 || passwordConfirmation.length === 0)  {
        showMessage("Error", "All fields are required", true);
        return;
    }
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))){
        showMessage("Error", "Please enter a valid email address", true);
        return;
    }
    if (name.length > 80) {
        showMessage("Error", "Name must not exceed 80 characters", true);
        return;
    }
    if (email.length > 50) {
        showMessage("Error", "Email must not exceed 50 characters", true);
        return;
    }
    if (password.length > 50) {
        showMessage("Error", "Password must not exceed 50 characters", true);
        return;
    }
    if (password !== passwordConfirmation){
        showMessage("Error", "Those passwords didn't match", true)
        return;
    }
    const isEmail = await ajaxHandler.connectGet(`/${$("#registerEmail").val()}`)
    // const isEmail = await $.ajax({
    //     url: `http://localhost:8080/api/user/${$("#registerEmail").val()}`,
    //     type: "GET",
    //     dataType: "json"
    // });
    if (isEmail){
        showMessage("Error", "Email already exists", true)
        return;
    }    
    const data = {
        name: name,
        email: email,
        password: password,
    }
    const resp = await ajaxHandler.connectPost("/new", data);
    if (resp.id === null){
        showMessage("Error", "It was not possible to create the account", true);
    }else {
        showMessage("Confirmation", "Acount created successfully");
        clearFields();
    }    
    console.log(resp)
    // $.ajax({
    //     url: "http://localhost:8080/api/user"+"/new",
    //     type: "POST",
    //     dataType: "json",
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     data: JSON.stringify(data),
    //     success: function(){
    //         showMessage("Confirmation", "Acount created successfully");
    //         clearFields();
    //     },
    //     error: function(){
    //         showMessage("Error", "It was not possible to create the account", true);
    //     }

    // })
})
