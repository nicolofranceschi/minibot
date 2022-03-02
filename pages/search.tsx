import { useMutation, useQuery } from 'react-query';
import algolia from 'config/algolia';
import { Fragment, useEffect, useState } from 'react';
import useDebounce from 'hooks/useDebounce';
import { Box, Button, InputAdornment, Paper, TextField, Backdrop, CircularProgress, Typography, IconButton, Stack, Chip, Tooltip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LoadingButton from '@mui/lab/LoadingButton';
import { AddBody } from 'features/Add/schema';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { isPdf } from 'utils/functions';
import downloadZip from 'config/downloadZip';
import useOffset from 'hooks/useOffset';
import { motion } from 'framer-motion';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';

interface ItemType extends AddBody {
  files: { url: string; name?: string }[];
}

const stringFields = ['codiceArticolo', 'description', 'filato', 'puntomaglia', 'rigato', 'tipomaglia', 'schedadilavorazione', 'tipofinitura'];
const numericFields = ['altezzafinita', 'numerofili'];

const propertyRegex = `(NOT\\s)?((${stringFields.join('|')}):\\w+|(${numericFields.join('|')})( = | != | > | >= | < | <= )[0-9]+)`;
const filterRegex = `${propertyRegex}(\\s(OR|AND)\\s${propertyRegex})*`;

export default function Search() {
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('');
  const [validQuery, setValidQuery] = useState('');
  const match = filter.match(new RegExp(filterRegex, 'g'));
  const isError = !match || match.length !== 1 || match[0] !== filter;

  const [details, setDetails] = useState<ItemType | null>(null);

  const download = useMutation(downloadZip);

  const debouncedQuery = useDebounce(input);
  const { data, isLoading } = useQuery(['search', debouncedQuery, validQuery], () => algolia.search(debouncedQuery, { filters: validQuery }), {
    select: ({ hits }: any) => hits,
    onSuccess: hits => console.log(hits),
  });

  const downloadFiles = async (files: { url: string; name?: string }[]) => {
    download.mutate(files, {
      onSuccess: res => console.log(res),
    });
  };

  const { ref, offset } = useOffset();

  return (
    <Box sx={{ padding: '1rem' }}>
      <Backdrop sx={{ color: '#fff', zIndex: 100 }} open={isLoading}>
        <CircularProgress color='inherit' />
      </Backdrop>
      {!details && (
        <Fragment>
          <Box sx={{ position: 'fixed', width: '100%', top: 0, left: 0, padding: '1rem', backdropFilter: 'blur(10px)', overflow: "hidden" }}>
            <Paper sx={{ padding: '1rem', borderRadius: '1rem', display: 'flex', gap: 2, flexDirection: 'column' }}>
              <TextField
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                placeholder='Cerca'
                value={input}
                onChange={e => setInput(e.target.value)}
              />
              <Box sx={{ overflow: 'hidden', width: "100%", borderRadius: '1rem' }}>
                <motion.div drag='x' dragConstraints={{ right: 0, left: -offset, }}>
                  <Stack flexDirection='row' ref={ref} alignItems='flex-start' sx={{ gap: 1 }}>
                    {stringFields.map(field => (
                      <Chip key={field} label={field} onDelete={() => setFilter(e => e.concat(field))} deleteIcon={<AddIcon />} />
                    ))}
                    {numericFields.map(field => (
                      <Chip key={field} label={field} onDelete={() => setFilter(e => e.concat(field))} deleteIcon={<AddIcon />} />
                    ))}
                  </Stack>
                </motion.div>
              </Box>
              <TextField
                fullWidth
                placeholder='QUERY'
                value={filter}
                onChange={e => setFilter(e.target.value)}
              />
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" alignItems="center" sx={{ gap: 0.5 }}>
                  <Tooltip title={
                    <Fragment>
                      <Typography variant="button" sx={{ fontSize: 10 }} >PARAMETER SYNTAX</Typography>
                      <Typography variant="body2" sx={{ fontSize: 10 }} >attribute:value [AND | OR | NOT] attribute:value</Typography>
                      <Typography variant="body2" sx={{ fontSize: 10 }} >{"numeric_attribute [= | != | > | >= | < | <=] numeric_value"}</Typography>
                    </Fragment>
                  }>
                    <IconButton >
                      <InfoIcon sx={{ height: "15px", width: "15px" }} />
                    </IconButton>
                  </Tooltip>
                  {isError ? <span style={{ color: 'red' }}>La query è sbagliata</span> : <span style={{ color: 'green' }}>Ok !</span>}
                </Stack>
                <Button disabled={isError} onClick={() => setValidQuery(filter)}>FILTRA</Button>
              </Stack>
            </Paper>
          </Box>
          <Paper sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 2, mt: '260px', width: '100%' }}></Paper>
          <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 2, mt: '1rem' }}>
            {data &&
              data.map(
                (
                  item: ItemType,
                  i: number, // mostra meno se ci sono piu 5 elementi a schermo
                ) => (
                  <Paper key={i} onClick={() => setDetails(item)} elevation={4} sx={{ padding: '1rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column', gap: 1, flexGrow: 1 }}>
                    <Item {...{ item: item.codiceArticolo, title: 'Codice Articolo' }} />
                    <Item {...{ item: item.description, title: 'Descrizione' }} />
                  </Paper>
                ),
              )}
          </Box>
        </Fragment>
      )}
      {details && (
        <Box>
          <IconButton onClick={() => setDetails(null)}>
            <ArrowBackIosNewIcon />
          </IconButton>
          <Details item={details} />
          <Stack direction='row' sx={{ gap: 3, flexWrap: 'wrap' }}>
            {details.files.map((file, i) => (
              <File url={file.url} name={file.name} key={i} />
            ))}
          </Stack>
          {details.files.length > 0 && (
            <LoadingButton loading={download.isLoading} onClick={() => downloadFiles(details.files)} variant='contained' sx={{ mt: 2, padding: '2rem' }}>
              scarica
            </LoadingButton>)}
        </Box>
      )}
    </Box>
  );
}

const Item = ({ item, title }: { item: any; title: string }) => (
  <Box>
    <Typography variant='button'>{title}</Typography>
    <Typography>{item}</Typography>
  </Box>
);

const File = ({ url, name }: { url: string; name?: string }) => {
  const [pdf, setPdf] = useState<any>();

  useEffect(() => {
    const callFunction = async () => {
      const response = await isPdf(url);
      setPdf(response);
    };

    callFunction();
  }, [url]);

  return (
    <Paper elevation={4} sx={{ borderRadius: '1rem', flexGrow: 1, height: '30vh', width: 300, maxWidth: 400, display: 'flex', flexDirection: 'column' }} onClick={() => window.open(url, '_blank')}>
      <Typography sx={{ padding: '1rem' }} variant="button">{name ?? "Unknown"}</Typography>
      {pdf ? (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', flexGrow: 1 }}>
          <Typography variant='h4'>{pdf}</Typography>
        </Box>
      ) : (
        <Box sx={{ borderRadius: '1rem', backgroundImage: `url(${url})`, backgroundSize: 'cover', width: '100%', flexGrow: 1 }} />
      )}
    </Paper>
  );
};

const Details = ({ item }: { item: AddBody }) => (
  <Box sx={{ padding: '1rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column', gap: 1, flexGrow: 1 }}>
    <Item {...{ item: item.codiceArticolo, title: 'Codice Articolo' }} />
    <Item {...{ item: item.description, title: 'Descrizione' }} />
    <Item {...{ item: item.tipofinitura, title: 'Tipo Finitura' }} />
    <Item {...{ item: item.altezzafinita, title: 'Altezza Finita' }} />
    <Item {...{ item: item.numerofili, title: 'Numero Fili' }} />
    <Item {...{ item: item.rigato ? 'Si' : 'No', title: 'Rigato' }} />
    <Item {...{ item: item.tipomaglia, title: 'Tipo Maglia' }} />
    <Item {...{ item: item.schedadilavorazione, title: 'Scheda di lavorazione' }} />
    <Item {...{ item: item.filato, title: 'Filato' }} />
  </Box>
);
