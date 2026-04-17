const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const app = express();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.use(express.json());
app.use(express.static('public'));

// Punkte-Logik Engine
function calculatePoints(tip, real) {
    if (!tip || real === '-:-') return 0;
    const [th, ta] = tip.split(':').map(Number);
    const [rh, ra] = real.split(':').map(Number);
    if (th === rh && ta === ra) return 3; // Volltreffer
    if (Math.sign(th - ta) === Math.sign(rh - ra)) return 1; // Tendenz
    return 0;
}

app.get('/api/data', async (req, res) => {
    const { data: matches } = await supabase.from('matches').select('*').order('match_date');
    const { data: profiles } = await supabase.from('profiles').select('*').order('total_points', {ascending: false});
    res.json({ matches, profiles });
});

app.post('/api/tip', async (req, res) => {
    const { user, matchId, tip } = req.body;
    await supabase.from('tips').upsert({ user_id: user, match_id: matchId, tip_result: tip });
    res.json({ success: true });
});

app.listen(process.env.PORT || 3000);
