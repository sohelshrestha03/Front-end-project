const taskInput=document.getElementById('input1');
const taskButton=document.getElementById('btn');
const taskList=document.getElementById('myList');

const allBtn=document.getElementById('allBtn');
const pendingBtn=document.getElementById('pendingBtn');
const completedBtn=document.getElementById('completedBtn');

let tasks=JSON.parse(localStorage.getItem("tasks"))||[];

displayTasks("all");

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
}

taskButton.addEventListener("click",function(){
    const taskText=taskInput.value.trim();
    if(taskText===""){
        alert("Please enter a task.");
        return;
    }

    const task={
        id:Date.now(),
        text:taskText,
        completed:false
    };
    tasks.push(task);
    saveTasks();
    taskInput.value="";
    displayTasks("all");
});

function displayTasks(filter){
    taskList.innerHTML="";
    let filteredTasks=tasks;
    if(filter==="pending"){
       filteredTasks=tasks.filter(function(task){
        return task.completed===false;
       });
    }

     if(filter==="completed"){
       filteredTasks=tasks.filter(function(task){
        return task.completed===true;
       });
    }
    filteredTasks.forEach(function(task){
        const li=document.createElement("li");
        const span=document.createElement("span");
        span.textContent=task.text;

        if(task.completed){
            span.classList.add("completed");
        }

        const buttonConatiner=document.createElement("div");
        buttonConatiner.classList.add("task-buttons");

        const completeBtn=document.createElement("button");
        completeBtn.innerHTML=task.completed?"↩":"✓";
        completeBtn.title=task.completed?"Undo":"Complete";
        if(task.completed){
            completeBtn.classList.add("undo-btn");
            completeBtn.style.backgroundColor=localStorage.getItem("undoColor")||"lightblue";
        }else{
            completeBtn.classList.add("completed-task");
            completeBtn.style.backgroundColor=localStorage.getItem("completeColor")||"green";
        }
        completeBtn.addEventListener("click",function(){
            task.completed=!task.completed;
            saveTasks();
            displayTasks(filter);
        });

        const editBtn=document.createElement("button");
        editBtn.innerHTML="✎";
        editBtn.title="Edit";
        editBtn.classList.add("edit-btn");
        editBtn.style.backgroundColor=localStorage.getItem("editColor")||"yellow";
        editBtn.addEventListener("click",function(){
            const newTask=prompt("Edit your tasks:",task.text);

            if(newTask!==null && newTask.trim()!==""){
                task.text=newTask.trim();
                saveTasks();
                displayTasks(filter);
            }
        });

        const deleteBtn=document.createElement("button");
        deleteBtn.innerHTML="🗑";
        deleteBtn.title="Delete";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.style.backgroundColor=localStorage.getItem("delete")||"red";
        deleteBtn.addEventListener("click",function(){
          const confirmDelete=confirm("Are you sure you want to delete this task?");
          
          if(confirmDelete){
            tasks=tasks.filter(function(item){
                return item.id!==task.id;
            });
            saveTasks();
            displayTasks(filter);
          }
        });
        buttonConatiner.appendChild(completeBtn);
        buttonConatiner.appendChild(editBtn);
        buttonConatiner.appendChild(deleteBtn);

        li.appendChild(span);
        li.appendChild(buttonConatiner);

        taskList.appendChild(li);
    });
}

function saveTasks(){
    localStorage.setItem("tasks",JSON.stringify(tasks));
}

allBtn.addEventListener("click",function(){
    displayTasks("all");
});

pendingBtn.addEventListener("click",function(){
    displayTasks("pending");
});

completedBtn.addEventListener("click",function(){
    displayTasks("completed");
});