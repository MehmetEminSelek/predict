function save(data){
    var data = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        age : document.getElementById('age').value
}
return data;
};


var saveButton = document.getElementById("submit");
saveButton.addEventListener("click", function(){
    save();
    console.log(save());
    location.href = "http://127.0.0.1:5500/game/snake/index.html";
});
