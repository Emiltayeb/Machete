import { getAuth } from 'firebase/auth'; // Firebase v9+
import { getDatabase } from 'firebase/database'; // Firebase v9+
import { initializeFirestore } from 'firebase/firestore';
import {
  FirestoreProvider,
  DatabaseProvider,
  useInitFirestore,
  AuthProvider,
  useFirebaseApp,
} from 'reactfire';

const FirebaseWrapper: React.FC = ({ children }) => {
  const app = useFirebaseApp(); // a parent component contains a `FirebaseAppProvider`

  const { status, data: firestoreInstance } = useInitFirestore(
    async (firebaseApp) => {
      const db = initializeFirestore(firebaseApp, {});
      return db;
    }
  );
  // initialize Database and Auth with the normal Firebase SDK functions
  const database = getDatabase(app);
  const auth = getAuth(app);

  // any child components will be able to use `useUser`, `useDatabaseObjectData`, etc

  if (status === 'loading') {
    return <></>;
  }

  return (
    <AuthProvider sdk={auth}>
      <FirestoreProvider sdk={firestoreInstance}>
        <DatabaseProvider sdk={database}>{children}</DatabaseProvider>
      </FirestoreProvider>
    </AuthProvider>
  );
};

export default FirebaseWrapper;
