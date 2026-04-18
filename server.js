const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const app = express();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/data', async (req, res) => {
    try {
        const { data: matches } = await supabase.from('matches').select('*').order('match_date', { ascending: true });
        const { data: profiles } = await supabase.from('profiles').select('*');
        res.json({ matches: matches || [], profiles: profiles || [] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log('Server OK'));
