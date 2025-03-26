const express = require('express');
const app = express();

app.use(express.json());

let questions = []; // Speichert Fragen und Antworten

// Vorgefertigter Fragenkatalog
const questionsCatalog = [
    "Ist die Erde rund?",
    "Kann ein Mensch ohne Schlaf überleben?",
    "Ist Wasser nass?",
    "Gibt es Leben auf dem Mars?",
    "Kann man in der Schwerelosigkeit weinen?"
];

// 1️⃣ Eine neue Frage zufällig aus dem Katalog ziehen
app.get('/api/question/random', (req, res) => {
    const randomIndex = Math.floor(Math.random() * questionsCatalog.length);
    const text = questionsCatalog[randomIndex];

    const newQuestion = { 
        id: questions.length + 1, 
        text, 
        yes: 0, 
        no: 0 
    };
    
    questions.push(newQuestion);
    res.status(201).json(newQuestion);
});

// 2️⃣ Auf eine Frage antworten (Ja/Nein)
app.post('/api/question/:id/answer', (req, res) => {
    const { id } = req.params;
    const { answer } = req.body;

    const question = questions.find(q => q.id === parseInt(id));
    if (!question) return res.status(404).json({ error: 'Frage nicht gefunden' });

    if (answer === "yes") question.yes++;
    else if (answer === "no") question.no++;
    else return res.status(400).json({ error: 'Antwort muss "yes" oder "no" sein' });

    res.json({ message: 'Antwort gespeichert', question });
});

// 3️⃣ Statistik abrufen
app.get('/api/question/:id/stats', (req, res) => {
    const { id } = req.params;
    const question = questions.find(q => q.id === parseInt(id));
    if (!question) return res.status(404).json({ error: 'Frage nicht gefunden' });

    const total = question.yes + question.no;
    const yesPercent = total > 0 ? ((question.yes / total) * 100).toFixed(2) : 0;
    const noPercent = total > 0 ? ((question.no / total) * 100).toFixed(2) : 0;

    res.json({ 
        question: question.text, 
        total_votes: total, 
        yes: `${yesPercent}%`, 
        no: `${noPercent}%` 
    });
});

// Server starten
app.listen(3000, () => console.log('API läuft auf Port 3000'));
