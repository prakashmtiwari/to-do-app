const express = require('express');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const BACKENDPORT = process.env.BACKENDPORT || 5000;
const BACKENDHOST = process.env.BACKENDHOST || 'localhost';

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let todos = [];
let idCounter = 1;

// Serve the form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle form submission
app.post('/todo', async (req, res) => {
  const { name, description } = req.body;

  const id = idCounter++;
  const uuid = uuidv4();
  const hash = crypto
    .createHash('sha256')
    .update(`${name}-${uuid}`)
    .digest('hex')
    .slice(0, 12);

  const todo = { id, uuid, hash, name, description };

  try {
    // Forward to Flask backend
    console.log('Forwarding to Flask:', todo);
    const flaskRes = await fetch(`http://${BACKENDHOST}:${BACKENDPORT}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo)
    });

    const flaskData = await flaskRes.json();
    res.json({ success: true, todo: flaskData });

  } catch (err) {
    console.error('Flask error:', err.message);
    res.status(502).json({ success: false, error: 'Could not reach Flask backend' });
  }
});

//get all todos
app.get('/todos', async (req, res) => {
  try {
    const flaskRes = await fetch(`http://${BACKENDHOST}:${BACKENDPORT}/todos`);
    const flaskData = await flaskRes.json();
    res.json(flaskData);
  } catch (err) {
    console.error('Flask error:', err.message);
    res.status(502).json({ success: false, error: 'Could not reach Flask backend' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
