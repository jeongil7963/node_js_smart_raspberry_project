'use strict';

// config.json 에서 기본 설정값을 가져옴
 var config = require('./config.json');
 var field_id = config.channel; // field_id 값 설정
 var water_stop_time = config.water_stop_time; // water_stop_time 값 설정
 var shooting_time = config.shooting_time; //shooting time 값 설정
 var current_min; // 현재 시각 '분'
 var sub_min; // 촬영 시작 전 시간
 var camera_interval; // camera 모듈 반복 제어
//설정 및 촬영 소켓 모듈
var socket2 = require('socket.io-client')('http://13.124.28.87:3000');
//카메라 사용자 촬영 설정
var timeInMs;
var exec_photo = require('child_process').exec;
var photo_path;
var cmd_photo;
var socket = require('socket.io-client')('http://13.124.28.87:5001'); // 소켓서버에 연결
var dl = require('delivery'); // 파일 전송 모듈
var moment = require('moment'); // moment 시간 모듈
var mqtt = require('mqtt'); // mqtt 모듈
var client = mqtt.connect('mqtt://13.124.28.87'); // mqtt 서버 접속
var http = require('http'); // http socket
var delivery; // delivery 전역 설정
var temp = {};//소켓통신으로 이미지 파일을 서버로 전송
//관수 모듈//
var GPIO = require('onoff').Gpio;
var onoffcontroller = new GPIO(21, 'out');
//수분 측정 모듈//
var SerialPort = require('serialport'); //아두이노와 시리얼 통신할 수 있는 모듈
var parsers = SerialPort.parsers;
var parser = new parsers.Readline({
    delimiter: '\r\n'
});

//라즈베리파이와 연결된 디바이스 주소
var port = new SerialPort('/dev/ttyACM0', {
    baudrate: 9600
});

// 수분 측정
port.pipe(parser);

//포트 열기
port.on('open', function() {
    console.log('port open');
});

// open errors will be emitted as an error event
port.on('error', function(err) {
    console.log('Error: ', err.message);
});

parser.on('data', function(data) {
    console.log('Read and Send Data : ' + data);
    var str = data.toString();
    var strArray = str.split('-');

    if(strArray[0] == '1'){
      console.log("data 1");
        var sensorObj = strArray[1];
        var insert_url = '  http://api.thingspeak.com/update?api_key=5MT39RFSMKOS0BF4&field1=' + sensorObj;
    }else if(strArray[0] == '2'){
      console.log("data 2");
      var sensorObj = strArray[1];
      var insert_url = '  http://api.thingspeak.com/update?api_key=5MT39RFSMKOS0BF4&field2=' + sensorObj;
    }else if(strArray[0] == '3'){
      console.log("data 3");
      var sensorObj = strArray[1];
      var insert_url = '  http://api.thingspeak.com/update?api_key=5MT39RFSMKOS0BF4&field3=' + sensorObj;
    }else if(strArray[0] == '4'){
      console.log("data 4");
      var sensorObj = strArray[1];
      var insert_url = '  http://api.thingspeak.com/update?api_key=5MT39RFSMKOS0BF4&field4=' + sensorObj;
    }
   // json 형식 data를 객체형식으로 저장
    http.get(insert_url, (resp) => {
        let data = '';
        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            //console.log(JSON.parse(data).explanation);
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
});
