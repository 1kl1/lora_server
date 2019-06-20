


function bobClicked(element){
    if(element.dataset.flag=="t"){
        document.getElementById("bobContainer").style="left:13%;"
        document.getElementById('bob_container_li').innerHTML = '<button class = "button" onclick="bobClicked(this)" data-flag="f">오늘의 급식</button><'
    }
    else{
        document.getElementById("bobContainer").style="left:-30%"
        document.getElementById('bob_container_li').innerHTML = '<button class = "button" onclick="bobClicked(this)" data-flag="t">오늘의 급식</button>>'
    }
}

(   
function(){
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

ajax_bob()

function putTable(index,data){
    if(index == data.length-1){
        
        return
    }
    
    let n = document.getElementById('tableContent');
    let a = document.createElement('tr');
    let b = document.createElement('td');
    let c = document.createElement('td');
    b.setAttribute('class','text-left')
    c.setAttribute('class','text-left')
    b.innerText = data[index].content;
    c.innerText = data[index].cless;

    a.appendChild(b)
    a.appendChild(c)
    n.appendChild(a)
    return putTable(index+1,data)
    
}
function pushTable(cless,contents){

    n = document.getElementById('tableContent');
    n.children[6].remove()
    let a = document.createElement('tr');
    let b = document.createElement('td');
    let c = document.createElement('td');
    b.setAttribute('class','text-left')
    c.setAttribute('class','text-left')
    b.innerText = contents
    c.innerText = cless

    a.appendChild(b)
    a.appendChild(c)

    n.insertBefore(a,n.childNodes[0])
    
}



let channel
let pusher = new Pusher("5cb4216125572be7615d", {
    cluster: "ap3",
    encrypted: true
})
channel = pusher.subscribe('office')

channel.bind('complain', function(data) {
    var complainArray = data.data
    pushTable(complainArray[0],complainArray[1])
})

function complainTable(){
    var req = new XMLHttpRequest();
    req.open('GET', '/lora/complain?status=teacher', true);
    req.onreadystatechange = function (aEvt) {
    if (req.readyState === 4) {
        if(req.status === 200){
        
            let response = JSON.parse("[" + req.response + "]")[0];
            putTable(0,response);

        }
        else{
            console.log("Error loading page\n");
        }
    }
    };
    req.send(null);
}
complainTable()


})()
//IIFY Immediately Invoked Function Expressions 즉시 호출 함수 표현식 global 이 깔끔해짐.




