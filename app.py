from flask import Flask, request, jsonify
import spacy
from flask_cors import CORS  # För att hantera CORS och tillåta förfrågningar från andra domäner

# Skapar en Flask-app
app = Flask(__name__)

# Aktiverar CORS (Cross-Origin Resource Sharing) för alla domäner (vilket gör att appen kan ta emot förfrågningar från andra domäner)
CORS(app, resources={r"/*": {"origins": "*"}})

# Laddar en SpaCy-modell för enklare NLP (Natural Language Processing) behandling
nlp = spacy.load("en_core_web_sm")

# Översättningstabell mellan svenska och engelska muskelgrupper
translation_dict = {
    "bröst": "chest",
    "rygg": "back",
    "ben": "legs",
    "armer": "arms",
    "axlar": "shoulders"
}

# Utökad databas med fler övningar och detaljer
exercises = {
    "chest": [
        {
            "exercise_name": "Bänkpress",
            "description": "En övning för att stärka bröstmuskulaturen.",
            "target_muscle_group": "Bröst",
            "difficulty": "Medium",
            "video_url": "https://www.youtube.com/watch?v=2FJzXqGzT5Q"
        },
        {
            "exercise_name": "Hantelpress",
            "description": "En övning för att stärka bröst och axlar.",
            "target_muscle_group": "Bröst",
            "difficulty": "Medium",
            "video_url": "https://www.youtube.com/watch?v=B4B4Bzv51i4"
        },
        {
            "exercise_name": "Flyes",
            "description": "En övning som tränar bröstmusklerna och ökar flexibilitet i bröstet.",
            "target_muscle_group": "Bröst",
            "difficulty": "Medium",
            "video_url": "https://www.youtube.com/watch?v=1M04YvvE2VA"
        }
    ],
    "back": [
        {
            "exercise_name": "Marklyft",
            "description": "En övning för att stärka hela ryggen och benmuskulaturen.",
            "target_muscle_group": "Rygg",
            "difficulty": "Hög",
            "video_url": "https://www.youtube.com/watch?v=ytGaGIn3SjE"
        },
        {
            "exercise_name": "Chins",
            "description": "En övning som fokuserar på ryggen och armarna.",
            "target_muscle_group": "Rygg",
            "difficulty": "Hög",
            "video_url": "https://www.youtube.com/watch?v=UA-BN_dqRg8"
        },
        {
            "exercise_name": "Lat Pulldown",
            "description": "En övning för att bygga ryggmuskler och stärka latissimus dorsi.",
            "target_muscle_group": "Rygg",
            "difficulty": "Medium",
            "video_url": "https://www.youtube.com/watch?v=C2dYvEzr2Hs"
        }
    ],
    "legs": [
        {
            "exercise_name": "Knäböj",
            "description": "En övning för att stärka benmuskulaturen.",
            "target_muscle_group": "Ben",
            "difficulty": "Hög",
            "video_url": "https://www.youtube.com/watch?v=QH5fVxFFnOw"
        },
        {
            "exercise_name": "Utfall",
            "description": "En övning för att stärka lår och höfter.",
            "target_muscle_group": "Ben",
            "difficulty": "Medium",
            "video_url": "https://www.youtube.com/watch?v=QfHkm63STJ8"
        },
        {
            "exercise_name": "Benpress",
            "description": "En övning som tränar benmusklerna genom att pressa vikter bort från kroppen.",
            "target_muscle_group": "Ben",
            "difficulty": "Medium",
            "video_url": "https://www.youtube.com/watch?v=J0yVRw8Gz9E"
        }
    ],
    "arms": [
        {
            "exercise_name": "Biceps curl",
            "description": "En övning för att stärka biceps.",
            "target_muscle_group": "Armar",
            "difficulty": "Låg",
            "video_url": "https://www.youtube.com/watch?v=ykJmrZ5v0Oo"
        },
        {
            "exercise_name": "Triceps pushdown",
            "description": "En övning för att bygga triceps.",
            "target_muscle_group": "Armar",
            "difficulty": "Medium",
            "video_url": "https://www.youtube.com/watch?v=5bCk7bgQ0eI"
        },
        {
            "exercise_name": "Hammer curl",
            "description": "En övning som stärker biceps och underarmar.",
            "target_muscle_group": "Armar",
            "difficulty": "Medium",
            "video_url": "https://www.youtube.com/watch?v=ZWxdY5u9P9g"
        }
    ],
    "shoulders": [
        {
            "exercise_name": "Axelpress",
            "description": "En övning för att stärka axelmuskulaturen.",
            "target_muscle_group": "Axlar",
            "difficulty": "Medium",
            "video_url": "https://www.youtube.com/watch?v=6Z7AxO9GccI"
        },
        {
            "exercise_name": "Hantellyft",
            "description": "En övning för att bygga axelmusklerna.",
            "target_muscle_group": "Axlar",
            "difficulty": "Medium",
            "video_url": "https://www.youtube.com/watch?v=V2v43_lfNmE"
        },
        {
            "exercise_name": "Arnoldpress",
            "description": "En övning för att träna axlarna från flera vinklar.",
            "target_muscle_group": "Axlar",
            "difficulty": "Hög",
            "video_url": "https://www.youtube.com/watch?v=vj2w851pF2U"
        }
    ]
}


# Flask route för att hantera POST-förfrågningar på /ask_question
@app.route('/ask_question', methods=['POST'])
def ask_question():
    try:
        # Hämtar frågan från den inkommande JSON-data
        data = request.get_json()
        user_query = data['question'].lower()  # Gör frågan till små bokstäver för att undvika problem med stora/små bokstäver

        print(f"Received user query: {user_query}")  # Debugging: Skriv ut den mottagna frågan för att kontrollera att vi får rätt data

        # Kontrollera om frågan är på svenska och översätt den till engelska om det behövs
        if user_query in translation_dict:
            user_query = translation_dict[user_query]  # Översätt svenska till engelska

        print(f"Translated query: {user_query}")  # Debugging: Skriv ut den översatta frågan för att kontrollera översättningen

        # Försök att hitta en muskelgrupp i frågan genom att jämföra frågan med de definierade muskelgrupperna
        found_muscle_group = None
        for muscle_group in exercises.keys():
            if muscle_group in user_query:  # Om muskelgruppen finns i frågan, sätt den som den hittade muskelgruppen
                found_muscle_group = muscle_group
                break  # Avsluta loopen när vi har hittat en match

        if found_muscle_group:
            # Om vi har hittat en muskelgrupp, hämta den första övningen i listan för den gruppen
            exercise_info = exercises[found_muscle_group][0]  # Vi tar bara den första övningen som exempel
            return jsonify({
                # Vi returnerar ett JSON-objekt med övningens namn, beskrivning, svårighetsgrad, video-länk och översättningar
                "exercise_name": exercise_info["exercise_name"],
                "description": exercise_info["description"],
                "target_muscle_group": exercise_info["target_muscle_group"],
                "difficulty": exercise_info["difficulty"],
                "video_url": exercise_info["video_url"],
                "swe_exercise_name": exercise_info["exercise_name"],  # Svenska övningsnamn
                "swe_target_muscle_group": exercise_info["target_muscle_group"],  # Svenska muskelgrupper
                "swe_description": exercise_info["description"]  # Svenska beskrivningar
            })

        # Om vi inte hittar någon muskelgrupp i frågan, returnera ett svar om att ingen matchning hittades
        return jsonify({"answer": "Jag kunde inte hitta något svar på din fråga."})

    except Exception as e:
        # Om något går fel, fånga undantaget och logga det
        print(f"An error occurred: {e}")
        # Returnera ett felmeddelande i JSON-format till frontend
        return jsonify({"error": "Det uppstod ett fel vid bearbetning av frågan."}), 500


# Flask-applikationen startas när detta skript körs direkt
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)  # Kör appen på port 5000