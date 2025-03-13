import { db } from "./firebase";
import { ref, push, set, onValue } from "firebase/database";


const memberForm = document.getElementById("memberForm") as HTMLFormElement;
const memberNameInput = document.getElementById("memberName") as HTMLInputElement;
const memberRoleInput = document.getElementById("memberRole") as HTMLSelectElement;
const teamList = document.getElementById("teamList") as HTMLUListElement;


const roleColors: { [key: string]: string } = {
    "UX designer": "lightblue",
    "Frontend developer": "#C9A7EB",
    "Backend developer": "lightcoral",
};

const roleToCategory: { [key:string]: string } = {
    "UX designer": "ux",
    "Frontend developer": "frontend",
    "Backend developer": "backend",
};

// Lägg till ny teammedlem
memberForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = memberNameInput.value.trim();
    const role = memberRoleInput.value;

    if (!name || !role) return;
    
    const usersRef = ref(db, "users");
    const newUserRef = push(usersRef);

    const category = roleToCategory[role] || "other";

    set(newUserRef, {
        id: newUserRef.key,
        name,
        roles: [role],
        category,
    })
    .then(() => {
        console.log(`${name} tillagd i teamet!`);
        memberForm.reset();
    })
    .catch((error) => console.error("Fel vid tillägg:", error));
});

// Hämta och visa teammedlemmar
onValue(ref(db, "users"), (snapshot) => {
    teamList.innerHTML = "";

    const users = snapshot.val();
    if (users) {
        Object.values(users).forEach((user: any) => {
            const li = document.createElement("li");
            li.textContent = `${user.name} (${user.roles})`;
            li.style.backgroundColor = roleColors[user.roles[0]];
            teamList.appendChild(li);
        });
    }
});

// Hämtar och visar medlemmar med matchande kategori till uppgiften
export function getMembersForTask(category: string, dropdown: HTMLSelectElement) {
    
    onValue(ref(db, "users"), (snapshot) => {
        const users = snapshot.val();
        
        if (users) {
            Object.values(users).forEach((user: any) => {
                
                if (user.category.toLowerCase() === category.toLowerCase()) {
                    const option = document.createElement("option");
                    option.value = user.id;
                    option.textContent = user.name;
                    dropdown.appendChild(option);
                }
            });
        }
    });
}