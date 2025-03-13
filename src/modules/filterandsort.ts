import { ref, onValue } from "firebase/database";
import { db } from "./firebase";


const filterMemberSelect = document.getElementById("filter-member") as HTMLSelectElement;
const filterCategorySelect = document.getElementById("filter-category") as HTMLSelectElement;
const sortSelect = document.getElementById("sortSelect") as HTMLSelectElement;


export function filterAndSortTasks(tasks, selectedMember, selectedCategory, sortOption) {
    
    let filteredTasks = tasks.filter((task: any) => {
        if (task.status !== "inProgress") return false;
        if (selectedMember && task.assignedTo !== selectedMember) return false;
        if (selectedCategory && task.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
        return true;
    });

    if (sortOption === "timestamp-asc") {
        filteredTasks.sort((a, b) => a.timestamp - b.timestamp); // Äldst först
    } else if (sortOption === "timestamp-desc") {
        filteredTasks.sort((a, b) => b.timestamp - a.timestamp); // Nyast först
    } else if (sortOption === "title-asc") {
        filteredTasks.sort((a, b) => a.title.localeCompare(b.title)); // A-Ö
    } else if (sortOption === "title-desc") {
        filteredTasks.sort((a, b) => b.title.localeCompare(a.title)); // Ö-A
    }

    return filteredTasks;
}

// Uppdatera Pågående-listan baserat på filtren
export function updateTaskList(updateCallback: Function) {
    onValue(ref(db, "tasks"), (snapshot) => {
        const tasks = snapshot.val();
        
        if (tasks) {
            const selectedMember = filterMemberSelect.value;
            const selectedCategory = filterCategorySelect.value;
            const sortOption = sortSelect.value
            
            const processedTasks = filterAndSortTasks(Object.values(tasks), selectedMember, selectedCategory, sortOption);

           updateCallback(processedTasks);
        }
    });
}

// Fyller filtrerings-dropdowns med medlemmar och kategorier
export function populateFilterOptions() {
    const categories = ["frontend", "backend", "ux"];

    filterCategorySelect.innerHTML = `<option value="">Alla kategorier</option>`;
    categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        filterCategorySelect.appendChild(option);
    });

    onValue(ref(db, "users"), (snapshot) => {
        filterMemberSelect.innerHTML = `<option value="">Alla medlemmar</option>`;
        const users = snapshot.val();
        if (users) {
            Object.values(users).forEach((user: any) => {
                const option = document.createElement("option");
                option.value = user.id;
                option.textContent = user.name;
                filterMemberSelect.appendChild(option);
            });
        }
    });
}


export function handleFilterChanges(updateCallback: Function) {
    const filterMemberSelect = document.getElementById("filter-member") as HTMLSelectElement;
    const filterCategorySelect = document.getElementById("filter-category") as HTMLSelectElement;
    const sortSelect = document.getElementById("sortSelect") as HTMLSelectElement;

    function applyFilters() {
        const selectedMember = filterMemberSelect.value;
        const selectedCategory = filterCategorySelect.value;
        const sortOption = sortSelect.value;

        updateTaskList((tasks: any[]) => {
            const filteredAndSortedTasks = filterAndSortTasks(tasks, selectedMember, selectedCategory, sortOption);
            updateCallback(filteredAndSortedTasks);
        });
    }

    filterMemberSelect.addEventListener("change", applyFilters);
    filterCategorySelect.addEventListener("change", applyFilters);
    sortSelect.addEventListener("change", applyFilters);
}