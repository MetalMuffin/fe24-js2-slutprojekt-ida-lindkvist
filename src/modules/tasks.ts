// Denna modul hanterar interaktionen med Firebase-databasen och 
//  renderingen av uppgifter i de tre kolumnerna (Ny, Pågående, Klar).

import { db } from "./firebase";
import { ref, push, set, update, remove, onValue } from "firebase/database";
import { getMembersForTask } from "./members";
import { updateTaskList, populateFilterOptions, handleFilterChanges, filterAndSortTasks } from "./filterandsort";


const newList = document.getElementById("new-list") as HTMLUListElement;
const inProgressList = document.getElementById("in-progress-list") as HTMLUListElement;
const doneList = document.getElementById("done-list") as HTMLUListElement;
const taskForm = document.getElementById("task-form") as HTMLFormElement;
const titleInput = document.getElementById("title") as HTMLInputElement;
const descriptionInput = document.getElementById("description") as HTMLInputElement;
const categoryInput = document.getElementById("category") as HTMLSelectElement;


const categoryColors: { [key: string]: string } = {
    "UX": "lightblue",
    "Frontend": "#C9A7EB",
    "Backend": "lightcoral",
};

// Lägg till ny uppgift
taskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = titleInput.value;
    const description = descriptionInput.value;
    const category = categoryInput.value;

    const tasksRef = ref(db, "tasks");
    const newTaskRef = push(tasksRef);

    set(newTaskRef, {
        id: newTaskRef.key,
        title,
        description,
        category,
        timestamp: Date.now(),
        status: "new",
    });

    taskForm.reset();
});

// Hanterar Nya och Klara uppgifter
function renderTasks(allTasks: any[]) {
    newList.innerHTML = "";
    doneList.innerHTML = "";

    allTasks.forEach((task: any) => {
        const li = document.createElement("li");
        const formattedDate = new Date(task.timestamp).toLocaleString("sv-SE");
        li.style.backgroundColor = categoryColors[task.category] || "white";
        li.innerHTML = `${task.title} <br> ${task.description} <br> ${task.category} <br> ${formattedDate}`;

        if (task.status === "new") {
            const assignSelect = document.createElement("select");
            assignSelect.innerHTML = `<option value="">Välj medlem</option>`;
            getMembersForTask(task.category, assignSelect);

            const assignButton = document.createElement("button");
            assignButton.textContent = "Tilldela";
            assignButton.classList.add("assign-btn");
            assignButton.onclick = () => {
                const selectedMemberId = assignSelect.value;
                if (selectedMemberId) {
                    updateTask(task.id, "inProgress", selectedMemberId);
                }
            };

            li.appendChild(assignSelect);
            li.appendChild(assignButton);
            newList.appendChild(li);
        } 
        else if (task.status === "done") {
            onValue(ref(db, `users/${task.assignedTo}`), (userSnapshot) => {
                const assignedMember = userSnapshot.val();
                const completedByText = assignedMember ? ` <br> Utförd av: ${assignedMember.name}` : "";
                li.innerHTML += completedByText;
            });

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Ta bort";
            deleteButton.classList.add("delete-btn");
            deleteButton.onclick = () => deleteTask(task.id);
            li.appendChild(deleteButton);
            doneList.appendChild(li);
        }
    });
}

// Hanterar Pågående uppgifter
function renderInProgressTasks(filteredTasks: any[]) {
    inProgressList.innerHTML = "";

    filteredTasks.forEach((task: any) => {
        const li = document.createElement("li");
        const formattedDate = new Date(task.timestamp).toLocaleString("sv-SE");
        li.style.backgroundColor = categoryColors[task.category] || "white";
        li.innerHTML = `${task.title} <br> ${task.description} <br> ${task.category} <br> ${formattedDate}`;

        onValue(ref(db, `users/${task.assignedTo}`), (snapshot) => {
            const assignedMember = snapshot.val();
            li.innerHTML += ` <br> Tilldelad: ${assignedMember?.name || "Okänd"}`;
        });

        const completeButton = document.createElement("button");
        completeButton.textContent = "Klar";
        completeButton.classList.add("complete-btn");
        completeButton.onclick = () => updateTask(task.id, "done", task.assignedTo);
        li.appendChild(completeButton);
        inProgressList.appendChild(li);
    });
}


function updateTask(taskId: string, status: string, assignedTo?: string) {
    const updates: any = { status };
    if (assignedTo) updates.assignedTo = assignedTo;

    update(ref(db, `tasks/${taskId}`), updates)
        .then(() => console.log(`Uppgift uppdaterad till ${status}`))
        .catch((error) => console.error("Fel vid uppdatering:", error));
}


function deleteTask(taskId: string) {
    remove(ref(db, `tasks/${taskId}`));
}


function initialize() {
    populateFilterOptions();
    handleFilterChanges(renderInProgressTasks);
    updateTaskList(renderInProgressTasks);
    onValue(ref(db, "tasks"), (snapshot) => renderTasks(Object.values(snapshot.val() || {})));

}

initialize();