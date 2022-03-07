import { getDownloadURL } from '@firebase/storage';
import { addDataToScheda, addFileToScheda, createScheda } from 'config/firebase/db';
import { upload } from 'config/firebase/storage';
import { Scheda } from 'features/Add/schema';
import { useState } from 'react';
import { useMutation } from 'react-query';

interface FileArray {
  url: string;
  name: string | undefined;
}

export const useUpload = (onSuccess: () => void) => {

  const [percent, setPercent] = useState<number>(0);
  const saveFile = useMutation(({ files, name , lengths }: { files: PreviewableFile[]; name: string , lengths: number}) => Promise.all(files.map(({ file }, i) => upload({ file, name: name + '/' + (i+lengths), setPercent }))));
  const getUrl = useMutation((res: Awaited<ReturnType<typeof upload>>[]) => Promise.all(res.map(metadata => getDownloadURL(metadata.ref))));
  const saveScheda = useMutation((form: Scheda) => createScheda(form));
  const updateScheda = useMutation(({id,form}:{id:string,form: Scheda}) => addDataToScheda(id, form));
  const addUrlToEvent = useMutation(({ id, data }: { id: string; data: FileArray[] }) => addDataToScheda(id, { files: data }));
  const addUrlToArrayEvent = useMutation(({ id, data }: { id: string; data: FileArray[] }) => addFileToScheda(id, data));

  

  const carica = ({ data, files , Npuntomaglia }: { data: Scheda; files: PreviewableFile[] , Npuntomaglia : number }) => {
    if (!data) return;

    saveScheda.mutate({...data,Npuntomaglia}, {
      onSuccess: ({ data }) => {
        if (!data) return;
        saveFile.mutate(
          { files, name: data.path , lengths : 0 },
          {
            onSuccess: res => {
              getUrl.mutate(res, {
                onSuccess: res => {
                  const fileArray = res.map((file, i) => ({ url: file, name: files[i].name }));
                  addUrlToEvent.mutate(
                    { id: data.id ?? '', data: fileArray },
                    {
                      onSuccess,
                    },
                  );
                },
              });
            },
          },
        );
      },
    });
  };

  const modifica = ({ data, files , Npuntomaglia , id , lengths , previousFiles }: { data: Scheda; files: PreviewableFile[] , Npuntomaglia : number , id:string , lengths:number , previousFiles: FileArray[] }) => {

    if (!data) return;

    const dataToUpload = {...data,Npuntomaglia}

    updateScheda.mutate({form:dataToUpload,id}, {
      onSuccess: () => {
        saveFile.mutate(
          { files, name: `schede/${id}`, lengths  },
          {
            onSuccess: res => {
              console.log(res)
              getUrl.mutate(res, {
                onSuccess: res => {
                  const fileArray = res.map((file, i) => ({ url: file, name: files[i].name }));
                  addUrlToEvent.mutate(
                    { id, data: [...previousFiles,...fileArray] },
                    {
                      onSuccess,
                    },
                  );
                },
              });
            },
          },
        );
      },
    });
  };

  const isLoading = saveFile.isLoading || getUrl.isLoading || saveScheda.isLoading || addUrlToEvent.isLoading || updateScheda.isLoading;

  return { percent, carica,modifica, isLoading };
};
