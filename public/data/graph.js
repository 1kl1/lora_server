
(function() {

    Pusher.logToConsole = true

    let pusher = new Pusher("5cb4216125572be7615d", {
          cluster: "ap3",
          encrypted: true
        })

    function ajax(url, method, payload, successCallback){
      var xhr = new XMLHttpRequest()
      xhr.open(method, url, true)
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
      xhr.onreadystatechange = function () {
        if (xhr.readyState != 4 || xhr.status != 200) return
        successCallback(xhr.responseText)
      }
      xhr.send(JSON.stringify(payload))
    }

    let channel
    let temperatureGraphRef
    let humidityGraphRef
    let pressGraphRef
    let dustGraphRef

   function renderTemperatureGraph(temperatureData) {
      var ctx = document.getElementById("temperatureChart").getContext("2d")
      var options = { }
      temperatureGraphRef = new Chart(ctx, {
        type: "line",
        data: temperatureData,
        options: options
      })
    }
    function renderHumidGraph(humidData) {
      var ctx = document.getElementById("humidityChart").getContext("2d")
      var options = { }
      humidityGraphRef = new Chart(ctx, {
        type: "line",
        data: humidData,
        options: options
      })
    }
    function renderPressGraph(pressData) {
      var ctx = document.getElementById("pressChart").getContext("2d")
      var options = { }
      pressGraphRef = new Chart(ctx, {
        type: "line",
        data: pressData,
        options: options
      })
    }
    function renderDustGraph(dustData) {
      var ctx = document.getElementById("dustChart").getContext("2d")
      var options = { }
      dustGraphRef = new Chart(ctx, {
        type: "line",
        data: dustData,
        options: options
      })
    }

    let temperatureConfig = {
        labels: [],
        datasets: [
            {
                label: "temperature",
                fill: false,
                lineTension: 0.1,
                backgroundColor: "#F69A9A",
                borderColor: "#F69A9A",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "#F69A9A",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "#EF4566",
                pointHoverBorderColor: "black",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: [],
                spanGaps: false,
            }
        ]
    }
    let humidConfig = {
        labels: [],
        datasets: [
            {
                label: "humidity",
                fill: false,
                lineTension: 0.1,
                backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "rgba(75,192,192,1)",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: [],
                spanGaps: false,
            }
        ]
    }
    let pressConfig = {
        labels: [],
        datasets: [
            {
                label: "pressure",
                fill: false,
                lineTension: 0.1,
                backgroundColor: "#355C7D",
                borderColor: "#355C7D",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "#355C7D",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "#6C5B7B",
                pointHoverBorderColor: "black",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: [],
                spanGaps: false,
            }
        ]
    }
    let dustConfig = {
        labels: [],
        datasets: [
            {
                label: "fineDust",
                fill: false,
                lineTension: 0.1,
                backgroundColor: "#474747",
                borderColor: "#474747",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "#474747",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "#363636",
                pointHoverBorderColor: "#ABA7A8",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: [],
                spanGaps: false,
            }
        ]
    }

  

  function onFetchTempSuccess(response){
    let respData = JSON.parse(response)
    let tempData = respData.temperature
    let humidData = respData.humid
    let pressData = respData.press
    let dustData = respData.dust

    temperatureConfig.labels = tempData.dataPoints.map(dataPoint => dataPoint.time);
    temperatureConfig.datasets[0].data = tempData.dataPoints.map(dataPoint => dataPoint.temperature)

    humidConfig.labels = humidData.dataPoints.map(dataPoint => dataPoint.time);
    humidConfig.datasets[0].data = humidData.dataPoints.map(dataPoint => dataPoint.humid)

    pressConfig.labels = pressData.dataPoints.map(dataPoint => dataPoint.time);
    pressConfig.datasets[0].data = pressData.dataPoints.map(dataPoint => dataPoint.press)

    dustConfig.labels = dustData.dataPoints.map(dataPoint => dataPoint.time);
    dustConfig.datasets[0].data = dustData.dataPoints.map(dataPoint => dataPoint.dust)

    renderTemperatureGraph(temperatureConfig)
    renderHumidGraph(humidConfig)
    renderPressGraph(pressConfig)
    renderDustGraph(dustConfig)
  }

  ajax("/lora/graph?class=1", "GET",{}, onFetchTempSuccess);
  channel = pusher.subscribe('class_1')
  
  channel.bind('temperature', function(data) {
    var newTempData = data.dataPoint;
    if(temperatureGraphRef.data.labels.length > 15){
      temperatureGraphRef.data.labels.shift();  
      temperatureGraphRef.data.datasets[0].data.shift();
    }
    temperatureGraphRef.data.labels.push(newTempData.time);
    temperatureGraphRef.data.datasets[0].data.push(newTempData.temperature);
    temperatureGraphRef.update();
  });
  channel.bind('humidity', function(data) {
    var newTempData = data.dataPoint;
    if(humidityGraphRef.data.labels.length > 15){
      humidityGraphRef.data.labels.shift();  
      humidityGraphRef.data.datasets[0].data.shift();
    }
    humidityGraphRef.data.labels.push(newTempData.time);
    humidityGraphRef.data.datasets[0].data.push(newTempData.temperature);
    humidityGraphRef.update();
  });
  channel.bind('press', function(data) {
    var newTempData = data.dataPoint;
    if(pressGraphRef.data.labels.length > 15){
      pressGraphRef.data.labels.shift();  
      pressGraphRef.data.datasets[0].data.shift();
    }
    pressGraphRef.data.labels.push(newTempData.time);
    pressGraphRef.data.datasets[0].data.push(newTempData.temperature);
    pressGraphRef.update();
  });
  channel.bind('dust', function(data) {
    var newTempData = data.dataPoint;
    if(dustGraphRef.data.labels.length > 15){
      dustGraphRef.data.labels.shift();  
      dustGraphRef.data.datasets[0].data.shift();
    }
    dustGraphRef.data.labels.push(newTempData.time);
    dustGraphRef.data.datasets[0].data.push(newTempData.temperature);
    dustGraphRef.update();
  });


/* TEMP CODE FOR TESTING */
//   var dummyTime = 1500;
//   setInterval(function(){
//     dummyTime = dummyTime + 10;
//     ajax("/addTemperature?temperature="+ getRandomInt(10,20) +"&time="+dummyTime,"GET",{},() => {});
//   }, 1000);

//   function getRandomInt(min, max) {
//       return Math.floor(Math.random() * (max - min + 1)) + min;
//   }
/* TEMP CODE ENDS */


})();


function emphasize_graph(element){
    switch (element.dataset.flag) {
        case "1":
            arr = document.getElementsByClassName('card')
            for(i=0;i<arr.length;i++){
                arr[i].style="opacity:1; width:40%"
            }
            element.style="width:40%; z-index:0;"
            element.dataset.flag="0"
            break
        case "0":
            arr = document.getElementsByClassName('card')
            for(i=0;i<arr.length;i++){
                arr[i].style="opacity:0; width:1%"
            }
            element.style="width:80%; opacity:1;"
            element.dataset.flag="1"
            break
    }
}














let classDict = {
    "c1":"1반",
    "c2":"2반",
    "c3":"3반",
    "c4":"4반"
}


function smallGraph(){
    let req = new XMLHttpRequest()
    req.open('GET', '/lora/graph?class=a', true);
    req.onreadystatechange = function (aEvt) {
    if (req.readyState === 4) {
        if(req.status === 200){
            let temp1 = [];
            let temp2 = [];
            let temp3 = [];
            let temp4 = [];

            let time = [];
            let flag = 0;
            let array = JSON.parse("[" + req.response + "]")[0];
            
            array.forEach((element,index) => {            
                if(element.data_temp<=0||element.data_humid<=0){
                }
                else{
                    switch(element.data_num){
                        case 1:
                        temp1.push(element.data_temp)
                        break
                        case 2:
                        temp2.push(element.data_temp)
                        break
                        case 3:
                        temp3.push(element.data_temp)
                        break
                        case 4:
                        temp4.push(element.data_temp)
                        break                               
                    }
                    
                    time.push(Number(element.timeforme.substr(10,4))) 
                }
                
                if(index == array.length-1){
                    
                    flag = 1
                }
            })
            
        let temp = setInterval(()=>{
            if(flag){
                drawsmallGraph(temp1,temp2,temp3,temp4,time);
                clearInterval(temp)
            }
        },100)
        }
        else{
            console.log("Error loading page\n");
        }}}
    req.send(null)
}
function drawsmallGraph(temp1,temp2,temp3,temp4,time){
    temporaryGraph(temp1,time,"c1")
    temporaryGraph(temp2,time,"c2")
    temporaryGraph(temp3,time,"c3")
    temporaryGraph(temp4,time,"c4")
}

function temporaryGraph(d,t,str){
    
    let trace = {
        x: t,
        y: d,
        mode: 'area'
    };
    let data = [ trace ];
    let layout = {
        title:classDict[str],
        xaxis:{
            zeroline: false
        },
        yaxis: {
            zeroline: false
        }
    };
    Plotly.newPlot(str, data, layout);
}



function drawGraph(cless){
    let req = new XMLHttpRequest();
    req.open('GET', '/lora/graph?class='+cless, true);
    req.onreadystatechange = function (aEvt) {
    if (req.readyState === 4) {
        if(req.status === 200){
            let dustD = [];
            let tempD = [];
            let humidD = [];
            let time = [];
            let presD = [];
            
            let flag = 0;
            let array = JSON.parse("[" + req.response + "]")[0];
            
            array.forEach((element,index) => {            
                if(element.data_temp<=0||element.data_humid<=0){}
                else{
                    dustD.push(element.data_dust)
                    tempD.push(element.data_temp)
                    humidD.push(element.data_humid)
                    presD.push(element.data_pres)
                    time.push(Number(element.timeforme.substr(10,4))) 
                }
                if(index == array.length-1){
                    flag = 1
                }
            });
             
            let temp = setInterval(()=>{
                if(flag){
                        dustGraph(dustD,time);
                        tempGraph(tempD,time);
                        humidGraph(humidD,time);
                        presGraph(presD,time);
                        clearInterval(temp)
                    }
                },100)
                }
                else{  
                    console.log("Error loading page\n");
                }
            }
    }
    req.send(null);
}



function graphClick(cless){
    if(cless=="대시보드"){
        
    }
    else{
        document.getElementById('graphHeader').innerText = "< "+cless+" >"
        document.cookie = cless;
        drawGraph(document.cookie)
    }
}

if(document.cookie){
    document.getElementById('graphHeader').innerText = "< "+document.cookie+" >"
}

    
function dustGraph(dust_data,time){

    let trace = {
        x: time,
        y: dust_data,
        mode: 'area'
    };
    let data = [ trace ];
    let layout = {
        title:'먼지'
    };
    
    Plotly.newPlot('dust', data, layout);

}
function tempGraph(temp_data,time){

    let trace = {
        x: time,
        y: temp_data,
        mode: 'area'
    };
    let data = [ trace ];
    let layout = {
        title:'온도',
        xaxis:{
            zeroline: false
        },
        yaxis: {
            zeroline: false
        }
    };
    Plotly.newPlot('temp', data, layout);
}
function humidGraph(humid_data,time){

    let trace = {
        x: time,
        y: humid_data,
        mode: 'area'
    };
    let data = [ trace ];
    let layout = {
        title:'습도'
    };
    Plotly.newPlot('hmd', data, layout);

}

function presGraph(pres_data,time){

    let trace = {
        x: time,
        y: pres_data,
        mode: 'area'
    };
    let data = [ trace ];
    let layout = {
        title:'기압'
    };
    
    Plotly.newPlot('pres', data, layout);

}