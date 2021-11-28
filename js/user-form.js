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
    const data = {
        id: 1,
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