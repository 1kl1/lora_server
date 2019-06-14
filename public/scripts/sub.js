
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




// document.getElementById('buttonSubmit').addEventListener('click',()=>{
//     let b = document.getElementById('selectClass');
//     let selectedClass = b[b.selectedIndex].value;
//     let contents = document.getElementById('content').value;
//     d = new Date();
//     datetext = d.toTimeString();
//     datetext = datetext.split(' ')[0];
//     contents = contents + '      ' +datetext;
//     console.log('/complain?cless='+selectedClass+'&content='+contents)

//     var req = new XMLHttpRequest();

//     req.open('GET', '/lora/complain?cless='+selectedClass+'&content='+contents, true);
//         req.onreadystatechange = function (aEvt) {
//             if (req.readyState === 4) {
//                 if(req.status === 200){
        
//                     let message = req.response;
//                     console.log(message)
//                     alert(message);
//                     location.reload();

//                 }
//                 else{
//                     console.log("Error loading page\n");
//                 }
//             }
//         }
//     req.send(null)
// })

// ajax_bob()