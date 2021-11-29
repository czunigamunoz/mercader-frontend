const clearFields = () => {
    $("#registerIdentification").val("");
    $("#registerName").val("");
    $("#registerAddress").val("");
    $("#registerPhone").val("");
    $("#registerEmail").val("");
    $("#registerPassword").val("");
    $("#registerZone").val("");
    $("#registerType").val("");    
}

$("#btnRegister").click(async (e) => {
    e.preventDefault();
    const identification = $.trim($("#registerIdentification").val());
    const name = $.trim($("#registerName").val());
    const address = $.trim($("#registerAddress").val());
    const cellPhone = $.trim($("#registerPhone").val());
    const email = $.trim($("#registerEmail").val());
    const password = $.trim($("#registerPassword").val());
    const zone = $.trim($("#registerZone").val());
    const type = $.trim($("#registerType").val());

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
    if (isEmail){
        showMessage("Error", "Email already exists", true)
        return;
    }

    const data = {
        id: null,
        identification,
        name,
        address,
        cellPhone,
        email,
        password,
        zone,
        type
    }
    console.log(JSON.stringify(data));
    const resp = await ajaxHandler.connectPost("/new", data);
    if (resp.id === null){
        showMessage("Error", "It was not possible to create the account", true);
    }else {
        showMessage("Confirmation", "Acount created successfully");
        clearFields();
    }
});