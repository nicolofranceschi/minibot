import {
  addDoc,
  collection,
  getFirestore,
  setDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  CollectionReference,
  DocumentReference,
  DocumentSnapshot,
  Query,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from '@firebase/firestore';
import { Scheda } from 'features/Add/schema';

import { removeEmpty, tryCatcher } from 'utils/functions';


export const db = getFirestore();

// TODO: policy: https://firebase.google.com/docs/firestore/quickstart#secure_your_data

export const getDocFromSnap = <T>(snap: DocumentSnapshot<T>): T & { id: string } => ({ id: snap.id, ...(snap.data() as T) });

const createDocument = <T>(table: string, data: T) => tryCatcher(() => addDoc(collection(db, table), removeEmpty(data)));
const modifyDocument = <T>(table: string, id: string, data: T) => tryCatcher(() => setDoc(doc(db, table, id) as DocumentReference<T>, removeEmpty(data), { merge: true }));
const getDocument = <T>(table: string, id: string) =>
  tryCatcher(async () => {
    const snap = await getDoc<T>(doc(db, table, id) as DocumentReference<T>);
    if (snap.exists()) return getDocFromSnap(snap);
    else return null; // TODO: throw new Error(...)
  });
type QueryFunction<T> = (ref: CollectionReference<T>) => Query<T>;
const getCollection = <T>(table: string, query?: QueryFunction<T>) =>
  tryCatcher(async () => {
    const ref = collection(db, table) as CollectionReference<T>;
    const snap = await getDocs<T>(query ? query(ref) : ref);
    return snap.docs.map(getDocFromSnap);
  });

const groupQuery =
  <T>(group: string) =>
  (ref: CollectionReference<T>) =>
    query(ref, where('group', '==', group));

// DB FUNCTIONS

export const addDataToGroup = (id: string, document: Partial<Group>) => modifyDocument('groups', id, document);

export const addDataToAutoCompletes = <T>(id: string, data: T) => tryCatcher(() => updateDoc(doc(db, 'autocompletes', id), { options: arrayUnion(data) }));
export const removeDataToAutoCompletes = <T>(id: string, data: T) => tryCatcher(() => updateDoc(doc(db, 'autocompletes', id), { options: arrayRemove(data) }));

export const getAutoCompletes = () => getCollection<Autocomplete>('autocompletes');

export const addFileToScheda = <T>(id: string, data: T) => tryCatcher(() => updateDoc(doc(db, 'schede', id), { files: arrayUnion({...data}) }));

export const getAllUsers = (group: string) => getCollection<User>('users', groupQuery(group));

export const getScheda = (id: string) => getDocument<Scheda>('schede', id);

export const createUser = (id: string, document: User) => modifyDocument('users', id, document);

export const createScheda = (document: Scheda) => createDocument('schede', document);

export const addDataToScheda = (id: string, document: any) => modifyDocument('schede', id, document);

export const getUser = (id: string) => getDocument<User>('users', id);

export const getGroup = (id: string) => getDocument<Group>('groups', id);

export const addDataToUser = (id: string, document: Partial<User>) => modifyDocument('users', id, document);


