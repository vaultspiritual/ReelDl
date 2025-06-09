const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/api/download", async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "No URL provided" });

    try {
        const response = await axios.get(url, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
            },
        });

        const html = response.data;
        const match = html.match(/"video_url":"([^"]+)"/);

        if (match && match[1]) {
            const videoUrl = match[1].replace(/\\u0026/g, "&").replace(/\\/g, "");
            return res.json({ videoUrl });
        } else {
            return res.status(500).json({ error: "Failed to fetch Instagram media." });
        }
    } catch (error) {
        return res.status(500).json({ error: "Failed to fetch Instagram media." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
