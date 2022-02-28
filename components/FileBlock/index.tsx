import { Grid, Paper, Typography, InputBase, Stack, Box, Button, Dialog, DialogTitle } from '@mui/material';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import OpenWithIcon from '@mui/icons-material/OpenWith';
import CheckIcon from '@mui/icons-material/Check';
import BackupIcon from '@mui/icons-material/Backup';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { toolAnimation, infoAnimation, nameAnimation } from './animation';
import { compressFile } from 'utils/functions';
import { FilesProps } from './useFiles';


const thumb = {
  width: '100%',
  height: '100%',
};

export default function FileBlock({ files = [], addFiles, removeFiles, changeName }: FilesProps) {

  const [selected, setSelected] = useState<number[]>([]);
  const firstSelectedFile = files[selected[0]];

  const [name, setName] = useState<string>('');

  const [openImage, setOpenImage] = useState<PreviewableFile | null>(null);

  const handleClick = (i: number) => {
    setSelected(e => (e.some((sel: number) => sel === i) ? e.filter((sel: number) => sel !== i) : [...e, i]));
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const files = await Promise.all(

        acceptedFiles.map(async file => ({
          file: !file.type.startsWith('image') ? file : await compressFile(file),
          preview: URL.createObjectURL(file),
          extension: file.name.substring(file.name.lastIndexOf('.') + 1),
          type: file.type,
          time: new Date(),
        })),
      );
      addFiles(files);
    },
    [addFiles],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const deleteFile = () => {
    if (selected.length === 0) return toast.error('Non hai selezionato nessun file');
    removeFiles(selected);
    setSelected([]);
  };

  const openFile = () => {
    if (selected.length === 0) return toast.error('Non hai selezionato nessun file');
    if (selected.length > 1) return toast.error('Puoi aprire solo un file alla volta');
    if (firstSelectedFile.type.startsWith('image')) setOpenImage(firstSelectedFile);
    else window.open(firstSelectedFile.preview);
  };

  const addName = () => {
    changeName({ i: selected[0], name });
    setName('');
  };

  const closeFile = () => {
    setOpenImage(null);
  };

  return (
    <Paper sx={{borderRadius: '1rem'}}>
      <Box sx={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', flexDirection: 'column', position: 'relative' }}>
        <motion.div initial='hidden' animate={files.length > 0 ? 'visible' : 'hidden'} variants={toolAnimation}>
          <Stack flexDirection='row' sx={{ height: '100%', width: '100%', alignItems: 'center', justifyContent: 'space-between', padding: '1rem' }}>
            <motion.div initial='hidden' animate={selected.length === 1 ? 'visible' : 'hidden'} variants={nameAnimation}>
              <Stack flexDirection='row' sx={{ alignItems: 'center', justifyContent: 'flex-start', borderRadius: '20px' }}>
                <InputBase
                  sx={{ padding: '0.7rem', width: '40%', border: '1px solid #1664C0', borderRadius: '10px 0px 0px 10px' }}
                  placeholder={firstSelectedFile?.name ?? 'Unknown'}
                  value={name}
                  onChange={e => setName(e.currentTarget.value)}
                />
                <Button variant='contained' sx={{ borderRadius: '0 10px 10px 0px', padding: '1rem' }} onClick={addName}>
                  <CheckIcon />
                </Button>
              </Stack>
            </motion.div>
            <Stack flexDirection='row' sx={{ width: '40%', alignItems: 'center', justifyContent: 'flex-end', borderRadius: '20px' }}>
              <Button variant='contained' color='error' sx={{ borderRadius: '10px 0px 0px 10px', padding: '1rem' }} onClick={deleteFile}>
                <DeleteIcon />
              </Button>
              <Button variant='contained' sx={{ borderRadius: '0 10px 10px 0px', padding: '1rem' }} onClick={openFile}>
                <OpenWithIcon />
              </Button>
            </Stack>
          </Stack>
        </motion.div>
        <Paper {...getRootProps()} style={{ overflowY: 'auto', height:"300px", borderRadius: '20px', padding: '1rem', width: '100%', backgroundColor: isDragActive ? '#cfe8fc' : '#f5f7ff' }}>
          <motion.div initial='visible' animate={files.length > 0 ? 'hidden' : 'visible'} variants={infoAnimation}>
            <Box sx={{ display: 'flex', gap: 4, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <BackupIcon sx={{fill:'#1664C0'}} />
              <Typography color='#1664C0' sx={{ padding: '1rem', textAlign: 'center' }}>
                Clicca per fare Fotografia o per inserire File
              </Typography>
            </Box>
          </motion.div>
          <Grid container spacing={3}>
            {files.map((file, i) => (
              <Grid item key={i} xs={4} sx={thumb} onClick={(e) => { e.stopPropagation(); handleClick(i) }}>
                <Paper
                  elevation={selected.some(elm => elm == i) ? 10 : 1}
                  sx={{
                    backgroundImage: `url('${file.preview}')`,
                    border: selected.some(elm => elm == i) ? '2px solid #1976d2' : 'none',
                    cursor: 'pointer',
                    backgroundPosition: 'center',
                    aspectRatio: '1/1',
                    backgroundSize: 'cover',
                    borderRadius: '20px',
                  }}
                >
                  <Stack alignItems='center' justifyContent='center' sx={{ width: '100%', backdropFilter: 'blur(2px)', height: '100%', borderRadius: '20px' }}>
                    <Typography color='primary' variant='h4' sx={{ fontWeight: 600, cursor: 'pointer' }}>
                      {file.extension}
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
          <input {...getInputProps()} />
        </Paper>
        <Dialog open={Boolean(openImage)}>
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            {/* TODO: cosa mettiamo qui? Name dentro openImage o dentro openImage.file? openImage.file è un Blob, non ha un name forse? */}
            {/* {openimage && openimage.file.name} */}
            <Button color='error' endIcon={<CloseIcon />} onClick={closeFile}>
              CHIUDI
            </Button>
          </DialogTitle>
          <Box sx={{ overflow: 'auto', height: '90vh' }}>{openImage && <img style={{ height: '100%' }} src={openImage.preview} alt='Preview image'></img>}</Box>
        </Dialog>
      </Box>
    </Paper>
  );
}
