var base_url = 'https://wafer-backend.com:443';
var base_url = "http://localhost:443";
const httpMethodPost = 'POST';
const postHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};

var saveButton = document.getElementById("submit");
saveButton.addEventListener("click", function () {
    sendToServer();
});

// function download() {

//     var data = {
//         name: document.getElementById('name').value,
//         email: document.getElementById('email').value,
//         age: document.getElementById('age').value
//     }

//     var CsvString = "TEST_SUBJECT_NAME,E-MAIL,AGE" + "\r\n";
//     CsvString = CsvString + data.name + ',' + data.email + ','
//         + data.age + ',', "\r\n";
//     CsvString = "data:application/csv," + encodeURIComponent(CsvString);
//     var x = document.createElement("A");
//     x.setAttribute("href", CsvString);
//     x.setAttribute("download", data.name + " RESULTS.csv");
//     document.body.appendChild(x);
//     x.click();
//     sendToServer();
// }
function dropdown() {
  document.getElementById("dropButton").classList.toggle("show");
}

async function sendToServer() {
    var data = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        age: document.getElementById('age').value,
        ref : document.getElementById('ref').value,
        edu : document.getElementById('edu').value,
        q1 : document.getElementById('q1').value,
        q2 : document.getElementById('q2').value,
        q3 : document.getElementById('q3').value

    }
    document.getElementById('bodyContainer').style.display = 'none';
    document.getElementById('loader').style.display = 'block';

    await fetch(base_url + '/user/save', {
        method: httpMethodPost,
        headers: postHeaders,
        body: JSON.stringify(data)
    })
    .catch(err => console.log(err))
    .finally(() => {
                document.getElementById('loader').style.display = "none";
                route(preGame1);
    });
}