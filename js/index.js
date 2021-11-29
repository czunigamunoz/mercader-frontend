const clearFields = () => {
    $("#loginEmail").val("");
    $("#loginPassword").val("");
}

$('.form__input').each(function () {
    $(this).focus(function () {
        $(this).next().addClass("active");
})});

$('.form__input').each(function () {
    $(this).focusout(function () {
        if(!$(this).val()) $(this).next().removeClass("active");
})});

$("#btnLogin").click(async (e) => {
    e.preventDefault();
    const email = $.trim($("#loginEmail").val());
    const password = $.trim($("#loginPassword").val());
    console.table(email, password);
    if (email.length === 0 || password.length === 0) {
        alert("All fields are required")
        // showMessage("Error", "All fields are required", true);
        return;
    }
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))){
        alert("Please enter a valid email address")
        // showMessage("Error", "Please enter a valid email address", true);
        return;
    }
    const resp = await ajaxHandler.connectGet(`/${email}/${password}`);
    if (resp.id === null){
        alert("Wrong user and/or password")
        // showMessage("Error", "Wrong user and/or password", true);
    }else {
        alert("Confirmation")
        // showMessage("Confirmation", `Welcome ${resp.name}`);
        clearFields();
    }
});
