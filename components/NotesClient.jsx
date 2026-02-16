"use client";
import React, { use, useState } from "react";
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
        toast.success("Notes created successfully");
        setTitle("");
        setContent("");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error creating note:", error);
      toast.error("Something went wrong");
    }
  };

  const deleteNote = async (id) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        setNotes(notes.filter((note) => note._id !== id));
        toast.success("Notes Deleted Successfully");
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Something went wrong");
    }
  };

  const updateNote = async (id) => {
    if (!editTitle.trim() || !editContent.trim()) return;

    setLoading(true);

    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle, content: editContent }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Notes updated successfully");
        setNotes(notes.map((note) => (note._id === id ? result.data : note)));
        setEditingId(null);
        setEditTitle("");
        setEditContent("");
      }

      setLoading(false);
    } catch (error) {
      console.error("Error updating note:", error);
      toast.error("Somethin went wrong");
    }
  };

  const startEdit = (note) => {
    setEditingId(note._id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditContent("");
  };

  return (
    <div className="space-y-8">
      <form onSubmit={createNote} className="bg-(--card-bg) border border-(--card-border) p-6 rounded-2xl shadow-sm transition-shadow duration-300 hover:shadow-md">
        <h2 className="text-lg font-semibold mb-5 text-foreground">
          Create New Note
        </h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Note Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 bg-(--input-bg) border border-(--input-border) rounded-xl text-foreground placeholder-(--muted) focus:outline-none focus:ring-2 focus:ring-(--input-focus) focus:border-transparent transition-all duration-200"
            required
          />

          <textarea
            placeholder="Note Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 bg-(--input-bg) border border-(--input-border) rounded-xl text-foreground placeholder-(--muted) focus:outline-none focus:ring-2 focus:ring-(--input-focus) focus:border-transparent transition-all duration-200 resize-none"
          />
          <button
            type="Submit"
            disabled={loading}
            className="bg-(--accent) text-white px-6 py-2.5 rounded-xl font-medium hover:bg-(--accent-hover) disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer shadow-sm hover:shadow"
          >
            {loading ? "Creating..." : "Create Note"}
          </button>
        </div>
      </form>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Your Notes <span className="text-(--muted) font-normal text-base">({notes.length})</span></h2>
        {notes.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-(--muted) text-lg">
              No notes yet
            </p>
            <p className="text-(--muted) text-sm mt-1">Create your first note above</p>
          </div>
        ) : (
          notes.map((note) => (
            <div key={note._id} className="bg-(--card-bg) border border-(--card-border) p-6 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md">
              {editingId === note._id ? (
                <>
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-4 py-3 bg-(--input-bg) border border-(--input-border) rounded-xl text-foreground placeholder-(--muted) focus:outline-none focus:ring-2 focus:ring-(--input-focus) focus:border-transparent transition-all duration-200"
                      required
                    />
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 bg-(--input-bg) border border-(--input-border) rounded-xl text-foreground placeholder-(--muted) focus:outline-none focus:ring-2 focus:ring-(--input-focus) focus:border-transparent transition-all duration-200 resize-none"
                      required
                    />

                    <div className="flex gap-3">
                      <button
                        onClick={() => updateNote(note._id)}
                        disabled={loading}
                        className="bg-(--success) text-white px-5 py-2 rounded-xl font-medium hover:bg-(--success-hover) disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer"
                      >
                        {loading ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="bg-(--cancel) text-white px-5 py-2 rounded-xl font-medium hover:bg-(--cancel-hover) transition-colors duration-200 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* view */}
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-foreground leading-snug">{note.title}</h3>
                    <div className="flex gap-3 ml-4 shrink-0">
                      <button
                        onClick={() => startEdit(note)}
                        className="text-(--accent) hover:text-(--accent-hover) text-sm font-medium transition-colors duration-200 cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteNote(note._id)}
                        className="text-(--danger) hover:text-(--danger-hover) text-sm font-medium transition-colors duration-200 cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <p className="text-foreground opacity-80 mb-4 leading-relaxed whitespace-pre-wrap">{note.content}</p>
                  <div className="flex gap-4 text-xs text-(--muted)">
                    <p>
                      Created: {new Date(note.createdAt).toLocaleDateString()}
                    </p>
                    {note.updatedAt !== note.createdAt && (
                      <p>
                        Updated: {new Date(note.updatedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotesClient;
