// Importerar 'fs' (File System) modulen för att hantera filsystemet (skapa och skriva filer)
const fs = require('fs');

// Datan med övningar och målmuskelgrupper. Varje övning har detaljer som namn, muskelgrupp, beskrivning på engelska och svenska, samt en tom embedding (som kommer att fyllas senare)
const exercises = [
    { exercise_name: "Bench Press", target_muscle_group: "Chest", description: "Primary muscle: chest, but also shoulders and triceps are active.", swe_exercise_name: "Bänkpress", swe_target_muscle_group: "Bröst", swe_description: "Primärt bröstmuskeln, men även axlar och triceps är aktiva.", embedding: [] },
    { exercise_name: "Push-ups", target_muscle_group: "Chest", description: "A great exercise for chest and triceps, no equipment needed.", swe_exercise_name: "Push-ups", swe_target_muscle_group: "Bröst", swe_description: "Bra övning för bröst och triceps, kräver ingen utrustning.", embedding: [] },
    { exercise_name: "Chest Fly", target_muscle_group: "Chest", description: "Targets the chest muscles, especially the pectorals.", swe_exercise_name: "Chest Fly", swe_target_muscle_group: "Bröst", swe_description: "Fokuserar på bröstmusklerna, särskilt pectoralis.", embedding: [] },
    { exercise_name: "Incline Bench Press", target_muscle_group: "Chest", description: "Works the upper chest and shoulders.", swe_exercise_name: "Incline Bänkpress", swe_target_muscle_group: "Bröst", swe_description: "Arbetar med övre bröst och axlar.", embedding: [] },
    { exercise_name: "Deadlifts", target_muscle_group: "Back", description: "Targets the back, legs, and core.", swe_exercise_name: "Marklyft", swe_target_muscle_group: "Rygg", swe_description: "Fokuserar på rygg, ben och core.", embedding: [] },
    { exercise_name: "Pull-ups", target_muscle_group: "Back", description: "Great exercise for upper back and arms.", swe_exercise_name: "Pull-ups", swe_target_muscle_group: "Rygg", swe_description: "En bra övning för övre rygg och armar.", embedding: [] },
    { exercise_name: "Lat Pulldown", target_muscle_group: "Back", description: "Focuses on the lats and upper back.", swe_exercise_name: "Lat Pulldown", swe_target_muscle_group: "Rygg", swe_description: "Fokuserar på lats och övre rygg.", embedding: [] },
    { exercise_name: "Bent-over Rows", target_muscle_group: "Back", description: "Works the back and biceps.", swe_exercise_name: "Hantelrodd", swe_target_muscle_group: "Rygg", swe_description: "Arbetar med rygg och biceps.", embedding: [] },
    { exercise_name: "Squats", target_muscle_group: "Legs", description: "Targets the quads, hamstrings, and glutes.", swe_exercise_name: "Knäböj", swe_target_muscle_group: "Ben", swe_description: "Fokuserar på lår, hamstrings och rumpa.", embedding: [] },
    { exercise_name: "Lunges", target_muscle_group: "Legs", description: "Works the legs and glutes.", swe_exercise_name: "Utfall", swe_target_muscle_group: "Ben", swe_description: "Arbetar med ben och rumpa.", embedding: [] },
    { exercise_name: "Leg Press", target_muscle_group: "Legs", description: "Targets the quads and glutes.", swe_exercise_name: "Benspark", swe_target_muscle_group: "Ben", swe_description: "Fokuserar på lår och rumpa.", embedding: [] },
    { exercise_name: "Leg Curls", target_muscle_group: "Legs", description: "Works the hamstrings.", swe_exercise_name: "Hamstringcurl", swe_target_muscle_group: "Ben", swe_description: "Fokuserar på hamstrings.", embedding: [] },
    { exercise_name: "Bicep Curls", target_muscle_group: "Arms", description: "Targets the biceps.", swe_exercise_name: "Bicepscurl", swe_target_muscle_group: "Armar", swe_description: "Fokuserar på biceps.", embedding: [] },
    { exercise_name: "Tricep Dips", target_muscle_group: "Arms", description: "Great exercise for triceps.", swe_exercise_name: "Tricepsdips", swe_target_muscle_group: "Armar", swe_description: "Bra övning för triceps.", embedding: [] },
    { exercise_name: "Hammer Curls", target_muscle_group: "Arms", description: "Works the biceps and forearms.", swe_exercise_name: "Hammarcurl", swe_target_muscle_group: "Armar", swe_description: "Fokuserar på biceps och underarmar.", embedding: [] },
    { exercise_name: "Skull Crushers", target_muscle_group: "Arms", description: "Focuses on the triceps.", swe_exercise_name: "Skullcrusher", swe_target_muscle_group: "Armar", swe_description: "Fokuserar på triceps.", embedding: [] },
    { exercise_name: "Shoulder Press", target_muscle_group: "Shoulders", description: "Targets the shoulders.", swe_exercise_name: "Axelpress", swe_target_muscle_group: "Axlar", swe_description: "Fokuserar på axlar.", embedding: [] },
    { exercise_name: "Lateral Raises", target_muscle_group: "Shoulders", description: "Works the shoulders and upper traps.", swe_exercise_name: "Laterala lyft", swe_target_muscle_group: "Axlar", swe_description: "Arbetar med axlar och övre traps.", embedding: [] },
    { exercise_name: "Front Raises", target_muscle_group: "Shoulders", description: "Targets the front deltoid.", swe_exercise_name: "Framlift", swe_target_muscle_group: "Axlar", swe_description: "Fokuserar på framsida deltoid.", embedding: [] },
    { exercise_name: "Upright Rows", target_muscle_group: "Shoulders", description: "Works the traps and shoulders.", swe_exercise_name: "Höga rodd", swe_target_muscle_group: "Axlar", swe_description: "Arbetar med traps och axlar.", embedding: [] },
    { exercise_name: "Crunches", target_muscle_group: "Abs", description: "Targets the abdominal muscles.", swe_exercise_name: "Sit-ups", swe_target_muscle_group: "Mage", swe_description: "Fokuserar på magmusklerna.", embedding: [] },
    { exercise_name: "Leg Raises", target_muscle_group: "Abs", description: "Works the lower abdominal muscles.", swe_exercise_name: "Benspark", swe_target_muscle_group: "Mage", swe_description: "Arbetar med nedre magmuskler.", embedding: [] },
    { exercise_name: "Russian Twists", target_muscle_group: "Abs", description: "Targets the obliques.", swe_exercise_name: "Ryska vridningar", swe_target_muscle_group: "Mage", swe_description: "Fokuserar på sneda magmuskler.", embedding: [] },
    { exercise_name: "Plank", target_muscle_group: "Abs", description: "Works the core muscles.", swe_exercise_name: "Plankan", swe_target_muscle_group: "Mage", swe_description: "Arbetar med core-musklerna.", embedding: [] }
];

// Dummy embedding data (1024 dimensioner för varje övning)
// Funktionen 'generateDummyEmbedding' skapar en lista med 1024 slumpmässiga värden som representerar "embedding" för varje övning
const generateDummyEmbedding = () => Array(1024).fill(Math.random()); // Genererar en lista med 1024 slumpmässiga värden

// Uppdatera varje övning med en dummy-embedding
// För varje övning i listan, anropas 'generateDummyEmbedding' för att skapa en "embedding" och läggs till i övningens objekt
exercises.forEach(exercise => {
    exercise.embedding = generateDummyEmbedding();
});

// Funktion för att skapa en CSV-fil med övningar och deras attribut
function createCSV(exercises, outputFileName) {
    // Börja skapa CSV-strängen med rubrikerna för varje kolumn
    let csvContent = "exercise_name,target_muscle_group,description,swe_exercise_name,swe_target_muscle_group,swe_description,embedding\n";
    
    // Gå igenom alla övningar och formatera data i CSV-format
    exercises.forEach(exercise => {
        // Om det finns kommatecken i texten (t.ex. beskrivningar), sätt hela texten inom citattecken
        const description = `"${exercise.description.replace(/"/g, '""')}"`; // Escape citattecken i beskrivningen
        const sweDescription = `"${exercise.swe_description.replace(/"/g, '""')}"`; // Escape citattecken i den svenska beskrivningen
        
        // Lägg till varje övning i CSV-strängen, inklusive embedding-värdena
        csvContent += `${exercise.exercise_name},${exercise.target_muscle_group},${description},${exercise.swe_exercise_name},${exercise.swe_target_muscle_group},${sweDescription},"[${exercise.embedding.join(", ")}]"\n`;
    });

    // Skriv den färdiga CSV-strängen till en fil
    fs.writeFileSync(outputFileName, csvContent, 'utf8');
    console.log(`CSV file created: ${outputFileName}`);  // Loggar att filen har skapats
}

// Skapa CSV-fil med 1024-dimensionella embeddings
createCSV(exercises, 'exercise_embeddings.csv');  // Kallar på funktionen för att skapa CSV-filen