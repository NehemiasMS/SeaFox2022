ng_app = "order"
ng_controller = "MainCtrl"
var scope;

var app = angular.module(ng_app, [])

app.controller(ng_controller, ['$scope', '$window', function($scope, $window){

    //$scope.x = 15;
    //console.log($scope.x)
}])


//Code
var haveEvents = 'ongamepadconnected' in window;
var controllers = {};

var izqX = 0;
var izqY = 0;
var derX = 0;
var derY = 0;

var botonA = 0;
var botonB = 0;
var botonX = 0;
var botonY = 0;
var botonLb = 0;
var botonRb = 0;
var botonLt = 0;
var botonRt = 0;
var back = 0;
var start = 0;
var lStick = 0;
var rStick = 0;
var mode = 0;


var b = [];

var ros = new ROSLIB.Ros({
    url : 'ws://192.168.1.3:9090'
  });

  ros.on('connection', function() {
    console.log('Connected to websocket server.');
  });

  ros.on('error', function(error) {
    console.log('Error connecting to websocket server: ', error);
  });

  ros.on('close', function() {
    console.log('Connection to websocket server closed.');
  });

var cmdVel = new ROSLIB.Topic({
      ros : ros,
      name : 'seafox/navigation_cmd',
      messageType : 'geometry_msgs/Twist'
    });

function connecthandler(e) {
  addgamepad(e.gamepad);
}

function addgamepad(gamepad) {
  controllers[gamepad.index] = gamepad;

  var d = document.createElement("div");
  d.setAttribute("id", "controller" + gamepad.index);

  var t = document.createElement("h1");
  t.appendChild(document.createTextNode("gamepad: " + gamepad.id));
  d.appendChild(t);

  var b = document.createElement("div");
  b.className = "buttons";
  for (var i = 0; i < gamepad.buttons.length; i++) {
    var e = document.createElement("span");
    e.className = "button";
    //e.id = "b" + i;
    e.innerHTML = i;
    b.appendChild(e);
  }

  d.appendChild(b);

  var a = document.createElement("div");
  a.className = "axes";

  for (var i = 0; i < gamepad.axes.length; i++) {
    var p = document.createElement("progress");
    p.className = "axis";
    //p.id = "a" + i;
    p.setAttribute("max", "2");
    p.setAttribute("value", "1");
    p.innerHTML = i;
    a.appendChild(p);
  }

  d.appendChild(a);

  // See https://github.com/luser/gamepadtest/blob/master/index.html
  var start = document.getElementById("start");
  if (start) {
    start.style.display = "none";
  }

  document.body.appendChild(d);
  requestAnimationFrame(updateStatus);
}

function disconnecthandler(e) {
  removegamepad(e.gamepad);
}

function removegamepad(gamepad) {
  var d = document.getElementById("controller" + gamepad.index);
  document.body.removeChild(d);
  delete controllers[gamepad.index];
}

function updateStatus() {

  if (!haveEvents) {
    scangamepads();
  }

  var i = 0;
  var j;

  var ind=0;

  for (j in controllers) {
    var controller = controllers[j];
    var d = document.getElementById("controller" + j);
    var buttons = d.getElementsByClassName("button");

    for (i = 0; i < controller.buttons.length; i++) {
      var b = buttons[i];
      var val = controller.buttons[i];
      var pressed = val == 1.0;
      if (typeof(val) == "object") {
        pressed = val.pressed;
        val = val.value;
      }

      var pct = Math.round(val * 100) + "%";
      b.style.backgroundSize = pct + " " + pct;
      

      if (pressed) {
        b.className = "button pressed";
      } else {
        b.className = "button";
      }
    }

    if(botonA != controller.buttons[0].value){
      botonA = controller.buttons[0].value;
      console.log("A: "+botonA);
    }
   
    if(botonB != controller.buttons[1].value){
      botonB = controller.buttons[1].value;
      console.log("B: "+botonB);
    }

    if(botonX != controller.buttons[2].value){
      botonX = controller.buttons[2].value;
      console.log("X: "+botonX);
    }

    if(botonY != controller.buttons[3].value){
      botonY = controller.buttons[3].value;
      console.log("Y: "+botonY);
    }

    if(botonLb != controller.buttons[4].value){
      botonLb = controller.buttons[4].value;
      console.log("Lb: "+botonLb);
    }

    if(botonRb != controller.buttons[5].value){
      botonRb = controller.buttons[5].value;
      console.log("Rb: "+botonRb);
    }

    if(back != controller.buttons[8].value){
      back = controller.buttons[8].value;
      console.log("Back: "+back);
    }

    if(start != controller.buttons[9].value){
      start = controller.buttons[9].value;
      console.log("Start: "+start);
    }
   
    if(lStick != controller.buttons[10].value){
      lStick = controller.buttons[10].value;
      console.log("L Stick: "+lStick);
    }

    if(rStick != controller.buttons[11].value){
      rStick = controller.buttons[11].value;
      console.log("R Stick: "+rStick);
    }
 
    if(botonLt != controller.buttons[6].value.toFixed(2)){
      botonLt = controller.buttons[6].value.toFixed(2);
      ind = 1;
    }
    
    if(botonRt != controller.buttons[7].value.toFixed(2)){
      botonRt = controller.buttons[7].value.toFixed(2);
      ind = 1;
    }
    
    if(izqX != controller.axes[0].toFixed(2)){
      izqX = controller.axes[0].toFixed(2);
      ind=1;
    }
   
    if(izqY != controller.axes[1].toFixed(2)){
      izqY = controller.axes[1].toFixed(2);
      ind=1;
    }

    if(derX != controller.axes[2].toFixed(2)){
      derX = controller.axes[2].toFixed(2);
      ind=1;
    }

    if(derY != controller.axes[3].toFixed(2)){
      derY = controller.axes[3].toFixed(2);
      ind=1;
    }
  

    if(ind==1){

      //console.log(yLArr.map(x => x * izqY));

      //console.log(derY);

      //b = yLArr.map(x => x * izqY);
      //console.log(b)

      var yLArr = [1,1,-1,-1,0,0];
      var xLArr = [1,-1,1,-1,0,0];
      var xRArr = [1,-1,-1,1,0,0];
      var tRzArr = [0,0,0,0,-1,-1];
      var tRrArr = [0,0,0,0,1,1];



      const arr = [
          yLArr.map(x => x * (izqY*(-1))),
          xLArr.map(x => x * izqX),
          xRArr.map(x => x * derX),
          tRzArr.map(x => x * botonLt),
          tRrArr.map(x => x * botonRt)
        ]
        const [first] = arr
        const Thrusters = first.map((_, i) => {
        return arr.map(a => a[i]).reduce((a, b) => a + b, 0)
      })
      


      for (j=0; j<6; j++){
        
        if (Thrusters[j] > 1) {
          Thrusters[j] = 1
        }

        if (Thrusters[j] < -1) {
          Thrusters[j] = -1
        }
        
        Thrusters[j] = (Thrusters[j]-(-1)) * (465 - 271) / (1-(-1)) + 271;
      }

      console.log(Thrusters)
      
      //Suscribe to ROS Node In Jetson

      var twist = new ROSLIB.Message({
        linear : {
          x : parseFloat(Thrusters[0]),
          y : parseFloat(Thrusters[1]),
          z : parseFloat(Thrusters[2])
        },
        angular : {
          x : parseFloat(Thrusters[3]),
          y : parseFloat(Thrusters[4]),
          z : parseFloat(Thrusters[5])
        }
      });
    cmdVel.publish(twist);
    }

    var axes = d.getElementsByClassName("axis");
    for (i = 0; i < controller.axes.length; i++) {
      var a = axes[i];
      a.innerHTML = i + ": " + controller.axes[i].toFixed(4);
      a.setAttribute("value", controller.axes[i] + 1);
      
    }
  }
  requestAnimationFrame(updateStatus);

}

function scangamepads() {
  var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
  for (var i = 0; i < gamepads.length; i++) {
    if (gamepads[i]) {
      if (gamepads[i].index in controllers) {
        controllers[gamepads[i].index] = gamepads[i];
      } else {
        //addgamepad(gamepads[i]);
      }
    }
  }
}

window.addEventListener("gamepadconnected", connecthandler);
window.addEventListener("gamepaddisconnected", disconnecthandler);

if (!haveEvents) {
 setInterval(scangamepads, 500);
}