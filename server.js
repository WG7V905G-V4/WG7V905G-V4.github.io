const express = require('express');
const cors = require('cors');
const fs = require("node:fs");

const app = express();
const port = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';

app.use(cors());
app.use(express.json());

const DB_FILE = 'base.json';

function ensureDatabaseExists() {
    if (!fs.existsSync(DB_FILE)) {
        console.log('Database file not found. Creating new one...');
        fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf8');
        console.log('Database file created successfully');
    }
}

ensureDatabaseExists();

app.get("/api/data/:user", (req, res) => {
    ensureDatabaseExists();

    fs.readFile(DB_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read data' });
        }

        let obj;
        try {
            obj = JSON.parse(data);
        } catch (parseError) {
            console.error('Invalid JSON, recreating file');
            fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf8');
            obj = [];
        }

        const id = String(req.params.user);
        const answer = obj.find(item => item.user === id);

        if (answer) {
            return res.status(200).json({
                value: answer.value
            });
        } else {
            return res.status(200).json({
                value: 0
            });
        }
    });
});

app.post("/api/data", (req, res) => {
    const { user, value } = req.body;

    const userId = String(user);
    const numValue = Number(value);

    if (isNaN(numValue)) {
        return res.status(400).json({ error: 'Value must be a number' });
    }

    console.log('Получены данные:', userId, numValue);

    ensureDatabaseExists();

    fs.readFile(DB_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read data' });
        }

        let obj;
        try {
            obj = JSON.parse(data);
        } catch (parseError) {
            console.error('Invalid JSON, starting fresh');
            obj = [];
        }

        const index = obj.findIndex(item => item.user === userId);

        if (index !== -1) {
            obj[index].value = numValue;
        } else {
            obj.push({ user: userId, value: numValue });
        }

        fs.writeFile(DB_FILE, JSON.stringify(obj, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to save data' });
            }
            res.status(200).json({ success: true, user: userId, value: numValue });
        });
    });
});

app.listen(port, host, () => {
    console.log(`Server listening on http://${host}:${port}`);
});

app.get("/api/data/ping", (req, res) => {
    res.json({ status: 'alive', time: new Date().toISOString() });
});