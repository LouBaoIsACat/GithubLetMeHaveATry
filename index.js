import '@/static/css/index.scss'
import { competitorInfo } from '@/api/index.js'
import { searchGirl } from '@/api/index.js'
import { vote } from '@/api/index.js'
import { Rank } from '@/api/index.js'
import '@/static/css/common/toastr.scss'
import toastr from '@/static/js/common/toastr.js'
import { wsSessionStore } from '@/utils/storage.js'
var searchIcon = document.getElementById('search-icon');//搜索图标
var previousBtn = document.getElementsByClassName('pagination-previous')[0];//上一页按钮
var nextBtn = document.getElementsByClassName('pagination-next')[0];//下一页按钮
let currentPage;//当前页



isLogin();//已登录
rankingList();//排行榜
getpages();
searchIcon.onclick = Search;//点击搜索图标
previousBtn.onclick = previousPage;//点击上一页
nextBtn.onclick = NextPage;//点击下一页


function createPage(Pages) {     //生成页数
    var ul = document.getElementsByClassName('pagination-list')[0];
    ul.innerHTML = " ";
    var x = Pages < 8 ? Pages : 7;
    for (let i = 1; i <= x; i++) {
        var li = document.createElement('li');
        li.innerHTML = i;
        li.classList.add('pagination-link');
        ul.appendChild(li);
    }
    if (Pages > 7) {
        ul.innerHTML += '<li class="pagination-ellipsis">&hellip;</li>';
        ul.innerHTML += `<li class="pagination-link">${Pages}</li>`;
    }
}
function clickPage(Pages){         //点击页时
    var lis=document.getElementsByClassName('pagination-list')[0].getElementsByTagName('li');
    var ul=document.getElementsByClassName('pagination-list')[0];
    for(let i=0;i<lis.length;i++){
        lis[i].onclick=function(){
            currentPage=Number(lis[i].innerHTML);
            // console.log("[currentPage]",currentPage);
            for(let j=0;j<lis.length;j++){lis[j].classList.remove('is-current');}
            lis[i].classList.add('is-current');
            if(Pages>7){
                if((currentPage==Pages)&&(lis.length>7)){
                    lis[7].parentNode.removeChild(lis[7]);
                    lis[7].parentNode.removeChild(lis[7]);
                    lis[6].classList.add('is-current');
                    for(let k=0;k<7;k++){
                        lis[k].innerHTML=currentPage-(6-k);
                    }
                }
                if(!lis[7]&&currentPage<=Pages-4){
                    ul.innerHTML+='<li class="pagination-ellipsis">&hellip;</li>';
                    ul.innerHTML+=`<li class="pagination-link">${Pages}</li>`;
                }
                if(currentPage>1&&i==0){
                    var x=3;
                    if((Number(lis[0].innerHTML)-3)<=0){
                        x=1-(Number(lis[0].innerHTML)-3);
                    }
                    for(let k=0;k<7;k++){
                        lis[k].innerHTML=Number(lis[k].innerHTML)-x+1;
                    }
                    lis[0].classList.remove('is-current');
                    lis[x-1].classList.add('is-current');
                }
                if(currentPage<Pages&&i==6){
                    var x=3;
                    if((Number(lis[6].innerHTML)+3)>Pages){
                        x-=((Number(lis[6].innerHTML)+3)-Pages);
                    }
                    for(let k=0;k<7;k++){
                        lis[k].innerHTML=Number(lis[k].innerHTML)+x;
                    }
                    lis[6].classList.remove('is-current');
                    lis[6-x].classList.add('is-current');
                }
                if(lis[7]&&Number(lis[6].innerHTML)==Pages){
                    lis[7].parentNode.removeChild(lis[7]);
                    lis[7].parentNode.removeChild(lis[7]);
                }
            }
            if(currentPage>1){
                previousBtn.style.display="block";
            }
            if(currentPage<Pages){
                nextBtn.style.display="block";
            }
            getPageInfo(Pages);
        }
    }
}
function getPageInfo(Pages){                //获取页面信息
    console.log("getpageinfo-func");
    competitorInfo(currentPage).then((rep)=>{
        console.log("[girlinfo]",rep);

        if(rep.data){
            document.getElementsByClassName('fa-pulse')[0].style.display="none";
            document.getElementById('net-tip').style.display="none";
            infoDiv(rep);
            addLike(rep);
            clickPage(Pages);
        }
        
    })
}
function getpages() {
    competitorInfo(1).then((rep) => {
        console.log("total", rep.data.total);
        let Pages = parseInt(rep.data.total / 12) + ((rep.data.total % 12) > 0 ? 1 : 0);
        createPage(Pages);
        clickPage(Pages);
        document.getElementsByClassName('pagination-list')[0].getElementsByTagName('li')[0].click();
    })
}
function previousPage() {   //上一页
    // console.log('[page]',currentPage);
    let flag;
    var lis = document.getElementsByClassName('pagination-list')[0].getElementsByTagName('li');
    for (let i = 0; i < lis.length; i++) {
        if (Number(lis[i].innerHTML) == currentPage) { flag = i; }
    }
    document.getElementsByClassName('pagination-list')[0].getElementsByTagName('li')[flag - 1].click();
}
function NextPage() {    //下一页
    // console.log('[page]',currentPage);
    let flag;
    var lis = document.getElementsByClassName('pagination-list')[0].getElementsByTagName('li');
    for (let i = 0; i < lis.length; i++) {
        if (Number(lis[i].innerHTML) == currentPage) { flag = i; }
    }
    document.getElementsByClassName('pagination-list')[0].getElementsByTagName('li')[flag + 1].click();
}

function isLogin() {
    var user1 = wsSessionStore.get('userinfo');
    console.log(user1)
    if (user1) {
        document.getElementById('username').innerHTML = user1;
        document.getElementsByClassName('head')[0].style.display = "none";
        document.getElementsByClassName('is-login')[0].style.display = "block";
    }
    else {
        document.getElementsByClassName('is-login')[0].style.display = "none";
        document.getElementsByClassName('head')[0].style.display = "inline-block";
    }
}


var picture = document.getElementsByClassName('picture');//大照片
var pictures = document.getElementsByClassName("pic");//小照片
function createDiv(a, b,c) {
    let div = `<div class="unit "><div class="adjust "><div class="picture"></div><div class="select-pic"><div class="pic pic1"></div><div class="pic pic2"></div><div class="pic pic3"></div></div>
    <div class="info"><i class="fa fa-map-marker"></i><p class="school">${a}</p><br><p class="name">${b}</p><br><i class="far fa-heart"></i><p class="amount">${c}</p></div></div></div>`;
    return div;
}
function infoDiv(response) {
    console.log("PICTURE:",response.data.list);
    var left = document.getElementsByClassName('left')[0];
    let leftContent = ' ';
    left.innerHTML = " ";
    console.log("girlinfo-length", response.data.list.length)
    if (response.data.list.length == 0) {
        left.innerHTML += '<p>没有搜索结果</p>';
    }
    else{
        for(let i=0;i<response.data.list.length;i++){
            leftContent+=createDiv(response.data.list[i].School,response.data.list[i].Nick,response.data.list[i].Like);
        }
        left.innerHTML+=leftContent;
        for(let i=0;i<response.data.list.length;i++){
            picture[i].style.backgroundImage='url("'+response.data.list[i].picture[0]+'")';
            // picture[i].style.backgroundImage='url("'+response.data.list[i].Picture[0]+'")';
            for(let j=0;j<3;j++){
                pictures[3*i+j].style.backgroundImage='url("'+response.data.list[i].picture[j]+'")';
                // pictures[3*i+j].style.backgroundImage='url("'+response.data.list[i].Picture[j]+'")';
                pictures[3*i+j].onclick=function (){   //选择显示照片
                    picture[i].style.backgroundImage='url("'+response.data.list[i].picture[j]+'")';
                    // picture[i].style.backgroundImage='url("'+response.data.list[i].Picture[j]+'")';
                }
            }
        }
    }

}

function addLike(response) {      //点赞
    var heart = document.getElementsByClassName('fa-heart');//爱心
    var voteCount = document.getElementsByClassName('amount');//票数;
    for (let i = 0; i < heart.length; i++) {
        if (response.data.list[i].isLike == 1) {
            heart[i].classList.remove('far');
            heart[i].classList.add('fas');
            heart[i].style.color = "red";
        }
        heart[i].onclick = function () {
            if (response.data.list[i].isLike != 1) {
                heart[i].classList.remove('far');
                heart[i].classList.add('fas');
                heart[i].style.color = "red";
                response.data.list[i].isLike = 1;
                Vote(response.data.list[i].id);
                voteCount[i].innerHTML = Number(voteCount[i].innerHTML) + 1;
            }
        }
    }
}
function Vote(id) {   //点击爱心投票
    var body = { "id": id };
    vote(body).then((rep) => {
        console.log("[vote-id]", id);
    })
}





function Search() {    //搜索某个女孩
    var search = document.getElementById('search-input');//输入框
    searchGirl(search.value).then((rep) => {
        console.log("[search-rep]", rep);
        console.log("[totla]:", rep.data.total);
        infoDiv(rep);
        addLike(rep);
        createPage(rep.data.total / 12 + ((rep.data.total % 12) > 0 ? 1 : 0));
        clickPage(rep.data.total / 12 + ((rep.data.total % 12) > 0 ? 1 : 0));
        document.getElementsByClassName('pagination-list')[0].getElementsByTagName('li')[0].click();
    })
}
document.onkeydown = function (event) {
    var e = event || window.event || arguments.callee.caller.arguments[0];
    if (e && e.keyCode == 13) {
        searchIcon.click();
    }
};



var logout = document.getElementsByClassName('one')[2];//注销
logout.onclick = function () {
    var w=wsSessionStore.get('userinfo');
    wsSessionStore.clear();
    if(!wsSessionStore.get('userinfo')){
        toastr.success("注销成功!", w);
        setTimeout(() => {
            window.location = "index.html";
        }, 1000)
    }
    else{
        toastr.error("注销失败!", wsSessionStore.get('userinfo'));
    }
}

function rankingList(){
    Rank().then((rep)=>{
        // console.log("[rank]:",rep);
        if(rep.data.rank.length==0){
            document.getElementsByClassName('right')[0].getElementsByTagName('p')[0].style.display="block";
            document.getElementsByClassName('table')[0].style.display="none";
        }
        else{
            var tbody=document.getElementsByTagName('tbody')[0];
            for(let i=0;i<rep.data.rank.length;i++){
                var name=rep.data.rank[i].nick;
                var school=rep.data.rank[i].school;
                if(rep.data.rank[i].nick.length>4){
                    rep.data.rank[i].nick=rep.data.rank[i].nick.substring(0,3)+'...';
                }
                if (rep.data.rank[i].school.length > 6) {
                    rep.data.rank[i].school = rep.data.rank[i].school.substring(0, 6) + '...';
                }
                tbody.innerHTML += `<tr><td>${i + 1}</td><td>${rep.data.rank[i].nick}<span class="tiptext">${name}</span></td>
                <td>${rep.data.rank[i].school}<span class="tiptext">${school}</span></td>
                <td>${rep.data.rank[i].like}</td></tr>`;
            }
        }
        
    })
}

var carousel = layui.carousel;
//建造实例
carousel.render({
  elem: '#test1'
  ,width: '100%' //设置容器宽度
  ,height:'476px'
  ,arrow: 'hover' //始终显示箭头
  //,anim: 'updown' //切换动画方式
  ,interval:4000
});

/*哈哈哈哈哈哈哈哈哈哈或或或或或或或或或或或或或或或或或或或*/