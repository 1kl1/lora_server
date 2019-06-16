
(function() {
    document.getElementsByClassName("button")[0].style="color:white;"

    let pusher = new Pusher("5cb4216125572be7615d", {
          cluster: "ap3",
          encrypted: true
        })

    function ajax(url, method, payload, successCallback,n){
      var xhr = new XMLHttpRequest()
      xhr.open(method, url, true)
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
      xhr.onreadystatechange = function () {
        if (xhr.readyState != 4 || xhr.status != 200) return
        successCallback(xhr.responseText,n-1)
      }
      xhr.send(JSON.stringify(payload))
    }

    
    let graphRef

   function renderGraph(temperatureData) {
      var ctx = document.getElementById("dashboardChart").getContext("2d")
      var options = { }
      graphRef = new Chart(ctx, {
        type: "line",
        data: temperatureData,
        options: options
      })
    }

    let temperatureConfig = {
        labels: [],
        datasets: [
            {
              label: "1반",
              fill: false,
              lineTension: 0.1,
              backgroundColor: "#f8766d",
              borderColor: "#f8766d",
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: "#f8766d",
              pointBackgroundColor: "#fff",
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: "#f8766d",
              pointHoverBorderColor: "black",
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: [],
              spanGaps: false,
            },
            {
              label: "2반",
              fill: false,
              lineTension: 0.1,
              backgroundColor: "#7cae00",
              borderColor: "#7cae00",
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: "#7cae00",
              pointBackgroundColor: "#fff",
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: "#7cae00",
              pointHoverBorderColor: "black",
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: [],
              spanGaps: false,
            },
            {
              label: "3반",
              fill: false,
              lineTension: 0.1,
              backgroundColor: "#00bfc4",
              borderColor: "#00bfc4",
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: "#00bfc4",
              pointBackgroundColor: "#fff",
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: "#00bfc4",
              pointHoverBorderColor: "black",
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: [],
              spanGaps: false,
            },
            {
              label: "4반",
              fill: false,
              lineTension: 0.1,
              backgroundColor: "#c77cff",
              borderColor: "#c77cff",
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: "#c77cff",
              pointBackgroundColor: "#fff",
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: "#c77cff",
              pointHoverBorderColor: "black",
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: [],
              spanGaps: false,
            }
        ]
    }

    function onFetchTempSuccess(response,n){
        let respData = JSON.parse(response)
        let tempData = respData.temperature

        temperatureConfig.labels = tempData.dataPoints.map(dataPoint => dataPoint.time);
        temperatureConfig.datasets[n].data = tempData.dataPoints.map(dataPoint => dataPoint.temperature)
        flags[n] = true
    }
    function onFetchTempSuccessAdd(response,n){
      let respData = JSON.parse(response) 
      let tempData = respData.temperature

      temperatureConfig.datasets[n].data = tempData.dataPoints.map(dataPoint => dataPoint.temperature)
      
      flags[n] = true
  }
    
  
    let flags = [false,false,false,false]
    ajax("/lora/graph?class=1", "GET",{}, onFetchTempSuccess,1);
    ajax("/lora/graph?class=2", "GET",{}, onFetchTempSuccessAdd,2);
    ajax("/lora/graph?class=3", "GET",{}, onFetchTempSuccessAdd,3);
    ajax("/lora/graph?class=4", "GET",{}, onFetchTempSuccessAdd,4);
    let checkCallbackFunction = setInterval(()=>{
      
      if(flags[0]&&flags[1]&&flags[2]&&flags[3]){
        document.getElementById('loader').style.display = 'none';
        renderGraph(temperatureConfig)
        clearInterval(checkCallbackFunction)
      }
    },200)
  
  let channels = [0,0,0,0]

  for(i=1;i<5;i++){
    let index = i-1
    channels[index] = pusher.subscribe('class_'+i)
    channels[index].bind('temperature', function(data) {
      var newTempData = data.dataPoint;
      if(graphRef.data.labels.length > 14){
        graphRef.data.labels.shift();
        graphRef.data.datasets[index].data.shift();
      }
      graphRef.data.labels.push(newTempData.time);
      graphRef.data.datasets[index].data.push(newTempData.temperature);
      graphRef.update();
    })
  }

})();

function ajax_bob(){
    let req = new XMLHttpRequest()
    req.open('GET', '/lora/bob', true)
    req.onreadystatechange = function (aEvt) {
    if (req.readyState === 4) {
        if(req.status === 200){
            try{
                let bobObject = JSON.parse(req.response)
                document.getElementById('breakfast').innerText = "아침: "+bobObject.breakfast
                document.getElementById('lunch').innerText = "점심: "+bobObject.lunch
                document.getElementById('dinner').innerText ="저녁: "+ bobObject.dinner
            }
            catch(err){
                document.getElementById('breakfast').innerText = "잠시 후 다시 시도해 주세요."
                document.getElementById('lunch').innerText = "잠시 후 다시 시도해 주세요."
                document.getElementById('dinner').innerText ="잠시 후 다시 시도해 주세요."
            }
        }
        else{
            console.log("Error loading page\n")
        }
    }
    }
    req.send(null)
}

function officeClicked(element){
    if(element.dataset.flag=="t"){
        document.getElementById("chat").style="left:13%;"
        document.getElementById('office_container_li').innerHTML = '<button class = "button" style="color:white;" onclick="officeClicked(this)" data-flag="f">행정실 문의</button><'
    }
    else{
        element.style="color:lightgrey;"
        document.getElementById("chat").style="left:-30%"
        document.getElementById('office_container_li').innerHTML = '<button class = "button" onclick="officeClicked(this)" data-flag="t">행정실 문의</button>>'
    }
}

function bobClicked(element){
    if(element.dataset.flag=="t"){
        document.getElementById("bobContainer").style="left:13%;"
        document.getElementById('bob_container_li').innerHTML = '<button class = "button" onclick="bobClicked(this)" style="color:white;" data-flag="f">오늘의 급식</button><'
    }
    else{
        document.getElementById("bobContainer").style="left:-30%"
        document.getElementById('bob_container_li').innerHTML = '<button class = "button" onclick="bobClicked(this)" data-flag="t">오늘의 급식</button>>'
    }
}




ajax_bob()