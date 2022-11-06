function route() {
    location.href = "http://127.0.0.1:5500/form/info/info.html" ;
}

//pop the new tab on second screen
function routeGame() {
    window.open("http://127.0.0.1:5500/index.html", "http://127.0.0.1:5500/index.html", "width=700,height=500,screenLeft=2500,screenTop=500");
    location.href = "http://127.0.0.1:5502/form/index.html" ;
    // popupCenter({url: 'http://127.0.0.1:5502/form/index.html', title: 'xtf', w: 900, h: 500});
}

const popupCenter = ({url, title, w, h}) => {
    // Fixes dual-screen position                             Most browsers      Firefox
    const dualScreenLeft = window.screenLeft !==  undefined ? window.screenLeft : window.screenX;
    const dualScreenTop = window.screenTop !==  undefined   ? window.screenTop  : window.screenY;

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