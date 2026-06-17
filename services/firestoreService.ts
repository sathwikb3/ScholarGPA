import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Course, Assignment, GPASettings, HistoryEntry } from '../types';

export interface UserData {
  courses: Course[];
  assignments: Assignment[];
  history: HistoryEntry[];
  settings: GPASettings;
}

export const syncToFirestore = async (userId: string, data: UserData) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, data, { merge: true });
  } catch (error) {
    console.error('Error syncing to Firestore:', error);
    throw error;
  }
};

export const loadFromFirestore = async (userId: string): Promise<UserData | null> => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserData;
    }
    return null;
  } catch (error) {
    console.error('Error loading from Firestore:', error);
    throw error;
  }
};

export const subscribeToFirestore = (userId: string, onDataUpdate: (data: UserData) => void) => {
  const userDocRef = doc(db, 'users', userId);
  return onSnapshot(userDocRef, (docSnap) => {
    if (docSnap.exists()) {
      onDataUpdate(docSnap.data() as UserData);
    }
  }, (error) => {
    console.error('Error in Firestore subscription:', error);
  });
};
