let encryptionKey = "My secret key";
let secret_username = "LTI";
let secret_password = "123";
const cipher = salt => {
    const textToChars = text => text.split('').map(c => c.charCodeAt(0));
    const byteHex = n => ("0" + Number(n).toString(16)).substr(-2);
    const applySaltToChar = code => textToChars(salt).reduce((a,b) => a ^ b, code);

    return text => text.split('')
        .map(textToChars)
        .map(applySaltToChar)
        .map(byteHex)
        .join('');
}

const decipher = salt => {
    const textToChars = text => text.split('').map(c => c.charCodeAt(0));
    const applySaltToChar = code => textToChars(salt).reduce((a,b) => a ^ b, code);
    return encoded => encoded.match(/.{1,2}/g)
        .map(hex => parseInt(hex, 16))
        .map(applySaltToChar)
        .map(charCode => String.fromCharCode(charCode))
        .join('');
}
function validate() {
    uname= document.getElementById("username").value;
    password = document.getElementById("password").value;
    if(uname === "" || password === "") {
        alert("Please enter a username and password");

    }
    else if(uname === secret_username && password === secret_password){
      if(document.getElementById("rememberMe").checked) {
        const myCipher = cipher(encryptionKey);
        encryptedUserName = myCipher(uname);
        encryptedPassword = myCipher(password);

        setCookie("username", encryptedUserName, 1);
        setCookie("password", encryptedPassword, 1);
        window.location.href = "welcome.html";
        
      }
      else{
        window.location.href = "welcome.html?username=" + uname;
      }
      
    }
    else{
        document.getElementById("errorMessage").innerHTML = "Invalid Username/Password. Try again!";
    }

}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    console.log(cname + "cookie is set");
  }
  
  function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  
  
  function checkCookie() {
      console.log("called");
    var encryptedUsername = getCookie("username");
    var encryptedPassword = getCookie("password");
    if (encryptedUsername != "" && encryptedPassword != "") {
        console.log("cookies set");
        const myDecipher = decipher(encryptionKey);

      var decryptedUserName = myDecipher(encryptedUsername);
      var decryptedPassword = myDecipher(encryptedPassword);
      console.log(decryptedUserName);
      console.log(decryptedPassword);
      if(decryptedUserName == secret_username && decryptedPassword == secret_password){
        window.location.href = "welcome.html";
      }

    } 
    else{
        console.log("cookies not set");
    }
}
function loadUser(){
  var encryptedUsername = getCookie("username");
  if (encryptedUsername != "" ){
    const myDecipher = decipher(encryptionKey);

    var decryptedUserName = myDecipher(encryptedUsername);
    document.getElementById("welcome").innerHTML = "Welcome " + decryptedUserName;
  }
  else{
    var loggedInUsername = (document.location.href.split("?")[1].split("=")[1]);
    document.getElementById("welcome").innerHTML = "Welcome " + loggedInUsername;
    
  }
}

function logout() {
  document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
  console.log(document.cookie);
  window.location.href="index.html";
}
