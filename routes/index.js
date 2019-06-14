var express = require('express')
var router = express.Router()
const bodyParser = require('body-parser')
const url = require('url')
const querystring = require('querystring')
const mysql = require('mysql')
const request = require('request')


let connection = mysql.createConnection({
  host     : '198.13.44.92',
  user     : 'admin',
  password : 'admin!@dbpass1',
  database : 'Maker_LoRa'
})

connection.connect();
router.use(express.static('public'))

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended : true}))

function pad2(n) { return n < 10 ? '0' + n : n }

Date.prototype.yyyymmdd = function() {
  var mm = this.getMonth() + 1
  var dd = this.getDate()
  
  return [this.getFullYear(),
          (mm>9 ? '' : '0') + mm,
          (dd>9 ? '' : '0') + dd
          ].join('');
}

router.get('/', function(req, res, next) {
  res.render('index', {
       title: "LoRa Server"
  })
})

router.get('/office',(req,res)=>{
  res.render('office', {
    title: "LoRa Server"
  })
})

router.get('/get', (req, res) => {
  let parsedobj = req.query
  
  if(parsedobj.status=='set'){
    sqlquery = 'INSERT INTO `data` (`debug`, `data_num`, `data_temp`,`data_humid` ,`data_dust`, `data_co2`, `data_pres`,`data_batt`,`timeforme`) VALUES (?,?,?,?,?,?,?,?,?)'
    if(Number(parsedobj.num)==NaN||parseFloat(parsedobj.temp)==NaN||parseFloat(parsedobj.humid)==NaN||parseFloat(parsedobj.dust)==NaN||parseFloat(parsedobj.pres)==NaN)
      res.end("err")
    
    else{
      let date = new Date();
      let params = [500,Number(parsedobj.num),parseFloat(parsedobj.temp),parseFloat(parsedobj.humid),parseFloat(parsedobj.dust),0.0,parseFloat(parsedobj.pres),100,date.getFullYear().toString() + pad2(date.getMonth() + 1) + pad2( date.getDate()) + pad2( date.getHours() ) + pad2( date.getMinutes() ) + pad2( date.getSeconds() )];
      setTimeout(()=>{
        connection.query(sqlquery,params, function (error, results, fields) {
          if (error) 
            console.log(error)
          else
            console.log('Success!')
        })
      },1000)
      res.end('ACK')
    }
  }
  else{
    res.writeHead(200,{'Content-Type':'text/html'})
    res.end('Handle')
  } 
})

router.get('/bob',(req,res)=>{
  var date = new Date()

  request.get('https://dev-api.dimigo.in/dimibobs/'+date.yyyymmdd(),{},(errror,response,body)=>{
    res.send(body)
    res.end("")
  })
})

router.get('/complain',(req,res)=>{
  parsedobj = req.query

  if(parsedobj.status == 'teacher'){
    let sqlquery = "SELECT * FROM `request` ORDER BY idx DESC LIMIT 8"
    connection.query(sqlquery, function (error, results, fields) {
      if (error) {
        console.log(error)
      }
      else{
        res.send(results)
        res.end('')
      }
    })
  }

  else{
    let sqlquery = 'INSERT INTO `request` (`cless`, `content`) VALUES (?,?)'
    let param = [parsedobj.cless,parsedobj.content]
    connection.query(sqlquery,param, function (error, results, fields) {
      if (error) {
        console.log(error);
      }
      else{
        res.end('성공적으로 잘 전송되었습니다.')
      }
    })
  }
})


router.get('/graph',(req,res)=>{
  parsedobj = req.query
  let cless = parsedobj.class[0]

  if(cless != "a" && cless != undefined){
    date = new Date().yyyymmdd()
    //let sqlquery = "SELECT * FROM `data` WHERE `data_num`="+cless+" AND `timeforme` LIKE ? ORDER BY idx DESC LIMIT 200"
    let sqlquery = "SELECT * FROM `data` WHERE `data_num`="+cless+" ORDER BY idx DESC LIMIT 50"

    connection.query(sqlquery,String(date) + '%', function (error, results, fields) {
      if (error) {
        console.log(error)
      }
      else{
        res.send(results)
        res.end('')
      }
    })
  }
  else{
    date = new Date().yyyymmdd()
    //let sqlquery = "SELECT * FROM `data` WHERE `timeforme` LIKE ? ORDER BY idx DESC LIMIT 400"
    let sqlquery = "SELECT * FROM `data` ORDER BY idx DESC LIMIT 50"

    connection.query(sqlquery,String(date) + '%', function (error, results, fields) {
      if (error) {
        console.log(error)
      }
      else{
        res.send(results)
        res.end('')
      }
    })
  }
})


module.exports = router