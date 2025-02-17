import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface Note {
  id: string
  title: string
  content: string
  createdAt: string
}

async function getNotes() {
  const notesRef = collection(db, 'notes')
  const snapshot = await getDocs(notesRef)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate?.().toLocaleDateString() || 'Unknown date'
  })) as Note[]
}

export default async function NotesPage() {
  const notes = await getNotes()

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Notes</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((note) => (
          <Card key={note.id}>
            <CardHeader>
              <h2 className="text-xl font-semibold">{note.title}</h2>
              <p className="text-sm text-gray-500">{note.createdAt}</p>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{note.content}</p>
            </CardContent>
          </Card>
        ))}
        
        {notes.length === 0 && (
          <p className="text-gray-500 col-span-full text-center">
            No notes found. Create your first note!
          </p>
        )}
      </div>
    </div>
  )
} 