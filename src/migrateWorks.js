import { db } from './firebase'
import { doc, setDoc } from 'firebase/firestore'
import { works } from './data/works'

export async function migrateWorks() {
  for (const work of works) {
    await setDoc(doc(db, 'projects', String(work.id)), {
      title: work.title,
      category: work.category,
      description: work.description,
      thumbnail: work.thumbnail || '',
      tools: work.tools,
      timeSpent: work.timeSpent,
      year: work.year,
      link: work.link || '',
      video: work.video || '',
      likes: 0,
      clicks: 0,
    })
  }
  console.log('Migration done!')
}