"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";

const NotesClient = ({ initialNotes }) => {
  const [notes, setNotes] = useState(initialNotes);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");


  const createNote = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) return;

    setLoading(true);

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      const result = await response.json();
      if (result.success) {
        setNotes([result.data, ...notes]);
        toast.success("Notes created!");
        setTitle("");
        setContent("");
      }
      setLoading(false);
    } catch (error) {
      console.error("Try Again!", error);
      toast.error("Try again!");
    }
  };

  const deleteNote = async (id) => {
    try {

        const response = await fetch(`/api/notes/${id}`, {
            method: "DELETE"
        })

        const result = await response.json();

        if (result.success) {
            setNotes(notes.filter(note => note._id !== id)),
            toast.success("Note is Deleted!")
        }
        
    } catch (error) {
        console.error("Error deleting note");
        toast.error("Try Again!")
        
    }
  }

  const updateNote = async (id) => {
    if (!editTitle.trim() || !editContent.trim()) return;

    setLoading(true);

    try {
        const response = await fetch(`/api/notes/${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({title: editTitle, content: editContent}),
        })

        const result = await response.json();

        if (result.success) {
            toast.success("Notes updated successfully");
            setNotes(notes.map((note) => (note._id === id ? result.data : note)));
            setEditingId(null)
            setEditTitle("")
            setEditContent("");
        }
        
    } catch (error) {
        console.error("Error updating note:", error);
        toast.error("Try Again!");
    }
  }

  const startEdit = (note) => {
    setEditingId(note._id);
    setEditTitle(note.title);
    setEditContent(note.content);
  }

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditContent("");
  }

  return (
    <div className="space-y-6">
      <form onSubmit={createNote} className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl text-gray-800 font-semibold mb-4">
          Create New Note
        </h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Note title"
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            required
          />

          <textarea
            placeholder="Note Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          />

          <button
            type="Submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create note"}
          </button>
        </div>
      </form>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Notes ({notes.length})</h2>
        {notes.length === 0 ? (
          <p className="text-gray-500">No notes yet. Create your first note</p>
        ) : (
          notes.map((note) => (
            <div key={note._id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{note.title}</h3>
                <div className="flex gap-2">
                  <button className="text-blue-500 hover:text-blue-700 text-sm">
                    Edit
                  </button>
                  <button onClick={() => deleteNote(note._id)}
                  className="text-red-500 hover:text-red-700 text-sm">
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-gray-700 mb-2">{note.content}</p>
              <p className="text-sm text-gray-500">
                {" "}
                Created: {new Date(note.createdAt).toLocaleDateString()}
              </p>
              {note.updatedAt !== note.createdAt && (
                <p className="text-sm text-gray-500">
                  Updated: {new Date(note.updatedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotesClient;
