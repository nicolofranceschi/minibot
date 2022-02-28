import toast from 'react-hot-toast';
import Compressor from 'compressorjs';
import dayjs from 'dayjs';

const firebaseErrors = {
  'auth/wrong-password': 'Password o email errata',
  'auth/user-not-found': 'Utente non trovato',
  'auth/too-many-requests': 'Troppi errori, riprova più tardi',
  'auth/invalid-email': 'Email non valida',
  'auth/weak-password': 'Password debole',
  'auth/internal-error': 'Internal Error',
  'auth/email-already-in-use': 'Email già in uso',
  'storage/object-not-found': 'File non trovato , hai interrotto il caricamneto al momento della creazione ?',
};

type FirebaseError = { code: keyof typeof firebaseErrors };
const isFirebaseError = (error: any): error is FirebaseError => error.code !== undefined;
// TODO: fare un throw nel tryCatcher per gestire gli errori in useQuery o eliminare del tutto tryCatcher
export async function tryCatcher<T>(fn: () => Promise<T>): Promise<{ data: T | null; error: Error | FirebaseError | null | string }> {
  try {
    return { data: await fn(), error: null };
  } catch (error: any) {
    console.log(error);
    let message = 'default';
    if (error instanceof Error) {
      message = error.message;
    }
    if (isFirebaseError(error)) {
      message = firebaseErrors[error.code];
      toast.error(message);
    }
    return { data: null, error: message ?? error.code };
  }
}

export async function copyTextToClipboard(text: string) {
  if ('clipboard' in navigator) return await navigator.clipboard.writeText(text);
}

export function getContrastColor(hexcolor: string = '') {
  if (!hexcolor) return 'black';
  if (hexcolor.slice(0, 1) === '#') hexcolor = hexcolor.slice(1);
  if (hexcolor.length === 3)
    hexcolor = hexcolor
      .split('')
      .map(hex => hex + hex)
      .join('');

  const r = parseInt(hexcolor.slice(0, 2), 16);
  const g = parseInt(hexcolor.slice(2, 4), 16);
  const b = parseInt(hexcolor.slice(4, 6), 16);

  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  return yiq >= 128 ? 'black' : 'white';
}

export function hexToRgba(hex: any) {
  var c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');
    if (c.length == 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = ('0x' + c.join('')) as any;
    return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',0.5)';
  }
  throw new Error('Bad Hex');
}

export const compressFile = async (file: File): Promise<Blob> =>
  new Promise((success, error) => {
    new Compressor(file, { quality: 0.1, success, error });
  });

export const findById = <T extends { id: string }>(array: T[], id: string) => array.find(item => item.id === id);
export const isObject = (item: any) => item && typeof item === 'object' && !Array.isArray(item);

export function removeEmpty<T extends Record<string, any>>(obj: T) {
  const newObj = {} as T;
  Object.keys(obj).forEach((key: keyof typeof obj) => {
    if (isObject(obj[key])) newObj[key] = removeEmpty(obj[key]);
    if (Array.isArray(obj[key])) newObj[key] = obj[key].map(removeEmpty);
    else if (obj[key] !== undefined) newObj[key] = obj[key];
  });
  return newObj;
}
export const timestampToDate = (date?: Date | Firebase.Timestamp) => date && (date instanceof Date ? date : date.toDate());
export const timestampToLocalDate = (date?: Date | Firebase.Timestamp) => timestampToDate(date)?.toLocaleDateString();
export const trimString = (str: string, maxLength: number) => (str.length > maxLength ? `${str.substring(0, maxLength)}...` : str);

export const truncate = (str: string, length: number) => (str.length > length ? `${str.substring(0, length)}...` : str);

export const oneHourFromNow = (date: dayjs.Dayjs = dayjs()) => date.add(1, 'hour');

export const timeDifference = (date1?: Date | Firebase.Timestamp, date2?: Date | Firebase.Timestamp) => {
  const second = dayjs(timestampToDate(date1)).diff(dayjs(timestampToDate(date2)), 'second');
  const minute = Math.floor(second / 60);
  return minute === 0 ? `${second} Secondi` : minute < 60 ? `${minute} Minuti` : `${Math.floor(minute / 60)} ore e ${minute % 60} `;
};

export const timeDifferenceToSecond = (date1?: Date | Firebase.Timestamp, date2?: Date | Firebase.Timestamp) => {
  return dayjs(timestampToDate(date1)).diff(dayjs(timestampToDate(date2)), 'second');
};

export const secondToTime = (second: number) => {
  const minute = Math.floor(second / 60);
  return minute === 0 ? `${second} Secondi` : minute < 60 ? `${minute} Minuti` : `${Math.floor(minute / 60)} ore e ${minute % 60} `;
};

export const isPdf = async ( url : string ) => { 

  try {
    const result = await fetch(url)
    const blob = await result.blob()

    return blob.type.startsWith("application") ? blob.type.split("/")[1] : false
    
  } catch (error) {

    console.log(error)
    
  }
 
}

export const linkToBlob = async (files:{url:string, name?: string}[]) => { 

  try {
    
    const promise = files.map(file => fetch(file.url).then(r => r.blob()).then(blob => blob.arrayBuffer()))
    const resultPromise = await Promise.all(promise)
   
    return resultPromise
    
  } catch (error) {

    console.log(error)
    
  }
 
}
