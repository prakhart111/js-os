export interface Note {
  id: string;
  title: string;
  content: string;
  lastModified: number;
}

const STORAGE_KEY = "notes-app-data";

export const saveNotes = (notes: Note[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (error) {
    console.error("Error saving notes:", error);
  }
};

export const loadNotes = (): Note[] => {
  try {
    const notes = localStorage.getItem(STORAGE_KEY);
    return notes ? JSON.parse(notes) : [];
  } catch (error) {
    console.error("Error loading notes:", error);
    return [];
  }
};

export const saveNote = (notes: Note[], note: Note): Note[] => {
  const newNotes = notes.map((n) =>
    n.id === note.id ? { ...note, lastModified: Date.now() } : n
  );
  saveNotes(newNotes);
  return newNotes;
};

export const deleteNote = (notes: Note[], id: string): Note[] => {
  const newNotes = notes.filter((note) => note.id !== id);
  saveNotes(newNotes);
  return newNotes;
};

export const createNote = (notes: Note[]): Note[] => {
  const newNote: Note = {
    id: Date.now().toString(),
    title: "Untitled Note",
    content: "",
    lastModified: Date.now(),
  };
  const newNotes = [newNote, ...notes];
  saveNotes(newNotes);
  return newNotes;
};
