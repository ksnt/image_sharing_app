import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';


/// routing

Router.configure({
	layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
  this.render('nothing',{
  	to:"navbar"
  });
  this.render('welcome',{
  	to:"top"
  });
  this.render('nothing',{
  	to:"main"
  });
});

Router.route('/items', function () {
  this.render('navbar',{
  	to:"navbar"
  });
  this.render('items',{
  	to:"top"
  });
  this.render('canvas',{
  	to:"main"
  });
});

Router.route('/conversation', function () {
  this.render('navbar',{
  	to:"navbar"
  });
  this.render('items',{
  	to:"top"
  });
  this.render('canvas',{
  	to:"main"
  });
});

Router.route('/manual', function () {
  this.render('navbar',{
  	to:"navbar"
  });
  this.render('nothing',{
  	to:"top"
  });
  this.render('manual',{
  	to:"main"
  });
});


Template.canvas.onRendered(function () {
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var color = "black"
  //ctx.fillStyle = color;
  //ctx.fillRect(10, 10, 100, 100);
  //ctx.font = "48px serif";
  //ctx.fillText("What is your idea?", 10, 50);
 
  /*
  function onDown(e) {
    console.log("down");
  }
  canvas.addEventListener('mousedown', onDown, false);

  function onClick(e) { // get the (x,y) point
    console.log("click");
    var x = e.clientX - canvas.offsetLeft;
    var y = e.clientY - canvas.offsetTop;
    console.log("x:", x, "y:", y);

    drawRect(x, y, 10, 10);
  }

  function drawRect(x, y, width, height) {
    var context = canvas.getContext('2d');
    context.fillRect(x, y, width, height);
  }

  canvas.addEventListener('click', onClick, false);
  */


  //マウスを操作
   var mouse = {x:0,y:0,x1:0,y1:0,color:"black"};
   var draw = false;

   //マウスの座標を取得する
   canvas.addEventListener("mousemove",function(e) {
     var rect = e.target.getBoundingClientRect();
     ctx.lineWidth = document.getElementById("lineWidth").value;
     ctx.globalAlpha = document.getElementById("alpha").value/100;
     //ctx.lineWidth = 10
     //ctx.globalAlpha = 100

     mouseX = e.clientX - rect.left;
     mouseY = e.clientY - rect.top;
   
     //クリック状態なら描画をする
     if(draw === true) {
       ctx.beginPath();
       ctx.moveTo(mouseX1,mouseY1);
       ctx.lineTo(mouseX,mouseY);
       ctx.lineCap = "round";
       ctx.stroke();
       mouseX1 = mouseX;
       mouseY1 = mouseY;
       }
  });

  //クリックしたら描画をOKの状態にする
  canvas.addEventListener("mousedown",function(e) {
    draw = true;
    mouseX1 = mouseX;
    mouseY1 = mouseY;
    undoImage = ctx.getImageData(0, 0,canvas.width,canvas.height);
  });

  //クリックを離したら、描画を終了する
  canvas.addEventListener("mouseup", function(e){
    draw = false;
  });

  //線の太さの値を変える
  lineWidth.addEventListener("mousemove",function(){  
    var lineNum = document.getElementById("lineWidth").value;
    document.getElementById("lineNum").innerHTML = lineNum;
  });

  //透明度の値を変える
  alpha.addEventListener("mousemove",function(){  
  var alphaNum = document.getElementById("alpha").value;
  document.getElementById("alphaNum").innerHTML = alphaNum;
  });

  //消去ボタンを起動する
 $('#clear').click(function(e) {
 		if(!confirm('Do you really clean up?')) return;
        e.preventDefault();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
  });
    
//戻るボタンを配置
$('#undo').click(function(e) {
    ctx.putImageData(undoImage,0,0);
});

//保存する
//function save(){
$('#save').click(function(e) {
  /*var can = canvas.toDataURL();
  can = can.replace("image/png", "image/octet-stream");
  window.open(can,"save");*/
  var imageType = "image/png";
  var fileName = "image.png";
  var canvas = document.getElementById("canvas");
   // base64エンコードされたデータを取得 「data:image/png;base64,iVBORw0k～」
   var base64 = canvas.toDataURL(imageType);
   // base64データをblobに変換
   var blob = Base64toBlob(base64);
   // blobデータをa要素を使ってダウンロード
   saveBlob(blob, fileName);
 });

// Base64データをBlobデータに変換
function Base64toBlob(base64)
{
    // カンマで分割して以下のようにデータを分ける
    // tmp[0] : データ形式（data:image/png;base64）
    // tmp[1] : base64データ（iVBORw0k～）
    var tmp = base64.split(',');
    // base64データの文字列をデコード
    var data = atob(tmp[1]);
    // tmp[0]の文字列（data:image/png;base64）からコンテンツタイプ（image/png）部分を取得
	var mime = tmp[0].split(':')[1].split(';')[0];
    //  1文字ごとにUTF-16コードを表す 0から65535 の整数を取得
	var buf = new Uint8Array(data.length);
	for (var i = 0; i < data.length; i++) {
        buf[i] = data.charCodeAt(i);
    }
    // blobデータを作成
	var blob = new Blob([buf], { type: mime });
    return blob;
}

// 画像のダウンロード
function saveBlob(blob, fileName)
{
    var url = (window.URL || window.webkitURL);
    // ダウンロード用のURL作成
    var dataUrl = url.createObjectURL(blob);
    // イベント作成
    var event = document.createEvent("MouseEvents");
    event.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    // a要素を作成
    var a = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
    // ダウンロード用のURLセット
    a.href = dataUrl;
    // ファイル名セット
    a.download = fileName;
    // イベントの発火
    a.dispatchEvent(event);
}

 //色を選択
 $('li').click(function() {
        ctx.strokeStyle = $(this).css('background-color');
 });

}); // / of Template.canvas.onRendered


/// accounts config

if (Meteor.isClient) {
	Accounts.ui.config({
    passwordSignupFields: "USERNAME_AND_EMAIL"
  });

  Template.items.helpers({username:function(){
  	if(Meteor.user()){
  		return Meteor.user().username;
  	}
  	else{
  		return "anonymous internet user";
  	}
  }

  });
}