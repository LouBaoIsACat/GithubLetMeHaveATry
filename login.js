import '@/static/css/login.scss'
import { Login } from "@/api/index.js"
import '@/static/css/common/toastr.scss'
import toastr from '@/static/js/common/toastr.js'
import {wsSessionStore} from '@/utils/storage.js'
import { isStringNull } from "../../utils/validate"

let userName=document.getElementById('user-name');
let password=document.getElementById('user-password');
let login=document.getElementById('login-btn');

function checkUsername(a){
    if(!isStringNull(a)||/\s/.test(a.value)){
        document.getElementById('empty-name').style.display="block";
        document.getElementById('user-name').style.borderColor="red";
        return false;
    }
    else return true;
}
function checkPassword(a){
    if(!isStringNull(a)||/\s/.test(a.value)){
        document.getElementById('empty-pw').style.display="block";
        document.getElementById('user-password').style.borderColor="red";
        return false;
    }
    else return true;
}

function recover(){
    document.getElementById('empty-name').style.display="none";
    document.getElementById('user-name').style.borderColor="#dbdbdb";
    document.getElementById('empty-pw').style.display="none";
    document.getElementById('user-password').style.borderColor="#dbdbdb";
}
userName.onfocus=function(){
    // if(checkPassword(password))recover();
    recover();
}
password.onfocus=function(){
    
    if(checkUsername(userName))recover();
}
userName.oninput=userName.onblur=function(){
    checkUsername(userName);
}
password.oninput=password.onblur=function(){
    checkPassword(password);
}
let flag=false;
window.callback = function(res){
    if(res.ret == 0){
        //通过
        console.log(res);
        flag=true;
    }
}
function checkFlag(a){
    if(a==false) {
        document.getElementById('verify').style.display="block";
        setTimeout(() => {
            document.getElementById('verify').style.display="none";
        }, 1500);
        return false;
    }
    return true;
}
login.addEventListener('click',function(){
    // document.getElementById('TencentCaptcha').click();
    if(checkUsername(userName)&&checkPassword(password)&&checkFlag(flag)){
        var body={"UserName":userName.value,"Password":password.value};
        // console.log(body);
        Login(body).then((rep)=>{
            if(rep.code==2000){
                console.log(rep);
                wsSessionStore.set("token",rep.data.token);
                wsSessionStore.set("userinfo",rep.data.nick);
                toastr.success("登录成功！",userName.value);
                setTimeout(() => {
                    window.location="index.html";
                }, 1000); 
            }
           else{
                toastr.error(rep.msg);
            }
        })
    }
})


document.getElementById("logo").onclick=function(){
    window.location="index.html"
}
   
document.onkeydown = function (event) {
    var e = event || window.event || arguments.callee.caller.arguments[0];
    if (e && e.keyCode == 13) {
       login.click();
    }
};