const express = require('express');
const cors = require('cors')
const { v4: uuidv4 } = require('uuid')
const app = express();
const PORT = 3000;

app.use(cors());

let notes = [];

app.use(express.json());

app.get('/notes', (req, res) => {
    res.json(notes);
});

app.get('/notes/:id', (req, res) => {
    const id = req.params.id;
    const note = notes.find(note => note.id === parseInt(id));
    if (!note) {
        return res.status(404).json({ message: 'Note not found' });
    }
    res.json(note);
});

app.post('/notes', (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required' });
    }
    const newNote = {
        id: uuidv4(),
        title,
        content
    };
    notes.push(newNote);
    res.status(201).json(newNote);
});

app.put('/notes/:id', (req, res) => {
    const id = req.params.id;
    const { title, content } = req.body;
    const index = notes.findIndex(note => note.id === id);
    if (index === -1) {
        return res.status(404).json({ message: 'Note not found' });
    }
    notes[index] = {
        ...notes[index],
        title: title || notes[index].title,
        content: content || notes[index].content
    };
    res.json(notes[index]);
});

app.delete('/notes/:id', (req, res) => {
    const id = req.params.id;
    const index = notes.findIndex(note => note.id === id);
    if (index === -1) {
        return res.status(404).json({ message: 'Note not found' });
    }
    notes.splice(index, 1);
    res.sendStatus(204);
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong' });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});