// function that displays login pop up window when user click connect
function connectAccount(){
    let connectBtn = document.getElementById("mLogin-btn");
    let loginWindow = document.querySelector(".bg-blur"); //parent of the login-box
    
    loginWindow.classList.remove('hide');
}

function hideLogin(){
    if(document.getElementById('verifCodeContainer').classList.contains('hide')){
        let loginWindow = document.querySelector(".bg-blur"); //parent of the login-box
        document.querySelectorAll('.login-input').forEach(i => i.value = '');
        document.getElementById('textbox').innerText= '';
        loginWindow.classList.add("hide");
    }
}

//function that makes font smaller ones text goes beyond an input tag
function changefontsize() { 
    const nickname = document.getElementById('nickname');
    const characters = nickname.value.length;
    if (characters >= 8 && characters < 10) {
        nickname.style.fontSize = '20px';
    } else if (characters >= 10 &&characters< 13) {
        nickname.style.fontSize = '16px';
    }else if(characters >= 11){
        nickname.style.fontSize = '12px';
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
            textbox.innerHTML = (localStorage.getItem("lang") === 'en')?"Nickname length should be between 3-16 characters":"Длина никнейма должна быть от 3 до 16 символов";
            textbox.classList.add("error");
            return false;
        }
    
        // Check if nickname contains only letters, numbers, underscores, or hyphens
        const validPattern = /^[a-zA-Z0-9_-]+$/;
        if (!validPattern.test(nickname)) {
            textbox.innerHTML = (localStorage.getItem('lang')==='en')?"Nicknames should only contain letters, numbers, underscores, or hyphens":"Никнеймы должны содержать только буквы, цифры, подчеркивания или дефисы";

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
                sessionStorage.setItem('username', nickname);
                window.location.href = './personalCabinet.html';
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
            textbox.innerHTML = (localStorage.getItem('lang') === 'en')?"Please enter the 6-digit code we sent to you in Minecraft to continue":
            "Пожалуйста, введите 6-значный код, который мы отправили вам в Minecraft, чтобы продолжить";
            const loginBtn = document.getElementById('login-btn');
            loginBtn.innerText = "Verify";  
            loginBtn.onclick = verifyCode;
        }
        else{
            textbox.innerHTML = (localStorage.getItem('lang') === 'en')?"Player is not online":"Игрок не в сети";
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
