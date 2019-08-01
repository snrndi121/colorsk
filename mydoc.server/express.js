/*
  *
  *******  part1.환경설정 *******
  *
*/
//1.1.설정-모듈 라이브러리
var express = require("express");//express
var app = express();
var request = require('request');//request
var port = process.env.PORT || 3000;
var cors = require('cors');//cross-browsing
// var mysql = require('mysql');//mysql
// ***********************************************************
// mysql-booster 관리
// var MysqlPoolBooster = require('mysql-pool-booster');
// mysql = MysqlPoolBooster(mysql);
// // db-configuration 적용
// mysql.createPool(db_config);
// ***********************************************************
//1.2.설정-연동
// var connection = mysql.createConnection(//mysql
// {
//   host     : '127.0.0.1',//localhost로 하면 에러남
//   user     : 'root',
//   password : 'Flower5wantnight',
//   database : 'mydoc'
// });
// connection.connect();

app.use(express.static(__dirname + '/public'));//express
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.set('views', __dirname + '/views');//ejs
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(cors());//cross-browsing
//1.3. 변수 설정
// const tb_disease = "tb_disease_list";
// const tb_body = "tb_bodypart_list";
/*
  *
  *******  part2.프론트-화면 렌더링 *******
  *
*/
//2-1. health check
//express_ref : http://expressjs.com/en/5x/api.html
app.get('/health', function (req, res) {
    // res.sendStatus(200);// equivalent to res.status(200).send('OK')
    res.status(200).send('OK');
})
//2-2. 메인
app.get('/', function (req, res) {
    res.render('index')
})
app.get('/searchAll', function (req, res) {
    res.render('search')
})
/*
  *
  ******* part4.서버-동작 선언 *******
  *
*/
//3-1. 액션_검색(API)
/*
  * 손목 건초염이면 손이 아파?
  * 신체 리스트 = {bid, bname} : tb_bodypart_list
  * 질병 리스트 = {did, bid, dname, dinfo} : tb_disease_list
  * 질병 = {관련 신체 부위}
*/
//크롤링 : http://www.amc.seoul.kr/asan/healthinfo/disease/diseaseSubmain.do#
/*
  Requeset Body
{
    "version": "2.0",
    "action": {
        "actionName": "{{string}}",
        "parameters": {
            KEY: {
                "type": "{{string}}",
                "value": VALUE
            }
        }
    },
    "event": {
        "type": "{{string}}"
    },
    "context": {
        "session": {
            "accessToken": "{{string}}"
        },
        "device": {
            "type": "{{string}}",
            "state": {
                KEY: VALUE
            }
        },
        "supportedInterfaces": {
            "AudioPlayer": {
                "playerActivity": "PLAYING",
                "token": "string value",
                "offsetInMilliseconds": 100000
            }
        },
        "privatePlay" : { } // reserved
    }
}
*/
/*
  *   < Action category >
  *
  * 1. MYDOC.INTENT.match -> 컬러 매칭 여부(옷 + 색깔 || 색깔)
    1.1. 2cloth + 2color
    1.2. 2cloth + 1color
    1.3. no     + 2color
    1.$. default
  *
*/
//3.1.Main -> ok
app.post('/', function (req, res) {
  console.log("\n>> APi_main from SK main");
  var action_name = req.body.action.actionName;
  var nugu_version = req.body.version;
  var action = req.body.action;
  var action_params = req.body.action.parameters;

  console.log(action);
  var mresultCode = 'OK';
  var body = {
	version : nugu_version,
	resultCode : mresultCode,
	output : {
		requestNum : 'hoho',//action_params.requestNum,
		resultCode : mresultCode,
		resultDesc : action_params.requestNum + "is Called"
	},
	directives : []
  };
  res.json(body);
})
app.post('/MC.ACTION.match', function (req, res){
  console.log("\n>> APi_match from SK search");
  var action_name = req.body.action.actionName;
  var mVersion = req.body.version;
  var mAction = req.body.action;
  var mParams = req.body.action.parameters;
  var mresultColor = "";
  console.log(mAction);
  //branch-action
  if (mParams.dst_color && mParams.src_color) {
      //2cloth + 2color
      //If the two color are matched well,
      mresultColor = IsMatchColor(mParams.src_color, mParams.dst_color);
  } else if (mParams.dst_cloth && mParams.src_cloth) {
      //2cloth + 1color
      //what the color matched well is it
      mresultColor = IsMatchColor(mParams.src_color, mParams.dst_color);
  } else {
      //default
      mresultColor ="";
  }
  var mresultCode = 'OK';
  var body = {
      version : mVersion,
      resultCode : mresultCode,
      output : {
        src_cloth : mParams.src_cloth,//action_params.requestNum,
        src_color : mParams.src_color,
        dst_cloth : mParams.dst_cloth,
        dst_color : mParams.dst_color,
        query_type : mParams.query_type,
        resultCode : mresultCode,
        resultColor : mresultColor
      },
      directives : []
  };
  res.json(body);
})
/*
  *
  ******* part4.서버-함수 선언 *******
  *
*/
//4.1 두 컬러간 매칭 파악
function IsMatchColor(color_src, color_dst) {
    var res = "";
    //exception
    if (!color_src) {return res;}
    //2color

    //1color
}
//4.2 컬러 계통찾기
function getColorCategory(color_src) {
    let color_code ="";
    switch(color_src) {
        case 'WHITE' :
          color_code = "c000"
          break;
        case 'BLACK' :
          color_code = color_code"c001"
          break;
        case 'RED' :
          color_code = "c002"
          break;
        case 'ORANGE' :
          color_code = "c003"
          break;
        case 'YELLOW' :
          color_code = "c004"
          break;
        case 'GREEN' :
          color_code = "c005"
          break;
        case 'BLUE' :
          color_code = "c006"
          break;
        case 'INDIGO' :
          color_code = "c007"
          break;
        case 'PURPLE' :
          color_code = "c008"
          break;
        case 'GOLD' :
          color_code = "c009"
          break;
        case 'SILVER' :
          color_code = "c010"
          break;
        case 'PINK' :
          color_code = "c011"
          break;
        case 'SKY' :
          color_code = "c012"
          break;
        case 'IVORY' :
          color_code = "c013"
          break;
        case 'BEIGE' :
          color_code = "c014"
          break;
    }
    return color_code;
}
//4.$. 서버처리-대기
app.listen(3000);
console.log("Listening on port", port);
