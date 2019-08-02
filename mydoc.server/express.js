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
// mysql-booster
// var MysqlPoolBooster = require('mysql-pool-booster');
// mysql = MysqlPoolBooster(mysql);
// // db-configuration 적용
// mysql.createPool(dhttps://github.com/snrndi121/colorsk.gitb_config);
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
const BASE_COLOR_NUM = 16;
//color_info
const color_pallet = [
  {index : 0, code : "c000", name : "WHITE"},
  {index : 1, code : "c001", name : "BLACK"},
  {index : 2, code : "c002", name : "RED"},
  {index : 3, code : "c003", name : "ORANGE"},
  {index : 4, code : "c004", name : "YELLOW"},
  {index : 5, code : "c005", name : "GREEN"},
  {index : 6, code : "c006", name : "BLUE"},
  {index : 7, code : "c007", name : "INDIGO"},
  {index : 8, code : "c008", name : "PURPLE"},
  {index : 9, code : "c009", name : "GOLD"},
  {index : 10, code : "c010", name : "SILVER"},
  {index : 11, code : "c011", name : "PINK"},
  {index : 12, code : "c012", name : "SKY"},
  {index : 13, code : "c013", name : "IVORY"},
  {index : 14, code : "c014", name : "BEIGE"},
  {index : -1, code : "cccc", name : "err_undef_color"}
];
//basic combination
const color_combination = [
    [""],//WHITE(0)
    [""],//BLACK(1)
    ["c001", "c004"],//RED(2)
    ["c004", "c005", "c010"],//ORAGNE(3)
    ["c002", "c003", "c006", "c004", "c007", "c008", "c004", "c009", "c014", "c012"],//YELLOW(4)
    ["c001", "c003", "c008", "c010", "c011", "c013", "c014"],//GREEN(5)
    ["c004", "c012", "c014"],//BLUE(6)
    ["c004", "c009", "c010", "c014"],//INDIGO(7)
    ["c004", "c005"],//PURPLE(8)
    ["c004", "c007", "c012"],//GOLD(9)
    ["c003", "c005", "c007", "c014"],//SILVER(10)
    ["c005", "c012", "c013"],//PINK(11)
    ["c000", "c004", "c011", "c006", "c004", ],//SKY(12)
    ["c000", "c005", "c011"],//IVORY(13)
    ["c004", "c005", "c006", "c007", "c012"],//BEIGE(14)
];
//color-priority (not yet)
/*'WHITE'
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
  console.log("\n>> APi_match from SK match");
  var action_name = req.body.action.actionName;
  var mVersion = req.body.version;
  var mAction = req.body.action;
  var mParams = req.body.action.parameters;
  var mresultColor = "";
  var mresultCode = 'OK';
  console.log(mAction);
  console.log(mParams);
  var src_id, dst_id;
  var body = {
    version : mVersion,
    resultCode : mresultCode,
    output : {
      src_cloth : mParams.src_cloth,
      src_color : mParams.src_color,
      dst_cloth : mParams.dst_cloth,
      dst_color : mParams.dst_color,
      query_type : mParams.query_type,
      resultCode : mresultCode,
      resultColor : "err_undef_color"
    },
    directives : []
  };
  //get color code from request 'src_color', 'dst_color'
  getColorCategory(mParams.src_color.value)
  .then( function(src_id) {
        console.log("\n >>(1) find the source_id : " + src_id);
        getColorCategory(mParams.dst_color.value)
        .then( function(dst_id) {
            console.log("\n >> (2)find the dest_id : " + dst_id);
            IsMatchColor(src_id, dst_id).then( function(match_res) {
                console.log("\n >> Last called\n");
                body.output.resultColor = match_res;
                console.log(body);
                return res.json(body);
            })
            .catch(function(err) {
                console.log("\n >>(3) sorry, IsMatchColor has Invalid index");
                body.resultCode = err;
                return res.json(body);
            });
        })
        .catch(function(err) {
            console.log("\n >> (2)sorry, server cannot find the source color");
            return res.json(body);
        });

  })
  .catch(function(err) {
      console.log("\n >> (1)sorry, server cannot find the source color");
      return res.json(body);
  });
})
/*
  *
  ******* part4.서버-함수 선언 *******
  *
*/

//4.1 두 컬러간 매칭 파악
function IsMatchColor(src_color_id, dst_color_id) {
    return new Promise(function (resolve, reject) {
        //exception
        console.log(">> func_IsMatchColor IN");
        console.log("para1 : " + src_color_id + ",para2 : " + dst_color_id);
        if (!src_color_id || !dst_color_id) {
            console.log("\n### Server method_IsMatchColor() ###\n >> error(): it has no src_color");
            reject("err_undef_color");
        }
        const dst_code = color_pallet[dst_color_id].code;
        for (i = 0; i < color_combination[src_color_id].length; ++i) {
              console.log(" >> for_cur_color info : " + color_combination[src_color_id][i]);
              if (color_combination[src_color_id][i] == dst_code) {
                  console.log(">> func_IsMatchColor OUT");
                  resolve("match");
              }
        }
        console.log(">> func_IsMatchColor OUT");
        resolve("unmatch");
    });
}
//4.2 컬러 계통찾기(Find color's index from color_pallet)
function getColorCategory(color_name) {
    return new Promise(function (resolve, reject) {
        console.log(">> func_getColorCategory IN");
        //Exception : parameter from SK -> abnormal
        if (!color_name || BASE_COLOR_NUM < 0) {
          console.log(">> func_getColorCategory IN");
          reject(new Error("\n>> getColorCategory got error"));
        }
        //noraml
        for (i = 0; i < BASE_COLOR_NUM; ++i) {
          if (color_name == color_pallet[i].name) {
              console.log(">> func_getColorCategory OUT");
              resolve(i);
          }
        }
    })
}
//4.$. 서버처리-대기
app.listen(3000);
console.log("Listening on port", port);
