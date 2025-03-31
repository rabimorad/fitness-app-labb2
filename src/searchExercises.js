// searchExercises.js
// Importera Supabase-klienten och den funktion som genererar embedding
const { supabase } = require('./supabaseClient');
const { generateEmbedding } = require('./embedding');

// Funktion för att hämta och söka övningar baserat på användarens fråga
async function searchExercises(query) {
  // Generera embedding för användarens fråga
  const queryEmbedding = await generateEmbedding(query);

  // Om ingen embedding genererades (t.ex. om det blev ett fel), returnera en tom array
  if (!queryEmbedding) {
    return [];
  }

  // Hämta alla övningar från Supabase-databasen
  const { data: exercises, error } = await supabase.from('exercises').select('*');

  // Om ett fel inträffade vid hämtning av övningarna, logga felet och returnera en tom array
  if (error) {
    console.error('Error fetching exercises:', error);
    return [];
  }

  // Beräkna likheten mellan användarens fråga (queryEmbedding) och varje övning
  const topMatches = exercises.map((exercise) => {
    return {
      exercise_name: exercise.exercise_name,  // Övningens namn
      target_muscle_group: exercise.target_muscle_group,  // Muskelgrupp för övningen
      description: exercise.description,  // Beskrivning av övningen
      similarity_score: calculateCosineSimilarity(queryEmbedding, exercise.embedding),  // Likhetspoäng baserat på embedding
    };
  });

  // Sortera övningarna efter likhetspoäng (från högsta till lägsta)
  topMatches.sort((a, b) => b.similarity_score - a.similarity_score);

  // Returnera de 10 bästa övningarna baserat på likhet
  return topMatches.slice(0, 10);
}

// Funktion för att beräkna kosinuslikhet mellan två vektorer (embeddings)
function calculateCosineSimilarity(vec1, vec2) {
  // Beräkna skalärprodukten mellan de två vektorerna
  const dotProduct = vec1.reduce((acc, val, index) => acc + val * vec2[index], 0);

  // Beräkna magnituden (längden) för varje vektor
  const magnitude1 = Math.sqrt(vec1.reduce((acc, val) => acc + val * val, 0));
  const magnitude2 = Math.sqrt(vec2.reduce((acc, val) => acc + val * val, 0));

  // Om någon av vektorerna har noll längd (magnitud), returnera 0 eftersom de är helt olika
  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0;
  }

  // Beräkna och returnera kosinuslikheten (dot product / (magnitude1 * magnitude2))
  return dotProduct / (magnitude1 * magnitude2);
}

// Exportera funktionen så den kan användas i andra delar av appen
module.exports = { searchExercises };

