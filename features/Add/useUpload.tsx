import { getDownloadURL } from "@firebase/storage";
import { addDataToScheda, createScheda } from "config/firebase/db";
import { upload } from "config/firebase/storage";
import { Form } from "config/schema";
import { useState } from "react";
import { useMutation } from "react-query";

interface FileArray {
    url: string;
    name: string | undefined;
}

export const useUpload = () => {

    const [percent, setPercent] = useState<number>(0)

    const saveFile = useMutation((promise: ReturnType<typeof upload>[]) => Promise.all(promise));

    const getUrl = useMutation((promise: ReturnType<typeof getDownloadURL >[]) => Promise.all(promise));

    const saveEvent = useMutation((form: Form) => createScheda(form));

    const addUrlToEvent = useMutation(({id,data}:{id:string,data: FileArray[]}) => addDataToScheda(id,{files:data}));

    const carica = ({ data, files }: { data: Form, files: PreviewableFile[] }) => {
        saveEvent.mutate(data, {
            onSuccess: ({ data }) => {
                console.log(data?.id)
                const promises = files.map(({ file }, i) => upload({ file, name: data?.path + '/' + i, setPercent }));
                saveFile.mutate(promises, {
                    onSuccess: res => {
                        const promises = res.map((metadata) => getDownloadURL(metadata.ref))
                        getUrl.mutate(promises,{
                            onSuccess: res => {
                                const fileArray = res.map((file,i) => ({url:file,name:files[i].name}))
                                addUrlToEvent.mutate({id:data?.id ?? "",data:fileArray},{
                                    onSuccess: res => console.log("finito")
                                })
                            }
                        })
                    }
                })
            }
        })
    }

    const isLoading = saveFile.isLoading || getUrl.isLoading || saveEvent.isLoading || addUrlToEvent.isLoading 


    return { percent, carica , isLoading }
};