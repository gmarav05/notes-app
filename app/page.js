import NotesClient from "@/components/NotesClient";
import dbConnect from "@/lib/db";
import Image from "next/image";
import Note from "@/models/Note"

async function getNotes() {
   await dbConnect();
   const notes = await Note.find({}).sort({ createdAt: -1 }).lean();

   return notes.map((note) => ({
     ...note,
     _id: note._id.toString()
   }))
}

export default async function Home() {

  await dbConnect();

  const notes = await getNotes();
  console.log(notes);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-white bg-clip-text text-transparent">
          Notes App
        </h1>
        <p className="mt-2 text-(--muted) text-sm">Capture your thoughts, one note at a time.</p>
      </div>
      <NotesClient initialNotes = {notes}/>
    </div>
    
  );
}
