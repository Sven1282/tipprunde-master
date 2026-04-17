const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const app = express();
const path = require('path');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.use(express.json());
app.use(express.static('public'));

app.post('/save-tip', async (req, res) => {
    const { user, matchId, tip } = req.body;
    await supabase.from('tips').upsert({ user_id: user, match_id: matchId, tip_result: tip });
    res.json({ success: true });
});

app.listen(process.env.PORT || 3000);
