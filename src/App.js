import './App.scss';
import React, { useState, useReducer, useEffect } from 'react';
import { v4 as uuid } from 'uuid';

const initialNoteState = {
  lastNoteCreated: null,
  totalNotes: 0,
  notes: JSON.parse(localStorage.getItem('myNotes')) || [],
};

const notesReducer = (prevState, action) => {
  switch (action.type) {
    case 'ADD_NOTE': {
      const newState = {
        lastNoteCreated: new Date().toTimeString().slice(0, 8),
        totalNotes: prevState.notes.length + 1,
        notes: [...prevState.notes, action.payload],
      };
      console.log('after add_note:', newState);
      return newState;
    }

    case 'DELETE_NOTE':
      return {
        lastNoteCreated: prevState.lastNoteCreated,
        totalNotes: prevState.notes.length - 1,
        notes: action.payload,
      };

    default:
      return prevState;
  }
};

function App() {
  //hooks
  const [noteInput, setNoteInput] = useState('');
  const [notesState, dispatch] = useReducer(notesReducer, initialNoteState);

  const addNote = (e) => {
    e.preventDefault();
    if (!noteInput) return;

    const newNote = {
      id: uuid(),
      text: noteInput,
      rotate: Math.floor(Math.random() * 20),
      positionLeft: e.target.style.left,
      positionTop: e.target.style.top,
    };

    dispatch({ type: 'ADD_NOTE', payload: newNote });
    setNoteInput('');
  };

  useEffect(() => {
    localStorage.setItem('myNotes', JSON.stringify(notesState.notes));
  }, [notesState.notes]);

  const dropNote = (e) => {
    // setting notes position when dropping
    e.target.style.left = `${e.pageX - 50}px`;
    e.target.style.top = `${e.pageY - 50}px`;

    //getting all notes from local storage
    let notesFromStorage = notesState.notes;

    //updateing notes position
    const updatedNote = notesFromStorage.find((note) => {
      if (note.id === e.target.id) {
        note.positionLeft = e.target.style.left;
        note.positionTop = e.target.style.top;
        return note;
      }
      return null;
    });
    console.log(updatedNote);

    localStorage.setItem('myNotes', JSON.stringify(notesFromStorage));
  };

  const dragOver = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const deleteNote = (e) => {
    const notes = notesState.notes;
    const noteToDelete = notes.findIndex((note) => e.target.id === note.id);

    notes.splice(noteToDelete, 1);

    localStorage.setItem('myNotes', JSON.stringify(notes));
    dispatch({ type: 'DELETE_NOTE', payload: notes });
  };

  return (
    <div className="App" onDragOver={dragOver}>
      <h1>Sticky notes</h1>
      <form className="note-form" onSubmit={addNote}>
        <textarea
          name=""
          id=""
          cols="30"
          rows="10"
          placeholder="create new note"
          value={noteInput}
          onChange={(e) => setNoteInput(e.target.value)}
        ></textarea>
        <button>Add</button>
      </form>

      {notesState.notes.map((note) => (
        <div
          className="note"
          key={note.id}
          id={note.id}
          style={{
            transform: `rotate(${note.rotate}deg)`,
            left: note.positionLeft,
            top: note.positionTop,
          }}
          draggable="true"
          onDragEnd={dropNote}
          value={noteInput}
        >
          <p id={note.id} className="delete" onClick={deleteNote}>
            &#10008;
          </p>
          <pre className="text">{note.text}</pre>
        </div>
      ))}
    </div>
  );
}

export default App;
