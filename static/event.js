var startuseTime = null;//開始使用頁面時間
var startAlluseTime = null;//開始使用頁面時間
var stopUseTime = null;//結束使用頁面時間
var useTime = null;//使用頁面時間
var userLatitude, userLongitude, userCity;//使用者地區
var rollTop = new Object();;//滾動事件
var rollTime = new Object();;//滾動時間
var leftClickOption = new Object();//左鍵點擊事件
var rightClickOption = new Object();//右鍵點擊事件
var midClickOption = new Object();//中鍵點擊事件
var mouseTrackTime = new Object();//紀錄滑鼠軌跡時間
var mouseTrackElement = new Object();//紀錄滑鼠軌跡
var keyBoardDown = new Object();//鍵盤事件
var userLanguages = navigator.language;;//使用者語言
var userComeFrom = document.referrer;//使用者來源

var jsonData = new Object();
var jsonDataAll = new Object();

function PrintVersion() {//作業系統
    var msg;
    msg += "瀏覽器名稱 : " + navigator.appName + "\n";
    msg += "瀏覽器版本 : " + navigator.appVersion + "\n";
    msg += "cookie功能是否開啟 : " + navigator.cookieEnabled + "\n";
    msg += "作業系統 : " + navigator.platform + "\n";
    console.log(msg);
}


function getLocation() { //取得 經緯度
    navigator.geolocation.getCurrentPosition(showPosition);//有拿到位置就呼叫 showPosition 函式
}
function showPosition(position) {
    console.log("緯度 (Latitude): " + position.coords.latitude + " 經度 (Longitude): " + position.coords.longitude);
    var geocoder = new google.maps.Geocoder();  // google.maps.LatLng 物件
    var coord = new google.maps.LatLng(position.coords.latitude, position.coords.longitude); // 傳入 latLng 資訊至 geocoder.geocode
    geocoder.geocode({
        'latLng': coord
    }, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) { // 如果有資料就會回傳
            if (results) {
                console.log(results[0]);
                console.log(results[6].formatted_address);
                userCity = results[6].formatted_address;
            }
        } else { // 經緯度資訊錯誤
            console.log("Reverse Geocoding failed because: " + status);
        }
    });
    userLatitude = Math.round(position.coords.latitude * 10000) / 10000;
    userLongitude = Math.round(position.coords.longitude * 10000) / 10000;
}


window.onload = function onloadHtml(){//載入頁面完畢
    /*document.body.onbeforeunload = function(e){//賦予關閉頁面判斷
        stopUseTime = new Date().getTime();
        useTime = stopUseTime - startuseTime;
        console.log("總使用頁面時間"+useTime);
        toJsonData();
        do_ajax();
    }*/
    document.body.onmousedown = function (e)//滑鼠點擊事件
    {
        var btnNum = e.button;
        if (btnNum==2){//滑鼠右键
            console.log("右鍵點擊事件");
            console.log(e.target);
            if(rightClickOption[e.target.outerHTML]){
                rightClickOption[e.target.outerHTML]++;
            }else{
                rightClickOption[e.target.outerHTML] = 1;
            }
        }
        else if(btnNum==0){//滑鼠左键
            console.log("左鍵點擊事件");
            console.log(e.target);
            if(leftClickOption[e.target.outerHTML]){
                leftClickOption[e.target.outerHTML]++;
            }else{
                leftClickOption[e.target.outerHTML] = 1;
            }
        }
        else if(btnNum==1){//滑鼠中键
            console.log("中鍵點擊事件");
            console.log(e.target);
            if(midClickOption[e.target.outerHTML]){
                midClickOption[e.target.outerHTML]++;
            }else{
                midClickOption[e.target.outerHTML] = 1;
            }
        }
        else{
            alert("您点击了" + btnNum+ "号键，我不能确定它的名称。");
        }
    }
    var countRoll = 0;
    document.body.onscroll = function(e) {// 賦予滑鼠滚动判斷
        rollTop[countRoll] = document.documentElement.scrollTop;
        rollTime[countRoll] = new Date().getTime()-startuseTime;
        console.log("滾動事件" + rollTop[countRoll] + "\n" + rollTime[countRoll]);
        countRoll++;
    };
    document.body.onkeydown  = function(e) {// 賦予鍵盤點擊判斷
        console.log("鍵盤點擊 : "+e.key);
        if(keyBoardDown[e.key]){
                keyBoardDown[e.key]++;
            }else{
                keyBoardDown[e.key] = 1;
        }
    };
    startuseTime = new Date().getTime();
    startAlluseTime = new Date().getTime();
    getLocation();
    PrintVersion();
    getUserName();
}

setInterval(function (){
    eventJsonData();
    sendData();
}, 5000);
setTimeout(function (){
    userJsonData();
    sendData();
}, 3000);

function eventJsonData(){
    console.log("eventJsonData");
    stopUseTime = new Date().getTime();
    jsonData.useTime = stopUseTime - startuseTime;

    jsonData.leftClickOption = leftClickOption;
    jsonData.rightClickOption = rightClickOption;
    jsonData.midClickOption = midClickOption;
    jsonData.keyBoardDown = keyBoardDown;
    clearEventJsonData();
    jsonDataAll.userTime = new Object();
    jsonDataAll.userTime[startAlluseTime] = jsonData;
}
function clearEventJsonData(){
    console.log("clearEventJsonData");
    startuseTime = stopUseTime;

    leftClickOption = new Object();
    rightClickOption = new Object();
    midClickOption = new Object();
    keyBoardDown = new Object();
}
function userJsonData(){
    console.log("userJsonData");

    jsonData.userLocation = new Object();
    jsonData.userLocation.userLatitude = new Object();
    jsonData.userLocation.userLongitude = new Object();
    jsonData.userLocation.userCity = new Object();
    jsonData.userLocation.userLatitude[userLatitude] = 1;
    jsonData.userLocation.userLongitude[userLongitude] = 1;
    jsonData.userLocation.userCity[userCity] = 1;

    jsonData.userLanguages = new Object();
    jsonData.userComeFrom = new Object();
    jsonData.userLanguages[userLanguages] = 1;
    jsonData.userComeFrom[userComeFrom] = 1;
    jsonDataAll.userTime = new Object();
    jsonDataAll.userTime[startuseTime] = jsonData;
}

var myUserName = "noUserName";
function getUserName() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    {
        if(this.readyState == 4 && this.status == 200) {
            myUserName = this.responseText;
            console.log("myUserName = " + myUserName);
        }
    }
    xhr.open("POST", "/");
    xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
    xhr.send("event=" + "getUserName" + "&userName=" + myUserName + "&newData=" + "{}");
}

function sendData() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    {
        if(this.readyState == 4 && this.status == 200) {
        }
    }
    xhr.open("POST", "/");
    xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
    xhr.send("event=" + "sendData" + "&userName=" + myUserName + "&newData=" + JSON.stringify(jsonDataAll));
    jsonData = new Object();
    jsonDataAll = new Object();
}
/*
var rollTop = new Array();;//滾動事件
var rollTime = new Array();;//滾動時間
var mouseTrackTime = new Array();//紀錄滑鼠軌跡時間
var mouseTrackElement = new Array();//紀錄滑鼠軌跡*/





//經緯度定位會跑點
//onbeforeunload要點擊才能正確執行?
