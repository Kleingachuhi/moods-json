const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Load your db.json file
const dbPath = path.join(__dirname, 'db.json');

// Endpoint to get moods
app.get('/moods', (req, res) => {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read the database file' });
    }
    const db = JSON.parse(data);
    res.json(db.moods);
  });
});

// Endpoint to save new mood (this will just add to the in-memory object and send a response)
app.post('/moods', (req, res) => {
  const newMood = req.body;
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read the database file' });
    }
    const db = JSON.parse(data);
    db.moods.push(newMood);

    fs.writeFile(dbPath, JSON.stringify(db, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to save the new mood' });
      }
      res.status(201).json(newMood);
    });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
