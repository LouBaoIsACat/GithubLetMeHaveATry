import "@/static/css/individual.scss"
import { getImg,modifyImg, participate, modifyInfo } from "../../api/individual";
import '@/static/css/common/toastr.scss'
import toastr from '@/static/js/common/toastr.js'
import { isStringNull } from "../../utils/validate";
import { wsSessionStore } from "../../utils/storage";
import { userInfo } from "os";

var flag=false
var imgUrl
var img=document.getElementById("img")

console.log("username",wsSessionStore.get('userinfo'))

if(!wsSessionStore.get('userinfo'))
{
    document.querySelector(".all").style.setProperty('display','none')
    toastr.warning('','您还未登录，请先登录')
    setTimeout(() => {
        window.location="login.html"
    }, 1500); 
}
else{
    getImg().then(rep=>{
        console.log('666')
       var Img=rep.data.avatar
      img.style.setProperty('background-image','url('+Img+')')
    })
    
     var tabs = document.querySelectorAll('.tab_nav_item');
     var tab = document.querySelectorAll('.tab_body_item');
     tab[0].classList.add('active')
     tabs[0].style.setProperty('color','#f773b1')
     tabs[0].style.setProperty('background','rgba(255, 255, 255, 1)')
     for(let i=0;i<tabs.length;i++)
     {
        tabs[i].index=i
        tabs[i].addEventListener('click',function(){
            var index=this.index
            tabs[i].style.setProperty('color','#f773b1')
            tabs[i].style.setProperty('background','rgba(255, 255, 255, 1)')
            tabs[tabs.length-i-1].style.setProperty('color','black')
            tabs[tabs.length-i-1].style.setProperty('background','rgba(255,255,255,0.0)')
            for(var j=0;j<tabs.length;j++)
            {
                if(j!=index)
                {
                    tab[j].classList.remove('active')
                }
                else{
                    tab[j].classList.add('active')
                }
            }
        },false)
     }
    
    
    var add=document.getElementById("add")
    var add_items=document.querySelectorAll(".add_item")
    var add_i=document.querySelectorAll(".add_i")
    var btn = document.querySelectorAll(".btn")
    var file=new Array()
    for(let i=0;i<add_items.length;i++)
    {
        add_items[i].index=i
        add_items[i].addEventListener('change',function(){
         var index=this.index
         var reader=new FileReader()
         if(btn[i].files[0]!=undefined)
         {
            file[i]=btn[i].files[0]
            console.log(file[i])
            reader.readAsDataURL(file[i])
            reader.onload=function(){ 
                for(var j=0;j<add_items.length;j++)
                {
                    if(index==j)
                    {
                       add_items[i].style.setProperty('background-image','url('+this.result+')')
                       add_i[i].style.setProperty('display','none')
                    }
                }
            } 
        }
        else{
            toastr.warning('未选择图片')
        }
    },false)
         
    }
    
    var join=document.getElementById("join")
    join.onclick=function(){
        var upload = new FormData()
        upload.append('picture',file)
        console.log(upload.append.length)
        if(upload.append.length>=0)
        {
            participate(upload).then(rep=>{
                console.log(rep)
                if(rep.code==2000)
                {
                    toastr.success('','上传成功！')
                }
            })
        }
        else{
            toastr.warning('','请选择图片')
        }

      
    }
    
     var ModifyImg=document.getElementById("modifyImg")
      ModifyImg.onchange=function(){
       var file = ModifyImg.files[0]
        var reader=new FileReader()
        reader.readAsDataURL(file)
        reader.onload=function(){ 
            img.style.setProperty('background-image','url('+this.result+')')
            imgUrl=this.result
        } 
        var upload = new FormData()
        upload.append('avatar',file)
        modifyImg(upload).then(rep=>{
            if(rep.code==2000)
            {
                if(flag&&isStringNull(select))
                {
                    toastr.success('','更改成功')
                }
    
            }
        })
     }
    
    var yes=document.getElementById("yes")
    var no=document.getElementById("no")
    var username=document.getElementById("username")
    username.oninput=function(){
         if(username.value.length>=2&&username.value.length<=7&&isStringNull(username))
         {
             yes.style.setProperty('display','block')
             no.style.setProperty('display','none')
         }
         else{
            yes.style.setProperty('display','none')
            no.style.setProperty('display','block')
         }
    }
    
    var select=document.getElementById("select")
    
    
    
    var Yes=document.getElementById("Yes")
    Yes.onclick=function(){
       var body={"nick":username.value,"school":select.value}
       console.log(body)
       modifyInfo(body).then(rep=>{
           console.log(rep)
           if(rep.code==2000)
           {
               toastr.success('','修改成功')
           }
       })
    }
    
}




