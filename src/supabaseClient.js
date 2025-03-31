// supabaseClient.js

// Importera nödvändiga bibliotek
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();  // Ladda miljövariabler från .env-filen för att säkerställa att känsliga data inte hårdkodas

// Skapa en Supabase-klient med användning av miljövariabler för URL och API-nyckel
const supabaseUrl = process.env.SUPABASE_URL;  // URL till din Supabase-databas (sätts i .env)
const supabaseKey = process.env.SUPABASE_KEY;  // API-nyckeln för autentisering (sätts i .env)
const supabase = createClient(supabaseUrl, supabaseKey);  // Skapa en instans av Supabase-klienten

// Funktion för att hämta embeddings och mål (target) från Supabase
async function getEmbeddingsFromSupabase() {
  // Gör en query mot 'exercises'-tabellen för att hämta övningsnamn, embedding och målmuskelgrupp
  const { data, error } = await supabase
    .from('exercises')  // Anslut till 'exercises'-tabellen i databasen
    .select('exercise_name, embedding, target_muscle_group');  // Välj de kolumner du är intresserad av

  // Om det uppstår ett fel, logga det och returnera en tom array
  if (error) {
    console.error('Error fetching embeddings:', error);
    return [];
  }

  // Returnera den hämtade datan (alla övningar med deras namn, embedding och muskelgrupp)
  return data;
}

// Exportera Supabase-klienten och funktionen för att hämta embeddings
module.exports = { supabase, getEmbeddingsFromSupabase };



