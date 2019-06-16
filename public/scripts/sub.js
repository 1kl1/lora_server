let curr_class = document.getElementById('current_class').innerText
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

    ajax("/lora/voteCheck?cless="+curr_class,"GET",{},(data)=>{
        data = JSON.parse(data)
        if(data.flag==1){
            let targetNode = document.getElementById("votingContainer")
            document.getElementById("voteContainer").classList.add("displayNone")
            targetNode.classList.add("displayInlineBlock")

            childNode = targetNode.children[0]
            childNode.children[1].innerText = "투표 안건: "+data.title
            childNode.children[2].innerText = "발의자: "+data.name
            childNode.children[3].innerText = "종료시간: "+data.time
            childNode.children[4].innerText = "찬성: "+data.agree
            childNode.children[5].innerText = "반대: "+data.disagree
        }
        else{
          document.getElementById("voteContainer").classList.add("displayInlineBlock")
          document.getElementById("votingContainer").classList.add("displayNone")
        }

      })
    if(element.dataset.flag=="t"){
        document.getElementById("voteContainer").style="left:13%;"
        document.getElementById("votingContainer").style="left:13%;"
        document.getElementById('vote_container_li').innerHTML = '<button class = "button" onclick="voteClicked(this)" style="color:white;" data-flag="f">'+curr_class+'반 투표하기</button><'
        
    }
    else{
        document.getElementById("voteContainer").style="left:-30%"
        document.getElementById("votingContainer").style="left:-30%;"
        document.getElementById('vote_container_li').innerHTML = '<button class = "button" onclick="voteClicked(this)" data-flag="t">'+curr_class+'반 투표하기</button>>'
    }
  }

function ajax_vote(successCallback){

    var RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection || window.msRTCPeerConnection;
    var rtc = new RTCPeerConnection();
    rtc.createDataChannel("TEMP");
    rtc.onicecandidate = function(iceevent) {
    if( iceevent && iceevent.candidate && iceevent.candidate.candidate ) {
        var r = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;
        var t = iceevent.candidate.candidate.match(r);
            successCallback(t[0]); //IP
    }
    }

    rtc.createOffer().then(offer=>rtc.setLocalDescription(offer));
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
    let d_ = new Date(new Date().getTime()+d).toString().split(" ")[4]
    let req = new XMLHttpRequest()
    req.open('GET', '/lora/voteStart?time='+d+'&title='+title+"&name="+name+"&ip="+ip+"&status=start&cless="+curr_class+"&endtime="+d_, true)
        req.onreadystatechange = function (aEvt) {
            if (req.readyState === 4) {
                if(req.status === 200){
                    let message = req.response;
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

function voting(result){
    ajax_vote((ip)=>{
        ajax("/lora/voteProgress?ip="+ip+"&cless="+curr_class+"&result="+result,"GET",{},(data)=>{
            alert(data)
            location.reload()
            })
        }
    )
}


document.getElementById('buttonSubmit').addEventListener('click',()=>{
    let b = document.getElementById('selectClass');
    let selectedClass = b[b.selectedIndex].value;
    let contents = document.getElementById('content').value;
    d = new Date();
    datetext = d.toTimeString();
    datetext = datetext.split(' ')[0];
    contents = contents + '      ' +datetext;

    var req = new XMLHttpRequest();

    req.open('GET', '/lora/complain?cless='+selectedClass+'&content='+contents, true);
        req.onreadystatechange = function (aEvt) {
            if (req.readyState === 4) {
                if(req.status === 200){
        
                    let message = req.response;
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