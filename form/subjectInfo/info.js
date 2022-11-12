var base_url = 'http://164.92.205.27:8000';
const httpMethodPost = 'POST';
const postHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

var saveButton = document.getElementById("submit");
saveButton.addEventListener("click", function () {
    download();
    route(preGame1);

});

function download() {

    var data = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        age: document.getElementById('age').value
    }

    var CsvString = "TEST_SUBJECT_NAME,E-MAIL,AGE" + "\r\n";
    CsvString = CsvString + data.name + ',' + data.email + ','
        + data.age + ',', "\r\n";
    CsvString = "data:application/csv," + encodeURIComponent(CsvString);
    var x = document.createElement("A");
    x.setAttribute("href", CsvString);
    x.setAttribute("download", data.name + " RESULTS.csv");
    document.body.appendChild(x);
    x.click();
    sendToServer();
}

async function sendToServer() {
    var data = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        age: document.getElementById('age').value
    }

    await fetch(base_url + '/user/save', {
        method: httpMethodPost,
        headers: postHeaders,
        body: JSON.stringify(data)
    }).catch(err => console.log(err))
}