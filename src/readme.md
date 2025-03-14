## Scrum Board

Scrum Board är en webbaserad applikation för att hantera uppgifter och teammedlemmar i realtid med hjälp av Firebase.  
Användare kan lägga till, tilldela, uppdatera och filtrera uppgifter för att organisera sitt arbete effektivt.

## Funktioner  
- **Lägg till och hantera uppgifter**: Skapa nya uppgifter med titel, beskrivning och kategori.  
- **Tilldela teammedlemmar**: Koppla uppgifter till specifika medlemmar baserat på kategori.  
- **Statushantering**: Flytta uppgifter mellan "Ny", "Pågående" och "Klar".  
- **Filtrering och sortering**: Filtrera uppgifter efter medlem och kategori, samt sortera efter datum eller namn.  
- **Automatisk uppdatering**: Realtidsuppdatering av uppgifter och teammedlemmar med Firebase.

## Teknologier  
- **TypeScript**: Striktare typkontroll och bättre kodstruktur.  
- **Firebase Realtime Database**: Lagrar och hämtar uppgifter och teammedlemmar i realtid.  
- **Modulär kodstruktur**: Separata moduler för uppgiftshantering, teammedlemmar och filtrering. 

## Mappstruktur  
- **index.ts** – Initierar applikationen.  
- **tasks.ts** – Hanterar CRUD-operationer för uppgifter.  
- **members.ts** – Hanterar teammedlemmar och roller.  
- **filterandsort.ts** – Filtrerar och sorterar uppgifter.  
- **firebase.ts** – Firebase-konfiguration.  
- **styles.css** – Styling för applikationen.  

## App-funktionalitet
- **lägga till medlemmar** – Skriv in namn och roll för att uppdatera firebase och DOM
- **lägga till uppgifter** – Skriv in Titel, Beskrivning och Kategori
- **Tilldela uppgifter** – Tilldela uppgifter till teammedlemmar inom rätt kategori  
- **klarmarkera uppgifter** – hantera uppgifter 
- **radera färdiga uppgifter** – radera färdiga uppgifter
- **sortera  och filtrera** – Sortera och filtrera pågående uppgifter