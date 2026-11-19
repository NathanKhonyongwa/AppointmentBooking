
import { db } from '@/lib/firebase';
import {
  addDoc,
  collection,
  serverTimestamp,
} from 'firebase/firestore';

export async function logActivity({
  type,
  title,
  message,
  actorId,
  actorName,
  actorRole = 'client',
  targetId = null,
}) {
  if (!actorId) {
    throw new Error('A logged-in user is required to record this activity.');
  }

  return addDoc(collection(db, 'notifications'), {
    type,
    title,
    message,
    actorId,
    actorName: actorName || 'Unknown client',
    actorRole,
    targetId,
    isRead: false,
    createdAt: serverTimestamp(),
  });
}
