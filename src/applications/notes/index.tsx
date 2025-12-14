import React, { useState, useEffect } from "react";
import { withWindow } from "../../system/windowManager";
import { Note, loadNotes, saveNote, deleteNote, createNote } from "./persist";
import { SquarePen, Trash2, Search, Plus } from "lucide-react";

const NotesComponent: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  useEffect(() => {
    const loadedNotes = loadNotes();
    setNotes(loadedNotes);
    if (loadedNotes.length > 0) {
      setSelectedNote(loadedNotes[0]);
    }
  }, []);

  const handleSave = (note: Note) => {
    const updatedNotes = saveNote(notes, note);
    setNotes(updatedNotes);
  };

  const handleDelete = () => {
    if (selectedNote) {
      const updatedNotes = deleteNote(notes, selectedNote.id);
      setNotes(updatedNotes);
      setSelectedNote(updatedNotes[0] || null);
    }
  };

  const handleCreate = () => {
    const updatedNotes = createNote(notes);
    setNotes(updatedNotes);
    setSelectedNote(updatedNotes[0]);
  };

  const updateNoteContent = (content: string) => {
    if (selectedNote) {
      const updated = { ...selectedNote, content };
      setSelectedNote(updated);
      handleSave(updated);
    }
  };

  const updateNoteTitle = (title: string) => {
    if (selectedNote) {
      const updated = { ...selectedNote, title };
      setSelectedNote(updated);
      handleSave(updated);
    }
  };

  return (
    <div className="flex h-full bg-[#1e1e1e] text-white">
      {/* Sidebar */}
      <div className="w-64 bg-[#2C2C2C]/50 backdrop-blur-md border-r border-white/10 flex flex-col">
        <div className="p-3 border-b border-white/10 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1.5 text-gray-400" size={14} />
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full bg-black/20 rounded-md py-1 pl-8 pr-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-yellow-500/50"
            />
          </div>
          <button 
            onClick={handleCreate}
            className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-gray-400 hover:text-white"
            title="Create New Note"
          >
            <Plus size={18} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-2 space-y-1">
          {notes.length === 0 && (
            <div className="text-center text-gray-500 text-xs mt-4">
              No notes yet
            </div>
          )}
          {notes.map((note) => (
            <button
              key={note.id}
              onClick={() => setSelectedNote(note)}
              className={`w-full text-left p-3 rounded-lg transition-all ${
                selectedNote?.id === note.id 
                  ? "bg-[#D9A338] text-white shadow-sm" 
                  : "hover:bg-white/5 text-gray-300"
              }`}
            >
              <h3 className={`font-semibold text-sm truncate ${selectedNote?.id === note.id ? "text-white" : "text-white"}`}>
                {note.title || "New Note"}
              </h3>
              <div className="flex justify-between items-center mt-1">
                <span className={`text-xs truncate ${selectedNote?.id === note.id ? "text-white/80" : "text-gray-500"}`}>
                   {new Date(note.lastModified).toLocaleDateString()}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col bg-[#1e1e1e]">
        {selectedNote ? (
          <>
            <div className="p-4 flex justify-between items-center border-b border-white/5">
              <span className="text-xs text-gray-500">
                {new Date(selectedNote.lastModified).toLocaleString()}
              </span>
              <div className="flex space-x-2">
                 <button
                  onClick={handleCreate}
                  className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-gray-400 hover:text-white"
                  title="New Note"
                >
                  <SquarePen size={18} />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-gray-400 hover:text-red-400"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
              <input
                type="text"
                value={selectedNote.title}
                onChange={(e) => updateNoteTitle(e.target.value)}
                className="w-full bg-transparent text-2xl font-bold text-white mb-4 focus:outline-none placeholder-gray-600"
                placeholder="Title"
              />
              <textarea
                value={selectedNote.content}
                onChange={(e) => updateNoteContent(e.target.value)}
                className="w-full h-[calc(100%-4rem)] bg-transparent text-gray-300 text-base resize-none focus:outline-none leading-relaxed placeholder-gray-700"
                placeholder="Type something..."
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            <SquarePen size={48} className="mb-4 opacity-20" />
            <p className="mt-2">Select or create a note</p>
            <button 
              onClick={handleCreate}
              className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md text-sm transition-colors"
            >
              Create Note
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const WrappedNotes = withWindow(NotesComponent, {
  id: "notes",
  title: "Notes",
  defaultPosition: { x: 250, y: 100 },
  defaultSize: { width: 800, height: 500 },
  minSize: { width: 500, height: 300 },
});

export default WrappedNotes;
