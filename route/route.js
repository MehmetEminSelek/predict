var cardGame = "/game/card/index.html";
var snakeGame = "/game/snake/index.html";
var preGame1 = "/form/informationBoards/pregame1.html";
var preGame2 = "/form/informationBoards/pregame2.html";
var will = "/form/informationBoards/will.html";
var info = "/form/subjectInfo/info.html";
var square = "/form/informationBoards/square.html";
var webgazer_url = "/WebGazer/www/calibration.html";
var welcome = "/form/welcome/index.html";
var game_form = "/form/index.html";

 //var predict_url = "http://127.0.0.1:5500"
var predict_url = "https://wafer-experiment.com"

//var game_url = "http://127.0.0.1:5502"
var game_url = "https://wafer-game.com"


function route(path) {

    location.href = predict_url + path;

}

function routeGame() {
    
   
    window.open(predict_url + welcome, predict_url + welcome, "width=300,height=300,Left=-750,Top=1050");
    location.href = game_url + game_form;
}

