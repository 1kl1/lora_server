
(function() {


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
    let dustConfig = {
        labels: [],
        datasets: [
            {
                label: "fineDust",
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
  let curr_class = document.getElementById('current_class').innerText
  document.getElementsByClassName("button")[curr_class].style="color:white;"
  ajax("/lora/graph?class="+curr_class, "GET",{}, onFetchTempSuccess);
  
  channel = pusher.subscribe('class_'+curr_class)
  
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

