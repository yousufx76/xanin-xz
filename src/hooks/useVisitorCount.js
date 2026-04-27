import { useEffect } from 'react'
import { db } from '../firebase'
import { doc, setDoc, increment } from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'

export function useVisitorCount() {
  const { isAdmin } = useAuth()

  useEffect(() => {
    if (isAdmin) return
    const visited = sessionStorage.getItem('visited')
    if (visited) return

    const today = new Date().toISOString().split('T')[0]
    const ref = doc(db, 'analytics', `visits_${today}`)
    setDoc(ref, { count: increment(1), date: today }, { merge: true })

    const totalRef = doc(db, 'stats', 'visits')
    setDoc(totalRef, { count: increment(1) }, { merge: true })

    sessionStorage.setItem('visited', 'true')
  }, [isAdmin])
}