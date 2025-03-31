# Fitness App

En webbaserad app som hjälper användare att hitta övningar baserat på specifika muskelgrupper. Användare kan ställa frågor om övningar för olika muskelgrupper på både svenska och engelska. Appen använder Flask som backend och en SPA-lösning med Vite för frontend.

## Funktioner

- **Sökfunktion:** Användare kan skriva en fråga för att få rekommendationer om övningar för specifika muskelgrupper.
- **Responsiv design:** Appen är mobilvänlig och fungerar bra på både små och stora skärmar.
- **Interaktivt gränssnitt:** Visar information om övningar, inklusive videor, beskrivningar och svårighetsgrad.
- **Backend:** Flask hanterar backend-logik och CORS-förfrågningar.

## Installation

### Förberedelser

För att köra appen lokalt behöver du ha Python och Node.js installerade på din dator.

### Backend (Flask)

1. Klona repositoryn och gå till backend-mappen:
   ```bash
   git clone https://github.com/rabimorad/fitness-app-labb2.git
   cd fitness-app-labb2
   ```

2. Skapa och aktivera en virtuell miljö:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # På Windows: venv\Scripts\activate
   ```

3. Installera Flask och övriga beroenden:
   ```bash
   pip install -r requirements.txt
   ```

4. Starta Flask-servern:
   ```bash
   python app.py
   ```
   Flask-servern bör nu vara igång på http://localhost:5000.

### Frontend (Vite)

1. Gå till frontend-mappen och installera beroenden:
   ```bash
   cd frontend
   npm install
   ```

2. Skapa en `server.js`-fil i frontend-mappen för att hantera proxy mellan frontend och backend. Filen ska se ut så här:

   ```js
   // server.js
   const { createServer } = require("vite");

   createServer({
     server: {
       proxy: {
         "/api": "http://localhost:5000", // Proxy till Flask-backend
       },
     },
   }).then(server => {
     server.listen(3000, () => {
       console.log("Vite server is running at http://localhost:3000");
     });
   });
   ```

3. Starta Node.js-servern:
   ```bash
   node server.js
   ```

   Detta kommer att starta servern på port 3000 och proxy all trafik från `/api` till Flask-backend på port 5000.

4. Starta Vite-servern separat:
   ```bash
   npm run dev
   ```

   Vite-servern bör nu vara igång på http://localhost:5173 och din frontend kommer att kommunicera med Flask-backend via den proxy som definierats.

## Användning

När appen är igång kan du öppna den i din webbläsare genom att gå till http://localhost:5173.

1. Skriv en fråga i sökfältet (t.ex. "bröst" eller "chest").
2. Klicka på "Sök" för att få rekommendationer om övningar för den specifika muskelgruppen.
3. Resultatet visar en lista med övningar, beskrivningar och länkar till videor på YouTube.

## Teknologier

- **Frontend:** HTML, CSS, JavaScript (Vite)
- **Backend:** Python, Flask, SpaCy (för NLP)
- **Databas:** Ingen databas (data lagras i minnet som JSON-objekt)
- **CORS:** Hanteras genom Flask-CORS för att tillåta kommunikation mellan frontend och backend.

## Flöde

1. Användaren skriver en fråga i sökfältet.
2. Frontend skickar en POST-begäran till Flask-backend med frågan.
3. Backend använder NLP (SpaCy) för att identifiera muskelgruppen och returnera en lista med övningar.
4. Frontend visar övningarna på sidan, inklusive beskrivningar och YouTube-länkar.

## Förbättringsförslag

- Lägg till en riktig databas för att lagra övningarna.
- Lägg till fler övningar och muskelgrupper.
- Förbättra NLP-modellen för att hantera mer komplexa frågor.
- Implementera användarautentisering för att spara favoritövningar.

