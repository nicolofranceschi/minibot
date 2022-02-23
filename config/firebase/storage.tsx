import { getStorage, ref, uploadBytesResumable, getDownloadURL } from '@firebase/storage';
import { AddBody } from 'features/Add/schema';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useMutation } from 'react-query';
import { tryCatcher } from 'utils/functions';
import { addDataToScheda, createScheda } from './db';

const storage = getStorage();

export interface UploadType {
  file: File | Blob;
  name: string | undefined;
  setPercent: SetFunction<number>;
}

export const upload = ({ file, name, setPercent }: UploadType) => {
  const uploadTask = uploadBytesResumable(ref(storage, name), file);

  uploadTask.on(
    'state_changed',
    snapshot => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setPercent(current => (progress > current ? Math.floor(progress) : current));
    },
    error => toast.error("C'è stato qualche problema" + error.message),
  );

  return uploadTask;
};

export const getFile = ({ name }: { name: string }) => tryCatcher(() => getDownloadURL(ref(storage, name)));
