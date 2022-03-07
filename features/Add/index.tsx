import { TextField, Button, CircularProgress, Backdrop, Stack, Paper, Typography, RadioGroup, Radio, AccordionSummary, AccordionDetails, Divider } from '@mui/material';
import { useForm, Controller, useWatch, useFieldArray } from 'react-hook-form';
import FormControlLabel from '@mui/material/FormControlLabel';
import { ErrorBox, ErrorBoxNoPaper, ErrorAcordion } from './ErrorBox';
import ControlledAutocomplete from 'components/ControlledAutocomplete';
import FileBlock from 'components/FileBlock';
import useResolver, { aggregateResolvers } from 'hooks/useResolver';
import useFiles from 'components/FileBlock/useFiles';
import { Scheda, warningsObject, errorsObject, errorsObjectCalati } from 'features/Add/schema';
import { useUpload } from './useUpload';
import { useEffect, useState } from 'react';
import { object, string } from 'yup';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion } from 'components/Acordion';

const formStyle = { padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' } as const;

export default function Add({ dataFirebase }: { dataFirebase?: any }) {

  const [schema, setSchema] = useState({ warnings: warningsObject, errors: errorsObject, Npuntomaglia: dataFirebase?.Npuntomaglia ?? 0 });

  const [warnings, warningsResolver] = useResolver(object(schema.warnings), true);
  const [errors, errorsResolver] = useResolver(object(schema.errors));

  const { filesProps } = useFiles();

  const { register, handleSubmit, reset, control } = useForm<Scheda>({
    mode: 'onChange',
    shouldUnregister: true,
    resolver: aggregateResolvers(warningsResolver, errorsResolver),
    defaultValues: dataFirebase ?? { rigato: 'non rigato' },
  });

  const tipofinitura = useWatch({
    control,
    name: 'tipofinitura',
  });

  useEffect(() => {
    if (tipofinitura === 'collo calato') setSchema(e => ({ ...e, errors: { ...errorsObject, ...errorsObjectCalati } }));
    else setSchema(e => ({ ...e, errors: errorsObject }));
  }, [tipofinitura]);

  const { carica, modifica, isLoading } = useUpload(() => {
    setSchema({ warnings: warningsObject, errors: errorsObject, Npuntomaglia: dataFirebase?.Npuntomaglia ?? 0 });
    reset();
    filesProps.resetFiles();
  });

  console.log(dataFirebase)

  const onSubmit = async (data: Scheda) => {
    if (dataFirebase) modifica({ data, files: filesProps.files , Npuntomaglia: schema.Npuntomaglia , id : dataFirebase.id , lengths : dataFirebase.files?.length , previousFiles: dataFirebase.files  })
    else carica({ data, files: filesProps.files , Npuntomaglia: schema.Npuntomaglia });
  };

  const addPuntomaglia = () => {
    setSchema(e => ({
      Npuntomaglia: e.Npuntomaglia + 1,
      warnings: { ...e.warnings, [`puntomaglia_${e.Npuntomaglia + 2}`]: string().required('Il campo è obbligatorio').nullable() },
      errors: { ...e.errors, [`puntomaglia_${e.Npuntomaglia + 2}`]: string().required('Il campo è obbligatorio').nullable() },
    }));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete='off' style={formStyle}>
      <Backdrop sx={{ color: '#fff', zIndex: 100 }} open={isLoading}>
        <CircularProgress color='inherit' />
      </Backdrop>
      <Stack direction='row' sx={{ flexWrap: 'wrap', gap: 1 }}>
        <ErrorBox label='Scheda di lavorazione' error={errors.schedadilavorazione?.message} warnings={warnings.schedadilavorazione?.message}>
          <TextField id='schedadilavorazione' variant='outlined' placeholder='4 cifre' {...register('schedadilavorazione')} />
        </ErrorBox>
        <ErrorBox label='Tipo Maglia' error={errors.tipomaglia?.message} warnings={warnings.tipomaglia?.message}>
          <ControlledAutocomplete {...{ control, label: 'Seleziona Tipo Maglia', name: 'tipomaglia', id: 'tipomaglia' }} />
        </ErrorBox>
        <ErrorBox label='Codice articolo' error={errors.codiceArticolo?.message} warnings={warnings.codiceArticolo?.message}>
          <TextField id='id' variant='outlined' placeholder='Campo alfanumerico' {...register('codiceArticolo')} />
        </ErrorBox>
      <ErrorBox label='Cliente' error={errors.cliente?.message} warnings={warnings.cliente?.message}>
          <ControlledAutocomplete {...{ control, label: 'Seleziona Cliente', name: 'cliente', id: 'cliente' }} />
        </ErrorBox>
        <ErrorBox label='Tipo Finitura' error={errors.tipofinitura?.message} warnings={warnings.tipofinitura?.message}>
          <ControlledAutocomplete {...{ control, label: 'Seleziona Tipo Finitura', name: 'tipofinitura', id: 'tipofinitura' }} />
        </ErrorBox>
        <Paper elevation={4} sx={{ padding: '1rem', display: 'flex ', gap: 2, flexDirection: 'row', flexWrap: 'wrap', borderRadius: '1rem', flexGrow: 2, width: 300 }}>
          <Typography variant='button'>tipo punto maglia</Typography>
          {Array.from({ length: schema.Npuntomaglia + 1 }, (_, index) => index + 1).map((_, i) => (
            <ErrorBoxNoPaper key={i + 1} label='Tipo Punto Maglia' error={errors[`puntomaglia_${i + 1}`]?.message} warnings={warnings[`puntomaglia_${i + 1}`]?.message} id={i + 1}>
              <ControlledAutocomplete {...{ control, label: 'Seleziona Tipo Punto Maglia', name: `puntomaglia_${i + 1}`, id: 'puntomaglia' }} />
            </ErrorBoxNoPaper>
          ))}
          <Stack direction='row' alignItems='center' sx={{ gap: 2 }}>
            <Typography>{schema.Npuntomaglia + 2}</Typography>
            <Button onClick={addPuntomaglia}>AGGIUNGI </Button>
          </Stack>
        </Paper>
        <ErrorBox label='Altezza finita' error={errors.altezzafinita?.message} warnings={warnings.altezzafinita?.message}>
          <TextField id='altezzafinita' variant='outlined' placeholder='Numero da 1 a 50' {...register('altezzafinita')} />
        </ErrorBox>
        <ErrorBox label='Filato' error={errors.filato?.message} warnings={warnings.filato?.message}>
          <ControlledAutocomplete {...{ control, label: 'Seleziona Tipo filato', name: 'filato', id: 'filato' }} />
        </ErrorBox>
        <ErrorBox label='Numero fili' error={errors.numerofili?.message} warnings={warnings.numerofili?.message}>
          <TextField id='numerofili' variant='outlined' type='number' placeholder='Numero intero da 1 a 10' {...register('numerofili')} />
        </ErrorBox>
        <ErrorBox label='Rigato' error={errors.rigato?.message} warnings={warnings.rigato?.message}>
          <Controller
            name='rigato'
            control={control}
            render={({ field }) => (
              <RadioGroup row value={field.value ?? ''} onChange={(_, value) => field.onChange({ target: { value } })}>
                <FormControlLabel value='rigato' control={<Radio />} label='SI' />
                <FormControlLabel value='non rigato' control={<Radio />} label='NO' />
              </RadioGroup>
            )}
          />
        </ErrorBox>
        <ErrorBox label='Note' error={errors.description?.message} warnings={warnings.description?.message}>
          <TextField multiline rows={6} id='description' variant='outlined' placeholder='Campo alfanumerico' {...register('description')} />
        </ErrorBox>
        {tipofinitura === 'collo calato' && (
          <Accordion sx={{ flexGrow: 1, borderRadius: '1rem', padding: '1rem', mt: 0 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1a-content' id='panel1a-header'>
              <Typography>Collo calato opzioni</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ flexWrap: 'wrap', gap: 3, flexDirection: 'row', display: 'flex' }}>
              <ErrorAcordion label='Numero Calati' error={errors.numerocalati?.message} warnings={warnings.numerocalati?.message}>
                <TextField id='numerocalati' variant='outlined' type='number' placeholder='Numero intero ' {...register('numerocalati')} />
              </ErrorAcordion>
              <ErrorAcordion label='Piedino' error={errors.piedino?.message} warnings={warnings.piedino?.message}>
                <Controller
                  name='piedino'
                  control={control}
                  render={({ field }) => (
                    <RadioGroup row value={field.value ?? ''} onChange={(_, value) => field.onChange({ target: { value } })}>
                      <FormControlLabel value='tondo' control={<Radio />} label='Tondo' />
                      <FormControlLabel value='quadrato' control={<Radio />} label='Quadrato' />
                      <FormControlLabel value='no' control={<Radio />} label='NO' />
                    </RadioGroup>
                  )}
                />
              </ErrorAcordion>
              <ErrorAcordion label='Flessage' error={errors.flessage?.message} warnings={warnings.flessage?.message}>
                <Controller
                  name='flessage'
                  control={control}
                  render={({ field }) => (
                    <RadioGroup row value={field.value ?? ''} onChange={(_, value) => field.onChange({ target: { value } })}>
                      <FormControlLabel value='si' control={<Radio />} label='SI' />
                      <FormControlLabel value='no' control={<Radio />} label='NO' />
                    </RadioGroup>
                  )}
                />
              </ErrorAcordion>
            </AccordionDetails>
          </Accordion>
        )}
      </Stack>
      <FileBlock {...filesProps} />
      <Button variant='contained' type='submit' sx={{ padding: '1rem', width: 'calc(100% - 70px)', borderRadius: '1rem' }}>
        {dataFirebase ? "MODIFICA" : "SALVA"}
      </Button>
    </form>
  );
}
