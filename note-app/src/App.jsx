import { useEffect,useState } from "react";

function App(){
  const[notes,setNotes]=useState(()=>{
  try{
     return JSON.parse(localStorage.getItem("notes"))||[];
  }catch{
   return [];
  }
});

const[title,setTitle]=useState("");
const[content,setContent]=useState("");
const[search,setSearch]=useState("");
const[editingId,setEditingId]=useState(null);

useEffect(()=>{
  localStorage.setItem("notes",JSON.stringify(notes));
},[notes]);

function saveNote(event){
  event.preventDefault();

  if(!title.trim()||!content.trim())return;

  if(editingId!==null){
    setNotes((previous)=>
    previous.map((note)=>
    note.id===editingId?
    {...note,title,content}:note
    )
    );
    setEditingId(null);
  }else{
    setNotes((previous)=>[
     {
     id:Date.now(),
     title:title.trim(),
     content:content.trim(),
     date:new Date().toLocaleDateString(),
     },...previous,
    ]
    );}
    setTitle("");
    setContent("");
}

function editNote(note){
  setTitle(note.title);
  setContent(note.content);
  setEditingId(note.id);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteNote(id){
  setNotes((previous)=>previous.filter((note)=>note.id!==id));
  if(editingId===id){
    setEditingId(null);
    setTitle("");
    setContent("");
  }
}

const filterNote=notes.filter(
  (note)=>note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase())
);

return(
  <div className="min-h-screen bg-slate-100 text-slate-800">
    <header className="bg-blue-500 border-b border-gray-200">
       <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold text-black-600">Note</h1>
       </div>
    </header>
    <main className="max-w-6xl mx-auto px-6 py-10">
       <section className="max-w-2xl mx-auto mb-12">
        <h2 className="text-2xl font-semibold mb-2">
          {editingId !== null ? "Edit Note" : "Create a Note"}
        </h2>
          <p className="text-slate-500 mb-6">
            Write down your thoughts and keep them organized.
          </p>

          <form onSubmit={saveNote} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
            <input type="text" placeholder="Note title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={150} required
              className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400"/>
            <textarea placeholder="Write your note here..." value={content} onChange={(e) => setContent(e.target.value)} required
              rows={5} className="w-full resize-y border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400"/>
                 <div className="flex flex-wrap gap-3">
              <button type="submit" className="rounded-xl bg-yellow-300 px-6 py-3 font-medium text-black-300 hover:bg-yellow-500 transition">
                {editingId !== null ? "Update Note" : "Add Note"}
              </button>
              {editingId !== null && (
                <button type="button" onClick={() => {
                    setEditingId(null);
                    setTitle("");
                    setContent("");
                  }}
                  className="rounded-xl bg-slate-200 px-6 py-3 hover:bg-slate-300">
                  Cancel
                </button>
              )}
            </div>
            </form>
       </section>

         <section>
          <div className="flex flex-col items-start gap-4 mb-6">
            <h2 className="text-2xl font-semibold">Your Notes</h2>
              <input type="text" placeholder="Search for notes..." value={search} 
          onChange={(e)=>setSearch(e.target.value)}
           className="bg-white w-full sm:w-72 rounded-xl border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-400"/>
            <span className="text-slate-500">
              {filterNote.length} notes
            </span>
          </div>

          {filterNote.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <p className="text-lg font-medium">
                {search ? "No matching notes found" : "No notes yet"}
              </p>
              <p className="text-slate-500 mt-2">
                {search
                  ? "Try another search term."
                  : "Create your first note using the form above."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterNote.map((note) => (
                <article key={note.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col">
                  <h3 className="text-lg font-semibold break-words mb-2">{note.title}</h3>
                  <p className="text-slate-600 whitespace-pre-wrap break-words flex-1">
                    {note.content}
                  </p>
                  <div className="flex justify-between items-center gap-3 mt-6 pt-4 border-t border-slate-100">
                    <span className="text-xs text-slate-400">{note.date || "Saved note"}</span>
                    <div className="flex gap-3">
                      <button onClick={() => editNote(note)} className="text-indigo-600 font-medium hover:text-indigo-800">
                        Edit
                      </button>
                      <button onClick={() => deleteNote(note.id)} className="text-red-500 font-medium hover:text-red-700">
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
    </main>
  </div>

  );
}
export default App;