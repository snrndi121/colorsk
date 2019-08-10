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

app.use(express.static(__dirname + '/public'));//express
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.set('views', __dirname + '/views');//ejs
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(cors());//cross-browsing
//1.3. 변수 설정
const BASE_COLOR_NUM = 16;
//basic cloth combination
const closet_match = {
    best : {
      "TOP" : ["PANTS"],
      "PANTS" : ["TOP", "BELTS"],
      "SHOES" : ["PANTS", "SOCKS", "BELTS"],
      "SKRITS" : ["TOP"]
      "SOCKS" : ["SHOE"],
      "BELTS" : ["PANTS", "SHOE"],
      "T-SHIRTS" : ["PANTS", "SHOES"],
      "Y-SHIRTS" : ["NECKTIE", "PANTS"],
      "NECKTIE" : ["Y-SHIRT", "BELTS"],
      "COAT" : ["SHOES", "PANTS", "TOP"],
      "TRAINNING" : ["SNEAKERS"],
      "ONE-PIECE" : ["SHOES"],//구두나 힐은 별도 마련할 것
      "SNEAKERS" : [],
      "HILL" : [],
      "STOCKING" : []
    },
    ban : {
      "TOP" : [""],
      "T-SHIRTS" : ["Y-SHIRTS", "SHOES"],
      "Y-SHIRTS" : ["T-SHIRTS"],
      "PANTS" : ["SKRITS", "ONE-PIECE"],
      "SHOES" : ["HILL", "SNEAKERS"],
      "SKRITS" : ["PANTS"]
      "BELTS" : [],
      "NECKTIE" : ["T-SHIRT"],
      "SOCKS" : [""],
      "TRAINNING" : ["SHOES"]
      "COAT" : [""],
      "HILL" : ["SNEAKERS", "SHOES"],
      "SNEAKERS" : ["SHOES", "HILL"],
      "ONE-PIECE" : ["SKRITS", "PANTS"],
      "STOCKING" : ["BELTS", "PANTS", "SOCKS", "TRAINNING", ]
    }
}
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
//basic color combination
const color_match = {
    best : [
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
    ],
    ban : []
};
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
  *   < Action category >
  *
  * 1. MYDOC.INTENT.match -> 컬러 매칭 여부(옷 + 색깔 || 색깔)
    1.1. 2cloth + 2color
    1.2. 2cloth + 1color
    1.3. no     + 2color
    1.$. default
  *
*/
//3.0 health
app.get('/health', function (req, res) {
    app.sendStatus(200);
})
//3.1.API_match -> ok
app.post('/MC.ACTION.match', function (req, res){
  console.log("\n>> APi_match from SK match");
  //Get value from body
  var action_name = req.body.action.actionName;
  var mVersion = req.body.version;
  var mParams = req.body.action.parameters;
  var mResponse = mParams.query_type;
  var mresultCode = 'OK';
  //Set response body
  var body = {
    version : mVersion,
    resultCode : mresultCode,
    output : {
      src_cloth : mParams.src_cloth,
      src_color : mParams.src_color,
      dst_cloth : mParams.dst_cloth,
      dst_color : mParams.dst_color,
      query_type : mParams.query_type,
      response_type : mResponse.value,
      resultCode : mresultCode,
      resultColor : "",
      advice_msg : ""
    },
    directives : []
  };
  //Part1. Response 'Match' query
  IsMatchColor(mParams.src_color, mParams.dst_color)
  .then(function(match_res) {
    body.output.resultColor = match_res;
    console.log(body);
    return res.json(body);
  })
  .catch(function(err_code) {
    body.resultCode = err_code;
    return res.json(body);
  });
  //Part2. Response 'UNMATCH' query
  //Part3. Response 'SELECT' query
});
app.post('/MC.ACTION.ton'), function (req, res) {

});
app.post('/MC.ACTION.about'), function (req, res) {
  //같은 계통의 색깔은 무엇인지
  //보색은 무엇인지ㅂ
});
/*
  *
  ******* part4.서버-함수 선언 *******
  *
*/

//4.1 두 컬러간 매칭 파악
function IsMatchColor(src_color, dst_color) {
    return new Promise( function (resolve, reject) {
        //exception
        if (!src_color) {
            console.log("\n### Server method_IsMatchColor() ###\n >> error(): it has no src_color");
            reject("err_undef_color");
        }
        //get color code
        getColorCategory(src_color.value)
        .then(function (src_id) {
                console.log("\n >> (1)find the source_id : " + src_id);
                //case1 : 1color + xCloth
                if (!dst_color) {
                  console.log(">> func_IsMatchColor OUT");
                  resolve(color_pallet[src_id].code);
                }
                //case2 : 2color + xCloth
                else {
                    getColorCategory(dst_color.value)
                    .then(function (dst_id) {
                        console.log("\n >> (2)find the dest_id : " + dst_id);
                        const dst_code = color_pallet[dst_id].code;
                        var i = 0;
                        for (; i < color_match.best[src_id].length; ++i) {
                              console.log(" >> for_cur_color info : " + color_match.best[src_id][i]);
                              if (color_match.best[src_id][i] == dst_code) {
                                  console.log(">> func_IsMatchColor OUT");
                                  resolve("match");
                              }
                        }
                        if (i == color_match.best[src_id].length) {
                            console.log(">> func_IsMatchColor OUT");
                            resolve(color_pallet[src_id].code);
                        }
                    })
                    .catch(function(err_code) {
                        console.log("\n >> (2)sorry, server cannot find the source color");
                        reject(err_code);
                    });
                }
          })
          .catch(function(err_code) {
              console.log("\n >> (1)sorry, server cannot find the source color");
              reject(err_code);
          });
    });
}
//4.2 컬러 계통찾기(Find color's index from color_pallet)
function getColorCategory(color_name) {
    return new Promise(function (resolve, reject) {
        console.log(">> func_getColorCategory IN");
        //Exception : parameter from SK -> abnormal
        if (!color_name || BASE_COLOR_NUM < 0) {
            reject("err_undef_pallet");
        }
        for (i = 0; i < BASE_COLOR_NUM; ++i) {
          if (color_name == color_pallet[i].name) {
              console.log(">> func_getColorCategory OUT");
              resolve(i);
          }
        }
    })
}
//4.3 컬러 톤
function WhatToneColor(src_color) {
    return new Promise(function (resolve, reject) {

    })
}
//4.4 매칭이 가능한 옷인지
function IsMatchCloth(src_cloth, dst_cloth) {
    //src_cloth일 때 신경써야하는 옷
    //dst_cloth가 있으면 거기에 해당되는 지 알려주고,
    //아니라면, 그냥 그 중에 하나 말해주면 됨.
    return new Promise (function (resolve, reject) {
          checkBanClothes(src_cloth, dst_cloth)
          .then()
    });
}
function findBestClothes(src_cloth, dst_cloth) {
    return new Promise (function (resolve, reject) {
        //case1 : xColor
        if (!src_cloth || closet_match.best.src_cloth) {
              resolve("not_found_cloth");
        }
        //exception : src_cloth == dst_cloth
        if (src_cloth == dst_cloth) {
            // resolve(closet_match.best.src_cloth[0]);
            reject("found_same_cloth");
        } else if (!dst_cloth) {
            resolve(closet_match.best.src_cloth[0]);
        } else {
            //ban_list check
            checkBanClothes(src_cloth, dst_cloth)
            .then(function())
        }
    });
}
function checkBanClothes(src_cloth, dst_cloth) {
    return new Promise (function (resolve, reject) {
        var ban_list = closet_match.best.src_cloth;
        for (i = 0; i < ban_list.length; ++i) {
            if (ban_list[i] == dst_cloth)
        }
    });
}
//4.$. 서버처리-대기
app.listen(3000);
console.log("Listening on port", port);
