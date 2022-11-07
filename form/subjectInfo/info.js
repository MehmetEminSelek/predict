

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
            + data.age + ',' , "\r\n";
    CsvString = "data:application/csv," + encodeURIComponent(CsvString);
    var x = document.createElement("A");
    x.setAttribute("href", CsvString);
    x.setAttribute("download", data.name + " RESULTS.csv");
    document.body.appendChild(x);
    x.click();
}
