const btn1=document.getElementById('themedBtn');
const btn2=document.getElementById('clearBtn');
const btn3=document.getElementById('completeColor');
const btn4=document.getElementById('undoColor');
const btn5=document.getElementById('editColor');
const btn6=document.getElementById('deleteColor');

if(localStorage.getItem("theme")==="dark"){
    document.body.classList.add("dark");
    btn1.textContent="Light Mode";
}

btn1.addEventListener("click",function(){
   document.body.classList.toggle("dark");
   if(document.body.classList.contains("dark")){
    btn1.textContent="Light Mode";
    localStorage.setItem("theme","dark");
   }else{
    btn1.textContent="Dark Mode";
    localStorage.setItem("theme","light");
   }
});

if(localStorage.getItem("completeColor")){
    btn3.value=localStorage.getItem("completeColor");
}

if(localStorage.getItem("undoColor")){
    btn4.value=localStorage.getItem("undoColor");
}

if(localStorage.getItem("editColor")){
    btn5.value=localStorage.getItem("editColor");
}

if(localStorage.getItem("deleteColor")){
    btn6.value=localStorage.getItem("deleteColor");
}

btn3.addEventListener("input",function(){
    localStorage.setItem("completeColor",btn3.value);
});

btn4.addEventListener("input",function(){
    localStorage.setItem("undoColor",btn4.value);
});

btn5.addEventListener("input",function(){
    localStorage.setItem("editColor",btn5.value);
});

btn6.addEventListener("input",function(){
    localStorage.setItem("deleteColor",btn6.value);
});



btn2.addEventListener("click",function(){
    const confirmClear=confirm("Are you sure you want to clear all tasks?");
    if(confirmClear){
        localStorage.removeItem("tasks");
        alert("All tasks have been cleared.");
    }
});