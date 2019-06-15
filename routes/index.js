var express = require('express')
var router = express.Router()
var Pusher = require('pusher');
const bodyParser = require('body-parser')
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

let pusher = new Pusher({
  appId: "803329",
  key: "5cb4216125572be7615d",
  secret: "a6c1dd01dbcc4b67dae9",
  cluster: "ap3",
  encrypted: true
});

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
  parsedobj = req.query
  let cless = parsedobj.class

  if(cless == undefined){
    res.render('index', {
      title: "LoRa Server"
    })
  }else{
    res.render('class_index', {
      title: "LoRa Server",
      cless: cless
    })
  }
  
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
    
    if(parsedobj.humid === undefined || parsedobj.temp === undefined || parsedobj.num === undefined || parsedobj.dust === undefined || parsedobj.pres === undefined){
      res.end('err')
    }
    else{
      let date = new Date();
      let yyyymmddhhmmss = date.yyyymmdd()+ pad2( date.getHours() ) + pad2( date.getMinutes() ) + pad2( date.getSeconds() )
      let params = [500,Number(parsedobj.num),parseFloat(parsedobj.temp),parseFloat(parsedobj.humid),parseFloat(parsedobj.dust),0.0,parseFloat(parsedobj.pres),100,yyyymmddhhmmss];
      
        connection.query(sqlquery,params, function (error, results, fields) {
          if (error) 
            console.log(error)
          else{
            res.end('ACK')
            pusher.trigger('class_'+parsedobj.num, 'temperature', {
              dataPoint: {
                temperature: parseFloat(parsedobj.temp),
                time: yyyymmddhhmmss.substr(10,4)
              }
            })
            pusher.trigger('class_'+parsedobj.num, 'humidity', {
              dataPoint: {
                temperature: parseFloat(parsedobj.humid),
                time: yyyymmddhhmmss.substr(10,4)
              }
            })
            pusher.trigger('class_'+parsedobj.num, 'press', {
              dataPoint: {
                temperature: parseFloat(parsedobj.pres),
                time: yyyymmddhhmmss.substr(10,4)
              }
            })
            pusher.trigger('class_'+parsedobj.num, 'dust', {
              dataPoint: {
                temperature: parseFloat(parsedobj.dust),
                time: yyyymmddhhmmss.substr(10,4)
              }
            })
          }
        })
        }
  }
  else{
    res.writeHead(200,{'Content-Type':'text/html'})
    res.end('Handle')
  }
})

router.get('/graph',(req,res)=>{
  parsedobj = req.query
  let cless = parsedobj.class

  if(cless != undefined){
    //let sqlquery = "SELECT * FROM `data` WHERE `data_num`="+cless+" AND `timeforme` LIKE ? ORDER BY idx DESC LIMIT 200"
    let sqlquery = "SELECT * FROM `data` WHERE `data_num`="+cless+" ORDER BY idx DESC LIMIT 15"

    connection.query(sqlquery, function (error, results, fields) {
      if (error) {
        console.log(error)
      }
      else{
        let finalJson = {
          temperature:{
            class:cless,
            unit:'celsius',
            dataPoints:[]
          },
          humid:{
            class:cless,
            unit:'percent',
            dataPoints:[]
          },
          press:{
            class:cless,
            unit:'hex',
            dataPoints:[]
          },
          dust:{
            class:cless,
            unit:'pm',
            dataPoints:[]
          }
        }
        results.forEach(element => {
          finalJson.temperature.dataPoints.push({time:element.timeforme.substr(10,4),temperature:element.data_temp})
          finalJson.humid.dataPoints.push({time:element.timeforme.substr(10,4),humid:element.data_humid})
          finalJson.press.dataPoints.push({time:element.timeforme.substr(10,4),press:element.data_pres})
          finalJson.dust.dataPoints.push({time:element.timeforme.substr(10,4),dust:element.data_dust})
        })
        finalJson.temperature.dataPoints.reverse()
        finalJson.humid.dataPoints.reverse()
        finalJson.press.dataPoints.reverse()
        finalJson.dust.dataPoints.reverse()
        res.send(finalJson)
        
      }
    })
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





module.exports = router