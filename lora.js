const express = require('express');
const app = express();
const url = require('url');
const querystring = require('querystring');
const mysql = require('mysql');
const request = require('request')
const fs = require('fs');


// 실제 서버에 올라가는 코드와 차이가 있습니다. 서버 ip, db연결 정보 등은 대체/삭제 한 코드입니다.
let connection = mysql.createConnection({
    host     : '198.13.44.92',
    user     : 'admin',
    password : 'admin!@dbpass1',
    database : 'Maker_LoRa'
})


function pad2(n) { return n < 10 ? '0' + n : n }

//connection.connect();
app.use(express.static('public'));

app.get('/get/', (req, res) => {
  var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  parsedobj = url.parse(fullUrl);
  parsedobj = querystring.parse(parsedobj.query);

  if(parsedobj.status=='set'){

    sqlquery = 'INSERT INTO `data` (`debug`, `data_num`, `data_temp`,`data_humid` ,`data_dust`, `data_co2`, `data_pres`,`data_batt`,`timeforme`) VALUES (?,?,?,?,?,?,?,?,?)';
    if(Number(parsedobj.num)==NaN||parseFloat(parsedobj.temp)==NaN||parseFloat(parsedobj.humid)==NaN||parseFloat(parsedobj.dust)==NaN||parseFloat(parsedobj.pres)==NaN){
        res.end("err")
    }
    else{
        var date = new Date();

        let params = [500,Number(parsedobj.num),parseFloat(parsedobj.temp),parseFloat(parsedobj.humid),parseFloat(parsedobj.dust),0.0,parseFloat(parsedobj.pres),100,date.getFullYear().toString() + pad2(date.getMonth() + 1) + pad2( date.getDate()) + pad2( date.getHours() ) + pad2( date.getMinutes() ) + pad2( date.getSeconds() )];
        setTimeout(()=>{
            connection.query(sqlquery,params, function (error, results, fields) {
                if (error) {
                    console.log(error);
                }
                else{
                    console.log('Success!');
                }

        },1000)
        
    });
    res.end('ACK');
    }
    
  }

  else{
      res.writeHead(200,{'Content-Type':'text/html'});
      res.end('Handle'); 
    }   
});

app.get('/',(req,res)=>{

    
    fs.readFile("index.html", function (error, pgResp) {
        if (error) {
            console.log(error)
            res.writeHead(404);
            res.write('Contents you are looking for are Not Found');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(pgResp);
        }
        res.end();
    });
})

app.get('/bob/',(req,res)=>{
    var date = new Date();
    
    request.get('https://dev-api.dimigo.in/dimibobs/'+date.yyyymmdd(),{},(errror,response,body)=>{
        res.send(body)
        res.end();
    })

})
app.get('/office/',(req,res)=>{

    fs.readFile("office.html", function (error, pgResp) {
        if (error) {
            console.log(error)
            res.writeHead(404);
            res.write('Contents you are looking for are Not Found');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(pgResp);
        }
        res.end();
    });
})

app.get('/complain/',(req,res)=>{

    let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    parsedobj = url.parse(fullUrl);
    parsedobj = querystring.parse(parsedobj.query);

    if(parsedobj.status == 'teacher'){
        let sqlquery = "SELECT * FROM `request` ORDER BY idx DESC LIMIT 5";

        connection.query(sqlquery, function (error, results, fields) {
            if (error) {
                console.log(error);
            }
            else{
                res.send(results)
                res.end('');
            }
        });

    }
    else{
        let sqlquery = 'INSERT INTO `request` (`cless`, `content`) VALUES (?,?)';
        let param = [parsedobj.cless,parsedobj.content];
        connection.query(sqlquery,param, function (error, results, fields) {
            if (error) {
                console.log(error);
            }
            else{
                
                res.end('성공적으로 잘 전송되었습니다.');
            }
        });

    }
    
})

app.get('/graph/',(req,res)=>{
    let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    parsedobj = url.parse(fullUrl);
    parsedobj = querystring.parse(parsedobj.query);
    let cless = parsedobj.class[0]
    if(cless != "a" && cless != undefined){
        date = new Date().yyyymmdd();
        //let sqlquery = "SELECT * FROM `data` WHERE `data_num`="+cless+" AND `timeforme` LIKE ? ORDER BY idx DESC LIMIT 200";
        let sqlquery = "SELECT * FROM `data` WHERE `data_num`="+cless+" ORDER BY idx DESC LIMIT 50";

        connection.query(sqlquery,String(date) + '%', function (error, results, fields) {
            if (error) {
                console.log(error);
            }
            else{
                res.send(results)
                res.end('');
            }
        });
    }
    else{
        date = new Date().yyyymmdd();
        //let sqlquery = "SELECT * FROM `data` WHERE `timeforme` LIKE ? ORDER BY idx DESC LIMIT 400";
        let sqlquery = "SELECT * FROM `data` ORDER BY idx DESC LIMIT 50";

        connection.query(sqlquery,String(date) + '%', function (error, results, fields) {
            if (error) {
                console.log(error);
            }
            else{
                res.send(results)
                res.end('');
            }
        });
    }
    
})



app.listen(8002, () => {
  console.log('Application On!');
});





function format_two_digits(n) {
    return n < 10 ? '0' + n : n;
}


Date.prototype.yyyymmdd = function() {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();
    
    return [this.getFullYear(),
            (mm>9 ? '' : '0') + mm,
            (dd>9 ? '' : '0') + dd
            ].join('');
};