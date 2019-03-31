import "@/static/css/verifyPw.scss"
import { toModifyPw, sendPhone, modifyPw } from "../../api/verifyPw";
import { isStringNull } from "../../utils/validate";
import '@/static/css/common/toastr.scss'
import toastr from '@/static/js/common/toastr.js'

var flag=false
var username=document.getElementById("username")
var verify=document.getElementById("verify")
var success=document.getElementById("success")
var modify=document.getElementById("modify")
var phoneNumber=document.getElementById("phoneNumber")
var verifyNumber=document.getElementById("verifyNumber")
var password=document.getElementById("password")
var verifyPw=document.getElementById("verifyPw")

var bt_affirm=document.getElementById("bt_affirm").onclick=function(){            //确认按钮
    var body={"userName":username.value,"phone":phoneNumber.value,"code":verifyNumber.value}
    if(flag&&isStringNull(username)&&isStringNull(phoneNumber)&&isStringNull(verifyNumber))
    {
        sendPhone(body).then(rep=>{
        console.log(rep)
       if(rep.code==2000)
       {
        verify.style.setProperty('display','none')
        modify.style.setProperty('display','block')
       }       
     })
    
     }
     else{
        console.log('err:用户名或验证码有误')
}
}

var bt_modify=document.getElementById("bt_modify").onclick=function(){      //修改密码按钮
   if(isStringNull(password)&&isStringNull(verifyPw)&&password.value.length>=3&&password.value.length<=16)
   {var body={"password":password.value,"confirm":verifyPw.value}
    modifyPw(body).then(rep=>{
        console.log(rep)
        if(rep.code==2000)
        {
            modify.style.setProperty('display','none')
            success.style.setProperty('display','block')
        }
    })
}
else{
    console.log("修改密码失败")
}
}


var PhoneNumber = phoneNumber.oninput=function(){
    var a=/^1[3|4|5|8][0-9]\d{8}$/
    flag=a.test(phoneNumber.value)
    console.log( "[a]",a.test(phoneNumber.value))
  if(flag){
      console.log( document.getElementById("clock").style)
      document.getElementById("clock").style.setProperty('pointer-events','auto')
      document.getElementById("clock").style.setProperty('color','black')
      console.log( document.getElementById("clock").style)
    } 
  else{
      document.getElementById("clock").style.setProperty('pointer-events','none')
      document.getElementById("clock").style.setProperty('color','#63697949')
    }
}

document.getElementById("clock").onclick=function(){
    console.log("111")
    var body={"phone":phoneNumber.value}
   toModifyPw(body).then(rep=>{
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

password.oninput=function(){
    if(password.value.length>=3&&password.value.length<=16)
    {  
        document.getElementById("yes1").style.setProperty('display','inline')
        document.getElementById("no1").style.setProperty('display','none')
        document.getElementById("tip_1").style.setProperty('display','none')
    }
    else{
        document.getElementById("no1").style.setProperty('display','inline')
        document.getElementById("yes1").style.setProperty('display','none')
        document.getElementById("tip_1").style.setProperty('display','block')
    }
}

verifyPw.oninput=function(){
    if(password.value==verifyPw.value)
    {
        document.getElementById("yes2").style.setProperty('display','inline')
        document.getElementById("no2").style.setProperty('display','none')
        document.getElementById("tip_2").style.setProperty('display','none')
    }
    else{
        document.getElementById("no2").style.setProperty('display','inline')
        document.getElementById("yes2").style.setProperty('display','none')
        document.getElementById("tip_2").style.setProperty('display','block')
    }
}
