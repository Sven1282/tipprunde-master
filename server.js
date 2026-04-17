const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const app = express();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.use(express.json());
app.use(express.static('public'));

// Holt alle Spiele inklusive der Tipps von Sven, Melli und S.P.
app.get('/api/matches', async (req, res) => {
    const { data: matches } = await supabase.from('matches').select('*').order('match_date', { ascending: true });
    const { data: tips } = await supabase.from('tips').select('*');
    res.json({ matches, tips });
});

// Speichert einen neuen Tipp
app.post('/api/save-tip', async (req, res) => {
    const { user, matchId, tip } = req.body;
    await supabase.from('tips').upsert({ user_id: user, match_id: matchId, tip_result: tip }, { onConflict: 'user_id,match_id' });
    res.json({ success: true });
});

app.listen(process.env.PORT || 3000);
