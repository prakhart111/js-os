import React, { useState, useEffect } from "react";
import { withWindow } from "../../system/windowManager";
import { Note, loadNotes, saveNote, deleteNote, createNote } from "./persist";
import { Save, Trash, Plus } from "lucide-react";

const NotesComponent: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  useEffect(() => {
    const loadedNotes = loadNotes();
    setNotes(loadedNotes);
    if (loadedNotes.length > 0) {
      setSelectedNote(loadedNotes[0]);
    }
  }, []);

  const handleSave = () => {
    if (selectedNote) {
      const updatedNotes = saveNote(notes, selectedNote);
      setNotes(updatedNotes);
      setUnsavedChanges(false);
    }
  };

  const handleDelete = () => {
    if (selectedNote) {
      const updatedNotes = deleteNote(notes, selectedNote.id);
      setNotes(updatedNotes);
      setSelectedNote(updatedNotes[0] || null);
      setUnsavedChanges(false);
    }
  };

  const handleCreate = () => {
    const updatedNotes = createNote(notes);
    setNotes(updatedNotes);
    setSelectedNote(updatedNotes[0]);
    setUnsavedChanges(false);
  };

  const updateNoteContent = (content: string) => {
    if (selectedNote) {
      setSelectedNote({ ...selectedNote, content });
      setUnsavedChanges(true);
    }
  };

  const updateNoteTitle = (title: string) => {
    if (selectedNote) {
      setSelectedNote({ ...selectedNote, title });
      setUnsavedChanges(true);
    }
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">Notes</h2>
          <button
            onClick={handleCreate}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title="New Note"
          >
            <Plus size={20} className="text-gray-300" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1">
          {notes.map((note) => (
            <button
              key={note.id}
              onClick={() => {
                if (unsavedChanges) {
                  if (window.confirm("You have unsaved changes. Continue?")) {
                    setSelectedNote(note);
                    setUnsavedChanges(false);
                  }
                } else {
                  setSelectedNote(note);
                }
              }}
              className={`w-full text-left p-3 border-b border-gray-700 hover:bg-gray-700 transition-colors ${
                selectedNote?.id === note.id ? "bg-gray-700" : ""
              }`}
            >
              <h3 className="text-white font-medium truncate">{note.title}</h3>
              <p className="text-gray-400 text-sm truncate">{note.content}</p>
              <p className="text-gray-500 text-xs mt-1">
                {new Date(note.lastModified).toLocaleDateString()}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col bg-gray-900">
        {selectedNote ? (
          <>
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <input
                type="text"
                value={selectedNote.title}
                onChange={(e) => updateNoteTitle(e.target.value)}
                className="bg-transparent text-white text-lg font-semibold focus:outline-none"
                placeholder="Note title"
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className={`p-2 rounded-lg transition-colors ${
                    unsavedChanges
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                  title="Save"
                >
                  <Save size={20} className="text-white" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 bg-gray-700 hover:bg-red-600 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash size={20} className="text-white" />
                </button>
              </div>
            </div>
            <textarea
              value={selectedNote.content}
              onChange={(e) => updateNoteContent(e.target.value)}
              className="flex-1 w-full bg-transparent text-white p-4 resize-none focus:outline-none"
              placeholder="Start typing your note..."
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            No note selected
          </div>
        )}
      </div>
    </div>
  );
};

const WrappedNotes = withWindow(NotesComponent, {
  id: "notes",
  title: "Notes",
  defaultPosition: { x: 250, y: 150 },
  defaultSize: { width: 800, height: 600 },
  minSize: { width: 400, height: 300 },
});

export default WrappedNotes;
