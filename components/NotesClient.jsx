"use client";
import React, {useState} from 'react'

const NotesClient = () => {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [loading, setLoading] = useState(false)
  return (
    <div className='space-y-6'>
        <form className='bg-white p-6 rounded-lg shadow-md'>
            <h2 className='text-xl font-semibold mb-4'>Create New Note</h2>

        </form>
    </div>
  )
}

export default NotesClient