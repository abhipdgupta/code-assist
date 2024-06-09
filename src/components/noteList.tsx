import { Trash2 } from "lucide-react";
import { Note as TNote } from "../types/note.type";
import Note from "./note";
import NotesPdfExport from "./notesPdfExport";

const NotesList = ({
  savedNotes,
  handleDeleteNote,
  handleDeleteAllNotes,
}: {
  savedNotes: TNote[];
  handleDeleteNote: (index: number) => void;
  handleDeleteAllNotes: () => void;
}) => {
  return (
    <div className="mt-4 w-full">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">Saved Notes</h2>
        <NotesPdfExport />
        <button
          className="bg-red-500 text-white px-2 py-1 rounded-md"
          onClick={handleDeleteAllNotes}
        >
          <span className="flex gap-2 items-center justify-center">
            <Trash2 size={12} /> Delete All
          </span>
        </button>
      </div>

      {savedNotes.map((note, index) => (
        <Note
          key={index}
          note={note}
          index={index}
          onDelete={() => handleDeleteNote(index)}
        />
      ))}
    </div>
  );
};

export default NotesList;
