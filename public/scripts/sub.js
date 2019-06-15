
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

function voteClicked(element){
    if(element.dataset.flag=="t"){
        document.getElementById("voteContainer").style="left:13%;"
        document.getElementById("votingContainer").style="left:13%;"
        document.getElementById('vote_container_li').innerHTML = '<button class = "button" onclick="voteClicked(this)" style="color:white;" data-flag="f">'+document.getElementById('current_class').innerText+'반 투표하기</button><'
        
    }
    else{
        document.getElementById("voteContainer").style="left:-30%"
        document.getElementById("votingContainer").style="left:-30%;"
        document.getElementById('vote_container_li').innerHTML = '<button class = "button" onclick="voteClicked(this)" data-flag="t">'+document.getElementById('current_class').innerText+'반 투표하기</button>>'
    }
  }

function ajax_vote(successCallback){
    var xhr = new XMLHttpRequest()
    xhr.open('GET', 'https://api.ipify.org?format=jsonp&callback=getIP', true)
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
    xhr.onreadystatechange = function () {
        if (xhr.readyState != 4 || xhr.status != 200) return
        successCallback(JSON.parse("{"+xhr.responseText.split("{")[1].split('}')[0]+"}").ip)
        
    }
    xhr.send("")
}
function vote_submit(ip){

    let contents = document.getElementById('voteContainer')

    let title = contents.children[0].children[1].value
    let time = contents.children[0].children[2].value
    let name = contents.children[0].children[3].value

    if(title == "" || time == "" || name == ""){
        alert("선택란에 모두 입력해주세요")
        return
    }
    let d =  Number(time) * 60000
    let req = new XMLHttpRequest()
    req.open('GET', '/lora/voteStart?time='+d+'&title='+title+"&name="+name+"&ip="+ip+"&status=start&cless="+document.getElementById('current_class').innerText, true);
        req.onreadystatechange = function (aEvt) {
            if (req.readyState === 4) {
                if(req.status === 200){
                    let message = req.response;
                    console.log(message)
                    alert(message);
                    location.reload();
                }
                else{
                    console.log("Error");
                }
            }
        }
    req.send(null)
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
        }
    req.send(null)
})




ajax_bob()