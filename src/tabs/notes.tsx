import {
  deleteAllNotes,
  deleteNote,
  getSavedNotes,
  updateSavedNotes,
} from "../api/notes";
import AddNote from "../components/addNote";
import NotesList from "../components/noteList";
import { useEffect, useState } from "react";
import { Note as TNote } from "../types/note.type";

function NotesTab() {
  const [savedNotes, setSavedNotes] = useState<TNote[] | []>([]);

  useEffect(() => {
    const fetchSavedNotes = async () => {
      const notes = await getSavedNotes();
      setSavedNotes(notes);
    };

    fetchSavedNotes();
  }, []);

  const handleDeleteNote = async (index: number) => {
    await deleteNote(index);
    const notes = await getSavedNotes();
    setSavedNotes(notes);
  };

  const handleDeleteAllNotes = async () => {
    await deleteAllNotes();
    const notes = await getSavedNotes();
    setSavedNotes(notes);
  };

  const saveNote = async (note: TNote) : Promise<undefined | string> => {
    const res = await updateSavedNotes(note);
    if (res.updatedNotes) {
      setSavedNotes(res.updatedNotes);
      return undefined
    } else if (res.error) {
      return res.error
    }
  };
  return (
    <div className="p-4 rounded-md">
      <AddNote onSaveNote={saveNote} />
      <NotesList
        handleDeleteNote={handleDeleteNote}
        savedNotes={savedNotes}
        handleDeleteAllNotes={handleDeleteAllNotes}
      />
    </div>
  );
}

export default NotesTab;
