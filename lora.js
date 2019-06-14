const express = require('express');
const path = require('path')
const logger = require('morgan')
const bodyParser = require('body-parser')

const index = require('./routes/index')
const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : true}))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/lora', index)

app.listen(8002,()=>{
  console.log("LoRa APP is running in 8002")
})