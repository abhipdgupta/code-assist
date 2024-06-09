import { Note } from "../types/note.type";

export const getSavedNotes = async (): Promise<Note[] | []> => {
  return new Promise((resolve) => {
    chrome.storage.local.get(["notes"], (result) => {
      if (result.notes) {
        resolve(result.notes);
      } else {
        resolve([]);
      }
    });
  });
};

const updateNotes = async (updatedNotes: Note[]): Promise<void> => {
  return new Promise((resolve) => {
    chrome.storage.local.set({ notes: updatedNotes }, () => {
      console.log("Notes saved:", updatedNotes);
      resolve();
    });
  });
};

export const updateSavedNotes = async (note: Note): Promise<{ error?: string, updatedNotes?: Note[] }> => {
  if (!note.questionContent || !note.titleSlug) {
    return { error: "No question loaded" };
  }

  const result = await getSavedNotes();

  const notes = result || [];
  const existingNote = notes.find((n: Note) => n.questionContent === note.questionContent);
  if (existingNote) {
    return { error: "Note for this question already exists" };
  }

  const updatedNotes = [...notes, note];
  await updateNotes(updatedNotes);

  return { updatedNotes };
};

export const deleteNote = async (index: number): Promise<void> => {
  const savedNotes = await getSavedNotes();
  const updatedNotes = savedNotes.filter((_, i) => i !== index);
  await updateNotes(updatedNotes);
};


export const deleteAllNotes = async (): Promise<void> => {
    await updateNotes([]);
  };