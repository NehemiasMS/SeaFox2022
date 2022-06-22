ng_app = "order"
ng_controller = "MainCtrl"
var scope;

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


var ind=0;
var Servo_Gripper = 375;
var Servo_Link = 150;

var Servo_camera = 375;
var Camera_state = 0;

var light_cmd = 225;
var light_state = 0;

var rov_enable = 0;


var app = angular.module(ng_app, [])

app.controller(ng_controller, ['$scope', '$window', function($scope, $window){

    $scope.maxForward = [277,277,277,277,277,277];
    $scope.maxReverse = [337,337,337,337,337,337];

    $scope.changeThruster = function(response){
        if(response == 'TopLeft'){
            $scope.thruster = {
                Name: 'Top-Left',
                index: 0
            }
        } else if(response == 'TopRight'){
            $scope.thruster = {
                Name: 'Top-Right',
                index: 1
            }
        } else if(response == 'MiddleLeft'){
            $scope.thruster = {
                Name: 'Middle-Left',
                index: 4
            }
        } else if(response == 'MiddleRight'){
            $scope.thruster = {
                Name: 'Middle-Right',
                index: 5
            }
        } else if(response == 'BottomLeft'){
            $scope.thruster = {
                Name: 'Bottom-Left',
                index: 2
            }
        } else if(response == 'BottomRight'){
            $scope.thruster = {
                Name: 'Bottom-Right',
                index: 3
            }
        }   
    }

    //Code
    var haveEvents = 'ongamepadconnected' in window;
    var controllers = {};

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
        messageType : 'std_msgs/Int16MultiArray'
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

        //BOTON_A
        if((controller.buttons[0].value == 1) && (botonA == 0)){
            if(Servo_camera < 432){
                setTimeout(Servo_camera++, 50);
            } else {
                botonA = 1;
            }
            ind = 1;
        }

        if(controller.buttons[0].value == 0){
            botonA = 0;
        }
    //-----------------------------------------------------------------
    //BOTON_B
    if((controller.buttons[1].value == 1) && (botonB == 0)){
        //botonB = 1;
       //Servo_Link = 375;
       if(Servo_Link < 400){
        setTimeout(Servo_Link++, 50);
    } else {
        botonB = 1;
    }
       ind = 1;
    }

    if(controller.buttons[1].value == 0){
        botonB = 0;
    }
    //-----------------------------------------------------------------
    //BOTON_X
    if((controller.buttons[2].value == 1) && (botonX == 0)){
        //botonX = 1;
        if(Servo_camera > 360){
            setTimeout(Servo_camera--, 50);
        } else {
            botonX = 1;
        }
        ind = 1;
       
    }

    if(controller.buttons[2].value == 0){
        botonX = 0;
    }

    //----------------------------------------------------
    //BOTON_Y

    if((controller.buttons[3].value == 1) && (botonY == 0)){
       // botonY = 1;
       if(Servo_Link > 150){
        setTimeout(Servo_Link--, 50);
    } else {
        botonY = 1;
    }
       // Servo_Link = 480;
        ind = 1;
       
    }

    if(controller.buttons[3].value == 0){
        botonY = 0;
    }
    //--------------------------------------
    //BOTON LB

    if((controller.buttons[4].value == 1) && (botonLb == 0)){
        
        Servo_Gripper=110;
        botonLb=1;

        /*
        if(Servo_Gripper > 192){
            setTimeout(Servo_Gripper = Servo_Gripper-1, 1);
        } else {
            botonRb = 1;
        }
        */

        ind = 1;
       
    }

    if(controller.buttons[4].value == 0){
        botonLb = 0;
    }
    //-----------------------------------------
    //BOTON RB

    if((controller.buttons[5].value == 1) && (botonRb == 0)){
        Servo_Gripper=600;
        botonRb=1;

        /*
        if(Servo_Gripper < 500){
            setTimeout(Servo_Gripper = Servo_Gripper+1, 1);
        } else {
            botonLb = 1;
        }
        */

        ind = 1;
       
    }

    if(controller.buttons[5].value == 0){
        botonRb = 0;
    }
    //--------------------------------------------------------------
    // BACK

    if((controller.buttons[8].value == 1) && (back == 0)){
    back = 1;
    if (light_state == 0){
        light_cmd = 307;
        light_state = 1;
    }
    else{
        light_cmd = 225;
        light_state = 0;       
    }
    ind = 1;
    }   

    if(controller.buttons[8].value == 0){
        back = 0;
    }

    //-----------------------------------------------------------
    //START
        if((controller.buttons[9].value == 1) && (start == 0)){
            start = 1;
            if (rov_enable == 0){
                rov_enable = 1;
            }
            else{
               rov_enable = 0;      
            }
            ind = 1;
        
        }

        if(controller.buttons[9].value == 0){
            start = 0;
    }  

    //----------------------------------------------------------
    
        if(lStick != controller.buttons[10].value){
        lStick = controller.buttons[10].value;
        console.log("L Stick: "+lStick);
        ind = 1;
        }

        if(rStick != controller.buttons[11].value){
        rStick = controller.buttons[11].value;
        console.log("R Stick: "+rStick);
        ind = 1;
        }
    
        if(botonLt != controller.buttons[6].value.toFixed(2)){
        botonLt = controller.buttons[6].value.toFixed(2);
        console.log("R Stick: "+rStick);
        ind = 1;
        }
        
        if(botonRt != controller.buttons[7].value.toFixed(2)){
        botonRt = controller.buttons[7].value.toFixed(2);
        ind = 1;
        }
        
        if(izqX != controller.axes[0].toFixed(2)){
        izqX = controller.axes[0].toFixed(2);
        console.log("IzqX");
        ind=1;
        }
    
        if(izqY != controller.axes[1].toFixed(2)){
        izqY = controller.axes[1].toFixed(2);
        console.log("IzqY");
        ind=1;
        }

        if(derX != controller.axes[2].toFixed(2)){
        derX = controller.axes[2].toFixed(2);
        console.log("derX");
        ind=1;
        }

        if(derY != controller.axes[3].toFixed(2)){
        derY = controller.axes[3].toFixed(2);
        console.log("derY");
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
        var tRzArr = [0,0,0,0,1,1];
        var tRrArr = [0,0,0,0,-1,-1];



        const arr = [
            yLArr.map(x => x * (izqY)),
            xLArr.map(x => x * izqX*(-1)),
            xRArr.map(x => x * derX*(-1)),
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
            
            Thrusters[j] = (Thrusters[j]-(-1)) * ($scope.maxForward[j] - $scope.maxReverse[j]) / (1-(-1)) + $scope.maxReverse[j];

            if ((Thrusters[j] >302) && (Thrusters[j]<312)){
                Thrusters[j] = 307;
            }

        }

       // console.log(Thrusters)

        
        //Suscribe to ROS Node In Jetson
        if (rov_enable == 1){


        var pca9685 = new ROSLIB.Message({
            data : [
              parseInt(Thrusters[0]),
              parseInt(Thrusters[1]),
              parseInt(Thrusters[2]),
              parseInt(Thrusters[3]),
              parseInt(Thrusters[4]),
              parseInt(Thrusters[5]),
              parseInt(Servo_Gripper),
              parseInt(Servo_Link),
              parseInt(Servo_camera),
              parseInt(light_cmd),
              parseInt(307),
              parseInt(307),
              parseInt(307),
              parseInt(307),
              parseInt(307),
              parseInt(rov_enable)
            ]
          });
    
        cmdVel.publish(pca9685);
        console.log(Servo_camera)
        }
        else{

            var pca9685 = new ROSLIB.Message({
                data : [
                    parseInt(307),
                    parseInt(307),
                    parseInt(307),
                    parseInt(307),
                    parseInt(307),
                    parseInt(307),
                    parseInt(375),
                    parseInt(375),
                    parseInt(375),
                    parseInt(225),
                    parseInt(307),
                    parseInt(307),
                    parseInt(307),
                    parseInt(307),
                    parseInt(307),
                    parseInt(0)
                ]
                });
        
            cmdVel.publish(pca9685);
    
            }


        ind = 0;
    
    
    
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

    console.log($scope.x)

}])
