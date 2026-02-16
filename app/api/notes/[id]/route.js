import dbConnect from "@/lib/db";
import Note from "@/models/Note";
import { NextResponse } from "next/server";

export async function DELETE(request, {params}) {
    console.log("DELETE ROUTE LOADED");

    try {
        const {id} = params;
        await dbConnect();

        const note = await Note.findByIdAndDelete(id);

        if (!note) {
            return NextResponse.json(
                {success: false, error: "Note not found"},
                {status: 404}
            );
        }

        return NextResponse.json({success: true, data: {}});
        
    } catch (error) {
        return NextResponse.json(
            {success:false, error: error.message},
            {status: 400}
        )
    }
}

