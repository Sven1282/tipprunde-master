const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const app = express();

// Verbindung zu Supabase über Umgebungsvariablen
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.use(express.json());

// Statische Dateien aus dem "public" Ordner servieren
app.use(express.static(path.join(__dirname, 'public')));

// API-Endpunkt für die Daten (Matches und Profile)
app.get('/api/data', async (req, res) => {
    try {
        const { data: matches, error: mError } = await supabase.from('matches').select('*').order('match_date', { ascending: true });
        const { data: profiles, error: pError } = await supabase.from('profiles').select('*');
        
        if (mError || pError) throw (mError || pError);
        
        res.json({ matches, profiles });
    } catch (err) {
        console.error("API Fehler:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// Diese Route ist jetzt kompatibel mit Node v22 (ohne das verbotene Sternchen)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Port-Bindung für Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server läuft fehlerfrei auf Port ${PORT}`);
});
