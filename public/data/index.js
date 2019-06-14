setInterval(()=>{smallGraph()},5000)

    function smallGraph(){
        let req = new XMLHttpRequest();
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
                            break;
                            case 2:
                            temp2.push(element.data_temp)
                            break;
                            case 3:
                            temp3.push(element.data_temp)
                            break;
                            case 4:
                            temp4.push(element.data_temp)
                            break;                               
                        }
                        
                        time.push(Number(element.timeforme.substr(10,4))) 
                    }
                    
                    if(index == array.length-1){
                        
                        flag = 1
                    }
                });
                    
                let temp = setInterval(()=>{
                    if(flag){
                        
                        drawsmallGraph(temp1,temp2,temp3,temp4,time);
                        
                        clearInterval(temp)
                    }
                    
                },100)
            }
            else{
                console.log("Error loading page\n");
            }
        }
        };
        req.send(null);


        
        
    }
    let classDict = {
        "c1":"1반",
        "c2":"2반",
        "c3":"3반",
        "c4":"4반"
    };

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

    document.getElementById('buttonSubmit').addEventListener('click',()=>{

        let b = document.getElementById('selectClass');
    let selectedClass = b[b.selectedIndex].value;
    let contents = document.getElementById('content').value;
    d = new Date();
    datetext = d.toTimeString();
    datetext = datetext.split(' ')[0];
    contents = contents + '      ' +datetext;
    console.log('/complain?cless='+selectedClass+'&content='+contents)
    
        var req = new XMLHttpRequest();
    req.open('GET', '/lora/complain?cless='+selectedClass+'&content='+contents, true);
    req.onreadystatechange = function (aEvt) {
    if (req.readyState === 4) {
        if(req.status === 200){
        
            let message = req.response;
            console.log(message)
            alert(message);
            location.reload();
    
        }
        else{
            console.log("Error loading page\n");
        }
    }
    };
    req.send(null);

    


    })

    
    
    var req = new XMLHttpRequest();
    req.open('GET', '/lora/bob', true);
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
            console.log("Error loading page\n");
        }
    }
    };
    req.send(null);

    drawGraph(document.cookie)
    setInterval(()=>{drawGraph(document.cookie)},5000)

    function graphClick(cless){
        document.getElementById('graphHeader').innerText = "< "+cless+" >"
        document.cookie = cless;
        drawGraph(document.cookie)
    }
    if(document.cookie){
        document.getElementById('graphHeader').innerText = "< "+document.cookie+" >"
    }

    
    function drawGraph(cless){
        console.log(cless)
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
                    if(element.data_temp<=0||element.data_humid<=0){
                    }
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
        };
        req.send(null);


        
        
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