import { getDownloadURL } from '@firebase/storage';
import { addDataToScheda, createScheda } from 'config/firebase/db';
import { upload } from 'config/firebase/storage';
import { AddBody } from 'features/Add/schema';
import { useState } from 'react';
import { useMutation } from 'react-query';

interface FileArray {
  url: string;
  name: string | undefined;
}

export const useUpload = () => {
  const [percent, setPercent] = useState<number>(0);
  const saveFile = useMutation(({ files, name }: { files: PreviewableFile[]; name: string }) => Promise.all(files.map(({ file }, i) => upload({ file, name: name + '/' + i, setPercent }))));
  const getUrl = useMutation((res: Awaited<ReturnType<typeof upload>>[]) => Promise.all(res.map(metadata => getDownloadURL(metadata.ref))));
  const saveScheda = useMutation((form: AddBody) => createScheda(form));
  const addUrlToEvent = useMutation(({ id, data }: { id: string; data: FileArray[] }) => addDataToScheda(id, { files: data }));

  const carica = ({ data, files }: { data: AddBody; files: PreviewableFile[] }) => {
    if (!data) return;

    saveScheda.mutate(data, {
      onSuccess: ({ data }) => {
        if (!data) return;
        saveFile.mutate(
          { files, name: data.path },
          {
            onSuccess: res => {
              getUrl.mutate(res, {
                onSuccess: res => {
                  const fileArray = res.map((file, i) => ({ url: file, name: files[i].name }));
                  addUrlToEvent.mutate(
                    { id: data.id ?? '', data: fileArray },
                    {
                      onSuccess: res => console.log('finito'),
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

  const isLoading = saveFile.isLoading || getUrl.isLoading || saveScheda.isLoading || addUrlToEvent.isLoading;

  return { percent, carica, isLoading };
};
