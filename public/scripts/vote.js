(function(){
    let channel
    let pusher = new Pusher("5cb4216125572be7615d", {
        cluster: "ap3",
        encrypted: true
    })
    channel = pusher.subscribe('office')

    channel.bind('voteResult', function(data) {
        var resultArray = data.data
        pushTable_vote(resultArray[0],resultArray[1],resultArray[2],resultArray[3],resultArray[4])
    })
    

    function pushTable_vote(title,cless,people,result,time){
        let n = document.getElementById('voteResult')
        n.children[2].remove()
        let a = document.createElement('tr')
        let b = document.createElement('td')
        let c = document.createElement('td')
        let d = document.createElement('td')
        let e = document.createElement('td')
        let f = document.createElement('td')
        b.setAttribute('class','thSmall')
        c.setAttribute('class','thBig')
        d.setAttribute('class','thSmall')
        e.setAttribute('class','thSmall')
        f.setAttribute('class','thBig')
        b.innerText = cless
        c.innerText = title
        d.innerText = result
        e.innerText = people
        f.innerText = time
    
        a.appendChild(b)
        a.appendChild(c)
        a.appendChild(d)
        a.appendChild(e)
        a.appendChild(f)
    
        n.insertBefore(a,n.childNodes[0])
    }
    
    function put_vote_Table(index,data){
        if(index == data.length){
            return
        }
        let n = document.getElementById('voteResult')
        let a = document.createElement('tr');
        let b = document.createElement('td');
        let c = document.createElement('td');
        let d = document.createElement('td');
        let e = document.createElement('td');
        let f = document.createElement('td')
        b.setAttribute('class','thSmall')
        c.setAttribute('class','thBig')
        d.setAttribute('class','thSmall')
        e.setAttribute('class','thSmall')
        f.setAttribute('class','thBig')
        b.innerText = data[index].cless
        c.innerText = data[index].contents
        d.innerText = data[index].result
        e.innerText = data[index].people+"명"
        f.innerText = data[index].time
    
        a.appendChild(b)
        a.appendChild(c)
        a.appendChild(d)
        a.appendChild(e)
        a.appendChild(f)
        n.appendChild(a)
        
        return put_vote_Table(index+1,data)
    }


    
function voteTable(){
    var req = new XMLHttpRequest();
    req.open('GET', '/lora/voteResult', true);
    req.onreadystatechange = function (aEvt) {
    if (req.readyState === 4) {
        if(req.status === 200){
        
            let response = JSON.parse("[" + req.response + "]")[0]
            put_vote_Table(0,response)

        }
        else{
            console.log("Error loading page\n");
        }
    }
    }
    req.send(null)
}
voteTable()
})()