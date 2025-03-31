require('dotenv').config();  // Laddar miljövariabler från en .env-fil för att säkerställa att känslig information (t.ex. API-nycklar) hålls privat
const express = require('express');  // Importera Express, som hjälper till att skapa HTTP-servern
const axios = require('axios');  // Importera axios för att göra HTTP-anrop till Flask-servern
const cors = require('cors');  // Importera CORS för att tillåta externa domäner att kommunicera med servern

const app = express();  // Skapa en Express-app
const port = 3000;  // Sätt porten där servern ska lyssna

// Middleware för att kunna läsa JSON-data i inkommande förfrågningar
app.use(express.json());

// Aktivera CORS för att tillåta förfrågningar från andra domäner
app.use(cors());

// Funktion för att hämta embedding från Flask-servern
async function getEmbedding(query) {
  try {
    console.log("Sending user query to backend:", query);  // Logga användarens fråga för felsökning
    // Skicka en POST-förfrågan till Flask-servern (som kör på port 5000) för att få en embedding för användarens fråga
    const response = await axios.post('http://localhost:5000/generate_embedding', { query });
    console.log("Response from Flask:", response.data);  // Logga svaret från Flask-servern
    return response.data.embedding;  // Returnera den genererade embedding (en vektor)
  } catch (error) {
    console.error("Error fetching chatbot response:");
    // Felsökning baserat på olika feltyper
    if (error.response) {
      console.error('Error response from Flask:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Error with request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    return null;  // Returnera null om något gick fel
  }
}

// Route för att ta emot användarens fråga via POST och få en embedding
app.post('/chatbot', async (req, res) => {
  const userQuery = req.body.query;  // Hämta frågan från frontend (från body i POST-förfrågan)
  console.log('Received query from frontend:', userQuery);  // Logga frågan för felsökning

  try {
    // Hämta embedding genom att kalla på Flask-servern
    const embedding = await getEmbedding(userQuery);
    if (embedding) {
      console.log('Sending embedding response to frontend:', embedding);  // Logga embedding innan det skickas tillbaka till frontend
      res.json({ embedding });  // Skicka tillbaka embedding som svar till frontend i JSON-format
    } else {
      console.error('No embedding received from Flask');  // Om embedding inte kan tas emot, logga och skicka felmeddelande
      throw new Error('Failed to generate embedding');
    }
  } catch (error) {
    console.error('Error in chatbot response:', error);  // Logga fel om något går fel vid processen
    res.status(500).json({ error: error.message || 'Internal Server Error' });  // Skicka ett felmeddelande tillbaka till frontend om något går fel
  }
});

// Starta servern och lyssna på den specificerade porten
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);  // Logga när servern är igång och lyssnar på porten
});
