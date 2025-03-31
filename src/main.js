// main.js
// Skriver ut ett meddelande i konsolen för att bekräfta att appen fungerar
console.log("Fitness appen funkar!!!");

// Initialiserar en tom array för meddelanden
let messages = [];

// Referens till container-elementet där resultaten ska visas
const chatContainer = document.getElementById("results");

// Lyssnar på klickhändelsen på sök-knappen
document.getElementById('search-btn').addEventListener('click', async function() {
  // Hämtar användarens inmatade fråga från textfältet
  const userQuery = document.getElementById('search-query').value;

  // Visar en laddningsindikator när förfrågan skickas
  document.getElementById('loading-indicator').style.display = 'block';

  try {
    // Loggar den användarens fråga som ska skickas till backend
    console.log("Sending user query to backend:", userQuery);

    // Skickar en POST-förfrågan till backend (server) med användarens fråga
    const response = await fetch('http://localhost:5000/ask_question', {
      method: 'POST',  // Använd POST-metod
      headers: {
        'Content-Type': 'application/json',  // Skickar JSON-data
      },
      body: JSON.stringify({ question: userQuery }),  // Skickar frågan som JSON
    });

    // Om servern inte svarar korrekt (t.ex. statuskod inte ok), kasta ett fel
    if (!response.ok) {
      throw new Error('Error fetching chatbot response');
    }

    // Om förfrågan lyckades, hämta JSON-data från svaret
    const data = await response.json();

    // Loggar det mottagna svaret för felsökning
    console.log("Received data:", data);

    // Döljer laddningsindikatorn när svaret är mottaget
    document.getElementById('loading-indicator').style.display = 'none';

    // Uppdaterar webbsidan med resultatet
    document.getElementById('results').innerHTML = `
      <h2>Övning: ${data.exercise_name}</h2>
      <p><strong>Muskelgrupp:</strong> ${data.target_muscle_group}</p>
      <p><strong>Svårighetsgrad:</strong> ${data.difficulty}</p>
      <p><strong>Beskrivning:</strong> ${data.description}</p>
      <h3>På Svenska:</h3>
      <p><strong>Övning:</strong> ${data.swe_exercise_name}</p>
      <p><strong>Muskelgrupp:</strong> ${data.swe_target_muscle_group}</p>
      <p><strong>Beskrivning:</strong> ${data.swe_description}</p>
      <p><a href="${data.video_url}" target="_blank">Titta på videon här</a></p>
    `;
  } catch (error) {
    // Fångar och loggar eventuella fel som kan ha uppstått under förfrågan
    console.error('Error fetching chatbot response:', error);

    // Döljer laddningsindikatorn om ett fel inträffar
    document.getElementById('loading-indicator').style.display = 'none';

    // Visar ett felmeddelande för användaren
    alert('Något gick fel, försök igen.');
  }
});

