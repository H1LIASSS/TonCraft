//function that makes font smaller ones text goes beyond an input tag
function changefontsize() { 
    console.log('test');
    const nickname = document.getElementById('nickname');
    const characters = nickname.value.length;
    if (characters >= 8 && characters < 11) {
        nickname.style.fontSize = '20px';
    } else if (characters >= 11 &&characters< 14) {
        nickname.style.fontSize = '16px';
    }else if(characters >= 14){
        nickname.style.fontSize = '14px';
    } 
    else {
        nickname.style.fontSize = '24px';
    }
}

//verification code sent&check
function loginClick(){
    //<p> element, where errors/messages are written
    const textbox = document.getElementById("textbox");
    textbox.innerHTML = "";
    textbox.classList.remove("error");
    function correctNickname(nickname){
        if (nickname.length < 3 || nickname.length > 16) {
            textbox.innerHTML = "Nickname length should be between 3-16 characters";
            textbox.classList.add("error");
            return false;
        }
    
        // Check if nickname contains only letters, numbers, underscores, or hyphens
        const validPattern = /^[a-zA-Z0-9_-]+$/;
        if (!validPattern.test(nickname)) {
            textbox.innerHTML = "Nicknames should only contain letters, numbers, underscores, or hyphens";

            textbox.classList.add("error");
            return false;
        }
    
        return true;
    }
    // event.preventDefault();

    // function that is used after user provides correct nickname and gets the message in minecraft
    function verifyCode(){
        const nickname = document.getElementById("nickname").value;
        const verificationCode = document.getElementById('verifCode').value;
        console.log(verificationCode);
        fetch('http://localhost:3000/verifyCode',{
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({verificationCode: verificationCode,
            nickname: nickname})
        }).then(response => response.json()).then(data => {
            //if code is verified:
            if(data.success === true){
                window.location.href = '../main.html';
            }
            else{
                textbox.classList.add('error')
            textbox.innerHTML = "Invalid Code";
                
            }
            console.log(`got this ${data.success}, and msg: ${data.message}`)
        }).catch(err => console.log(`code verification error: ${err}`))
    }

    function processResponse(isSuccessful){
        if(isSuccessful){
            //show input tag for verif code, add message saying to write the verifcode.
            const vCode = document.getElementById("verifCodeContainer");
            vCode.classList.remove('hide');
            textbox.innerHTML = "Please enter the 6-digit code we sent to you in Minecraft to continue";
            const loginBtn = document.getElementById('login-btn');
            loginBtn.innerText = "Verify";  
            loginBtn.onclick = verifyCode;
        }
        else{
            textbox.innerHTML = "Player is not online";
            textbox.classList.add("error");
        }
    }

    const nickname = document.getElementById("nickname").value;
    if(correctNickname(nickname)){
    fetch('http://localhost:3000/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({nickname: nickname})
    })
    .then(response => response.json())
    .then(data=> {
        console.log(data.success);
        processResponse(data.success);
    }).catch(err => console.log(`fetch error ${err}`));
    }
}

// //function that makes font smaller ones text goes beyond an input tag
// function changefontsize(){
//     console.log('called');
//     var nicknameInput = document.getElementById('nickname');
// if(isOverflown(nicknameInput)) {
//     while (isOverflown(nicknameInput)){
//     currentfontsize--;
//     myInput.style.fontSize = currentfontsize + 'px';
//     }
// }else {
//     currentfontsize = 13;
//     myInput.style.fontSize = currentfontsize + 'px';
//     while (isOverflown(myInput)){
//     currentfontsize--;
//     myInput.style.fontSize = currentfontsize + 'px';
//     }
// }	
// }

// function isOverflown(element) {
//     return element.scrollWidth > element.clientWidth;
// }
