import "@/static/css/register.scss"
import { register,VerifyNumber1 } from "../../api/register";
import { isStringNull } from "../../utils/validate"
// import {toastr} from './common/toastr.js'
import '@/static/css/common/toastr.scss'
import toastr from '@/static/js/common/toastr.js'

var i
var flag=false
var toConfirm=false
var username=document.getElementById("username")
var pickname=document.getElementById("nickname")
//var email=document.getElementById("email")
var phoneNumber=document.getElementById("phoneNumber")
var password=document.getElementById("password")
var verifyPw=document.getElementById("verifyPw")
var verifyNumber=document.getElementById("verifyNumber")
var rg=document.getElementById("register")
var allInput=document.getElementsByTagName("input")
var select=document.getElementById("select")

rg.onclick=register1

document.onkeydown = function (event) {
    var e = event || window.event || arguments.callee.caller.arguments[0];
    if (e && e.keyCode == 13) {
       register1()
    }
};

function register1(){
  
        var body={"userName":username.value,"nick":pickname.value,"school":select.value,"password":password.value,"confirm":verifyPw.value,"phone":phoneNumber.value,"code":verifyNumber.value}
        console.log("body",body)
        if(isStringNull(username)&&isStringNull(pickname)&&isStringNull(password)&&isStringNull(verifyPw)&&isStringNull(phoneNumber)&&isStringNull(verifyNumber))
        { 
            if(username.value.length>=3&&username.value.length<=16&&username.value.search(/\s/)==-1&&password.value.length>=3&&password.value.length<=16&&password.value==verifyPw.value)
           {
                register(body).then(rep=>{
                console.log(rep)
                if(rep.code==2000)
                {
                    toastr.success('注册成功','通知')
                    var times=setTimeout(function(){
                        window.location="index.html"
                    },1000)
                }
            })
         }
         else{
             console.log("重新输入")
         }
        }
        else{
            console.log('11111')
         IsNull()
        }
}

var Username = username.oninput=function(){
    i='1'
    if(username.value.length>=3&&username.value.length<=16&&username.value.search(/\s/)==-1){ 
        flag=true 
    }
    else{
        flag=false
    }
    change()
}
var Password = password.oninput=function(){
    i='3'
    if(password.value.length>=3&&password.value.length<=16)
    {  
        flag=true
    }
       
    change()
}
var VerifyPw = verifyPw.oninput=function(){
    i='4'
    if(password.value==verifyPw.value&&password.value.length>=3&&password.value.length<=16)
    {
        flag=true    
    }
    change()
}

var Nickname = nickname.oninput=function(){
    i='2'
  if(nickname.value!=""&&nickname.value!=null&&nickname.value!=undefined)
  {
    flag=true 
  }  
    change()
}
var PhoneNumber = phoneNumber.oninput=function(){
    i='5'
    var a=/^1[3|4|5|8][0-9]\d{8}$/
    flag=a.test(phoneNumber.value)
    //console.log( "[a]",a.test(phoneNumber.value))
  if(flag){
      toConfirm=true
      document.getElementById("clock").style.setProperty('pointer-events','auto')
      document.getElementById("clock").style.setProperty('color','black')
    } 
  else{
      toConfirm=false
      document.getElementById("clock").style.setProperty('pointer-events','none')
      document.getElementById("clock").style.setProperty('color','#63697949')
    }

    change()
}

var VerifyNumber = verifyNumber.oninput=function(){
    i='6'
    if(verifyNumber.value!=null&&verifyNumber.value!=""&&verifyNumber.value!=undefined){
        document.getElementById("no"+i).style.setProperty('display','none')
        document.getElementById("yes"+i).style.setProperty('display','none')
        document.getElementById("tip_"+i).style.setProperty('display','none')
    }

}

function change(){
  if(flag==true)
  { 
      document.getElementById("yes"+i).style.setProperty('display','inline')
      document.getElementById("no"+i).style.setProperty('display','none')
      document.getElementById("tip_"+i).style.setProperty('display','none')
}
   else
  { 
      document.getElementById("no"+i).style.setProperty('display','inline')
      document.getElementById("yes"+i).style.setProperty('display','none')
      document.getElementById("tip_"+i).style.setProperty('display','block')
}
     flag=false
} 

function IsNull(){   //判断输入框是否为空
    for(let j=0;j<allInput.length;j++)
    {
        if(!isStringNull(allInput[j]))
      {
        i=(j+1).toString()
        document.getElementById("no"+i).style.setProperty('display','inline')
        document.getElementById("yes"+i).style.setProperty('display','none')
        document.getElementById("tip_"+i).style.setProperty('display','block')
      }  
    }
}

document.getElementById("clock").onclick=function(){
    console.log("111")
    var body={"phone":phoneNumber.value}
   VerifyNumber1(body).then(rep=>{
      console.log(rep)
   })
    var time=5
    var value
       var times=setInterval(function(){
    if(time!=0)
     { 
        value='重新发送'+time+'s'
        document.getElementById("clock").innerHTML=value
        document.getElementById("clock").style.setProperty('pointer-events','none')
        document.getElementById("clock").style.setProperty('color','#63697949')
        time--
    }
    else{
        document.getElementById("clock").innerHTML='获取验证码'
        document.getElementById("clock").style.setProperty('pointer-events','auto')
        document.getElementById("clock").style.setProperty('color','black')
        clearInterval(times)
    }
    },1000)

}












