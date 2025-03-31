// query.js
// Importera nödvändiga bibliotek
const { HfInference } = require("@huggingface/inference");  // Importera Hugging Face-biblioteket för att interagera med deras API
const { supabase } = require('./supabaseClient.js'); // Importera Supabase-klienten för att interagera med databasen

// Token för Hugging Face API, hämtas från miljövariabler
const hfToken = process.env.HUGGING_FACE_ACCESS_TOKEN;
// Skapa en instans av Hugging Face-klienten
const hfClient = new HfInference(hfToken);

// Funktion för att söka efter liknande övningar baserat på en användarfråga
async function searchSimilarExercises(query) {
    try {
        // Logga för att indikera att vi börjar generera embedding för frågan
        console.log("Genererar embedding för frågan:", query);

        // Anropa Hugging Face API för att generera en embedding baserat på användarens fråga
        const result = await hfClient.featureExtraction({
            model: "sentence-transformers/all-MiniLM-L6-v2", // Modell som används för att generera embedding
            inputs: query  // Användarens fråga som input
        });

        // Extrahera embedding från resultatet
        const queryEmbedding = result[0];
        
        // Kontrollera om embedding genererades, om inte kasta ett fel
        if (!queryEmbedding || queryEmbedding.length === 0) {
            throw new Error("Ingen embedding genererades!");
        }

        // Logga den genererade embeddingen för felsökning
        console.log("Embedding genererad:", queryEmbedding);

        // Anropa Supabase och kör en RPC (Remote Procedure Call) för att söka efter liknande övningar
        // `search_similar_exercises` är en funktion i Supabase som söker övningar baserat på den genererade embedding
        const { data, error } = await supabase.rpc("search_similar_exercises", {
            query_embedding: queryEmbedding,  // Skicka den genererade embedding som parameter till Supabase
        });

        // Kontrollera om något fel inträffade vid Supabase-anropet
        if (error) {
            throw new Error(error.message);
        }

        // Om inget fel inträffar, returnera de hittade övningarna
        return data;
    } catch (error) {
        // Om ett fel inträffar vid någon punkt, logga det och returnera null
        console.error("Fel vid sökning efter liknande övningar:", error);
        return null;
    }
}

// Exportera funktionen för att kunna använda den i andra delar av appen
module.exports = { searchSimilarExercises };
