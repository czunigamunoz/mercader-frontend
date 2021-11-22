const URL = "http://localhost:8080/api/user";

$(".nav-pills .nav-link").click(function() {
    $(".nav-pills .nav-link").each(function() {
        $(this).toggleClass("nav-active");
    })
});

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

$("#btnLogin").click(() => {
    if ($.trim($("#loginEmail").val().length === 0) && $.trim($("#loginPassword").val().length === 0)) {
        showMessage("Error", "All fields are required", true);
        return;
    }
    const email = $("#loginEmail").val();
    const password = $("#loginPassword").val();
    $.ajax({
        url: `${URL}/${email}/${password}`,
        type: "GET",
        dataType: "json",
        success: function(response) {
            if (response.id === null){
                showMessage("Error", "Wrong user and/or password", true);
            }else {
                showMessage("Confirmation", "Login successfully");
            }
        }
    })
})

$("#btnRegister").click(async () => {
    if ($.trim($("#registerName").val()) === "" 
        || $.trim($("#registerEmail").val()) === "" 
        || $.trim($("#registerPassword").val()) === "" 
        || $.trim($("##registerPasswordConfirmation").val())) {
            showMessage("Error", "All fields are required", true);
            return;
        }
    if ($.trim($("#registerName").val()).length > 80) {
        showMessage("Error", "Name must not exceed 80 characters", true);
        return;
    }
    if ($.trim($("#registerEmail").val()).length > 50) {
        showMessage("Error", "Email must not exceed 50 characters", true);
        return;
    }
    if ($.trim($("#registerPassword").val()).length > 50) {
        showMessage("Error", "Password must not exceed 50 characters", true);
        return;
    }
    if ($.trim($("#registerPassword").val()) !== "" && $.trim($("#registerPasswordConfirmation").value)){
        showMessage("Error", "Those passwords didn't match", true)
        return;
    }
    const isEmail = await $.ajax({
        url: `${URL}/${$("#registerEmail").val()}`,
        type: "GET",
        dataType: "json"
    });
    if (isEmail){
        showMessage("Error", "Email already exists", true)
        return;
    }
    const name = $("#registerName").val();
    const email = $("#registerEmail").val();
    const password = $("#registerPassword").val();    
    const data = {
        name: name,
        email: email,
        password: password,
    }
    $.ajax({
        url: `${URL}/new`,
        type: "POST",
        dataType: "json",
        headers: {
            "Content-Type": "application/json"
        },
        data: JSON.stringify(data),
        success: function(){
             showMessage("Confirmation", "Registration successful")
        }

    })
})
