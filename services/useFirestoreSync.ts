import { useEffect, useRef, useState } from 'react';
import { User } from 'firebase/auth';
import { syncToFirestore, loadFromFirestore, subscribeToFirestore, UserData } from './firestoreService';
import { Course, Assignment, HistoryEntry, GPASettings } from '../types';

export const useFirestoreSync = (
  user: User | null,
  data: UserData,
  onDataLoaded: (data: UserData) => void
) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const isInitialLoad = useRef(true);
  const unsubscribe = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (user) {
      // Setup listener
      unsubscribe.current = subscribeToFirestore(user.uid, (remoteData) => {
        // If data exists remotely, and this isn't our own update ping
        // well, simple implementation: just take remote data initially
        if (isInitialLoad.current) {
          onDataLoaded(remoteData);
          isInitialLoad.current = false;
        }
      });
      // Initial load explicitly
      loadFromFirestore(user.uid).then((remoteData) => {
        if (remoteData && isInitialLoad.current) {
           onDataLoaded(remoteData);
           isInitialLoad.current = false;
        } else {
           // Create generic data on firestore if totally empty
           isInitialLoad.current = false;
        }
      });
      
      return () => {
         if (unsubscribe.current) unsubscribe.current();
      };
    } else {
       isInitialLoad.current = true;
    }
  }, [user]);

  // Handle saving data changes
  useEffect(() => {
    if (!user || isInitialLoad.current) return;
    
    const timeout = setTimeout(() => {
      setIsSyncing(true);
      syncToFirestore(user.uid, data).then(() => {
        setIsSyncing(false);
        setLastSyncTime(new Date());
      }).catch(err => {
         setIsSyncing(false);
      });
    }, 1500); // Debounce saves

    return () => clearTimeout(timeout);
  }, [user, data.courses, data.assignments, data.history, data.settings]);

  return { isSyncing, lastSyncTime };
};
