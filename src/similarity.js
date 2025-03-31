// similarity.js

// Funktion för att beräkna kosinuslikhet mellan två vektorer
function cosineSimilarity(vec1, vec2) {
  // Om någon av vektorerna är null/undefined eller har olika längder, returnera 0 (ingen likhet)
  if (!vec1 || !vec2 || vec1.length !== vec2.length) return 0;

  // Beräkna skalärprodukten (dot product) mellan vektorerna
  const dotProduct = vec1.reduce((acc, val, index) => acc + val * vec2[index], 0);

  // Beräkna magnituden (längden) av första vektorn
  const magnitude1 = Math.sqrt(vec1.reduce((acc, val) => acc + val * val, 0));

  // Beräkna magnituden (längden) av andra vektorn
  const magnitude2 = Math.sqrt(vec2.reduce((acc, val) => acc + val * val, 0));

  // Returnera kosinuslikheten mellan de två vektorerna
  return dotProduct / (magnitude1 * magnitude2);
}

// Exportera funktionen så att den kan användas i andra delar av appen
module.exports = { cosineSimilarity };
