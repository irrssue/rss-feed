const express = require('express');
const Parser = require('rss-parser');
const cors = require('cors');

const app = express();
const parser = new Parser();
app.use(cors());

app.get('/feed', async (req, res) => {
    const feedUrl = req.query.url;
    if (!feedUrl) return res.status(400).json({ error: "URL is required" });

    try {
        const feed = await parser.parseURL(feedUrl);
        res.json(feed);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch RSS feed" });
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));