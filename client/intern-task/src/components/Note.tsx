import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import "./Note.css";

interface Note {
    id: number;
    title: string;
    content: string;
}

export const Note: React.FC = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [formData, setFormData] = useState({ id: 0, title: '', content: '' });
    const [formEditData, setFormEditData] = useState({ id: 0, title: '', content: '' });
    const [error, setError] = useState<string>('');
    const [editMode, setEditMode] = useState<number | null>(null);

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const response = await axios.get<Note[]>('http://localhost:3000/notes');
            setNotes(response.data);
        } catch (err) {
            console.error('Error fetching notes:', err);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEditChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormEditData({ ...formEditData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (editMode === null) {
                if (!formData.title || !formData.content) {
                    setError('Title and content are required');
                    return;
                }
            }
            if (editMode !== null) {
                await axios.put(`http://localhost:3000/notes/${formEditData.id}`, formEditData);
                setEditMode(null);
            } else {
                await axios.post('http://localhost:3000/notes', formData);
            }
            fetchNotes();
            setFormData({ id: 0, title: '', content: '' });
            setError('');
        } catch (err) {
            console.error('Error submitting note:', err);
            setError('Something went wrong');
        }
    };

    const handleEdit = (note: Note) => {
        setFormEditData(note);
        setEditMode(note.id);
    };

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`http://localhost:3000/notes/${id}`);
            fetchNotes();
        } catch (err) {
            console.error('Error deleting note:', err);
        }
    };

    return (
        <>
            <div className="note-container">
                <div className="note-form">
                    <h1>Notes App</h1>
                    <form className='form' onSubmit={handleSubmit}>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Title" />
                        <textarea name="content" value={formData.content} onChange={handleChange} placeholder="Content"></textarea>
                        <button type="submit">{'Submit'}</button>
                    </form>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </div>
                <div className="note-list">
                    {notes.map((note) => (
                        <div className="note-item" key={note.id}>
                            {editMode === note.id ? (
                                <form className='form' onSubmit={handleSubmit}>
                                    <input type="text" name="title" value={formEditData.title} onChange={handleEditChange} placeholder="Title" />
                                    <textarea name="content" value={formEditData.content} onChange={handleEditChange} placeholder="Content"></textarea>
                                    <button type="submit">Save</button>
                                    <button onClick={() => setEditMode(null)}>Cancel</button>
                                </form>
                            ) : (
                                <>
                                    <div>{note.title}</div>
                                    <div>{note.content}</div>
                                    <button onClick={() => handleEdit(note)}>Edit</button>
                                    <button onClick={() => handleDelete(note.id)}>Delete</button>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div >
        </>
    );
};

export default Note;
