// function route() {
//     location.href = "http://127.0.0.1:5500/form/subjectInfo/info.html";
// }

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

 var predict_url = "http://127.0.0.1:5500"
//var predict_url = "http://164.92.186.163"

 var game_url = "http://127.0.0.1:5502"
//var game_url = "http://161.35.209.66"


function route(path) {

    location.href = predict_url + path;

}

function routeGame() {

    window.open(predict_url + welcome, predict_url + welcome, "width=700,height=500,screenLeft=2500,screenTop=500");
    location.href = game_url + game_form;
}


const popupCenter = ({ url, title, w, h }) => {
    const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
    const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;

    const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    const systemZoom = width / window.screen.availWidth;
    const left = (width - w) / 2 / systemZoom + dualScreenLeft
    const top = (height - h) / 2 / systemZoom + dualScreenTop
    const newWindow = window.open(url, title,
        `
      scrollbars=yes,
      width=${w / systemZoom}, 
      height=${h / systemZoom}, 
      top=${top}, 
      left=${left}
      `
    )

    if (window.focus) newWindow.focus();
}