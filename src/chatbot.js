// // /src/chatbot.js

// Importerar 'axios' för att kunna göra HTTP-anrop (POST-förfrågningar)
const axios = require('axios');  // Importera axios för HTTP-anrop

// Funktion för att hämta embedding för en given fråga
async function getEmbedding(query) {
  try {
    // Gör ett POST-anrop till Python API:t för att få embedding baserat på frågan
    const response = await axios.post('http://localhost:5000/generate_embedding', { query });
    return response.data.embedding;  // Returnera embedding från Python API (från svaret)
  } catch (error) {
    // Fångar eventuella fel vid anropet och loggar det i konsolen
    console.error('Error generating embedding:', error);
    return null;  // Om något gick fel, returnera null
  }
}

// Funktion som hanterar användarens fråga och skickar tillbaka embedding
async function chatbotResponse(req, res) {
  // Extraherar användarens fråga från HTTP-requestens body
  const userQuery = req.body.query;

  // Anropa Python API för att få embedding för frågan
  const embedding = await getEmbedding(userQuery);

  if (embedding) {
    // Om embedding genererades korrekt, skicka tillbaka den till klienten som JSON
    res.json({ embedding });
  } else {
    // Om embedding inte kunde genereras, skicka tillbaka ett felmeddelande (500-status)
    res.status(500).json({ error: 'Could not generate embedding' });
  }
}

// Exporterar funktionen 'chatbotResponse' så att den kan användas i andra filer (t.ex. som en API-hanterare)
module.exports = { chatbotResponse };
