import { db } from "./firebase";
import { ref, push, set, onValue } from "firebase/database";

const memberForm = document.getElementById("memberForm") as HTMLFormElement;
const memberNameInput = document.getElementById("memberName") as HTMLInputElement;
const memberRoleInput = document.getElementById("memberRole") as HTMLSelectElement;
const teamList = document.getElementById("teamList") as HTMLUListElement;

// Färgkodning för roller
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

// ⭐ Funktion: Lägg till ny teammedlem i Firebase och DOM
memberForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = memberNameInput.value.trim();
    const role = memberRoleInput.value;

    if (!name || !role) return; // Säkerställ att fälten är ifyllda
    
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
        console.log(`✅ ${name} tillagd i teamet!`);
        memberForm.reset(); // Rensa formuläret efter tillägg
    })
    .catch((error) => console.error("❌ Fel vid tillägg:", error));
});

// ⭐ Funktion: Hämta och visa teammedlemmar i DOM
onValue(ref(db, "users"), (snapshot) => {
    teamList.innerHTML = ""; // Rensa listan innan uppdatering

    const users = snapshot.val();
    if (users) {
        Object.values(users).forEach((user: any) => {
            const li = document.createElement("li");
            li.textContent = `${user.name} (${user.roles.join(", ")})`;
            li.style.backgroundColor = roleColors[user.roles[0]]; // Använd första rollen för färgkodning
            teamList.appendChild(li);
        });
    }
});

// ⭐ Hämta medlemmar för en specifik roll
export function getMembersForTask(category: string, dropdown: HTMLSelectElement) {
    
    onValue(ref(db, "users"), (snapshot) => {
        const users = snapshot.val();
        
        if (users) {
            Object.values(users).forEach((user: any) => {
                
                if (user.category.toLowerCase() === category.toLowerCase()) {  // 🛠️ Jämför kategori istället för roller
                    const option = document.createElement("option");
                    option.value = user.id;
                    option.textContent = user.name;
                    dropdown.appendChild(option);
                }
            });
        }
    });
}
