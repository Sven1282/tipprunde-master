const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const app = express();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Die wichtigste Schnittstelle: Holt Spiele aus deiner Datenbank
app.get('/api/data', async (req, res) => {
    try {
        const { data: matches, error } = await supabase.from('matches').select('*').order('match_date', { ascending: true });
        if (error) throw error;
        res.json({ matches });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log('Server läuft auf Port ' + PORT));
