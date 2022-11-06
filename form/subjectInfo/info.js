function save(data) {
    var data = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        age: document.getElementById('age').value
    }
    return data;
};


var saveButton = document.getElementById("submit");
saveButton.addEventListener("click", function () {
    save();
    console.log(save());
    route(preGame1);

});
