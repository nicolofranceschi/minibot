import { TextField, Button, Checkbox, CircularProgress, Backdrop, Stack, Paper, Typography } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import FormControlLabel from '@mui/material/FormControlLabel';
import { ErrorBox, ErrorBoxNoPaper } from './ErrorBox';
import ControlledAutocomplete from 'components/ControlledAutocomplete';
import FileBlock from 'components/FileBlock';
import useResolver, { aggregateResolvers } from 'hooks/useResolver';
import useFiles from 'components/FileBlock/useFiles';
import { AddBody, warningsObject , errorsObject } from 'features/Add/schema';
import { useUpload } from './useUpload';
import { useState } from 'react';
import { object, string } from 'yup';

const formStyle = { padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' } as const;

const top100Films = ['test', 'abc', 'def'];

export default function Add() {

  const [schema,setSchema] = useState({warnings:warningsObject,errors:errorsObject,Npuntomaglia:0});

  const [warnings, warningsResolver] = useResolver(object(schema.warnings), true);
  const [errors, errorsResolver] = useResolver(object(schema.errors));

  const { filesProps } = useFiles();

  const { register, handleSubmit, control } = useForm<AddBody>({
    mode: 'onChange',
    resolver: aggregateResolvers(warningsResolver, errorsResolver),
  });

  const { carica, isLoading } = useUpload();

  const onSubmit = async (data: AddBody) => {
    carica({ data, files: filesProps.files });

  };

  console.log(schema)

  const addPuntomaglia = () => {
    setSchema(e => ({Npuntomaglia: e.Npuntomaglia +1 , warnings:{...e.warnings,[`puntomaglia_${e.Npuntomaglia+2}`]:string().required('Il campo è obbligatorio').nullable()},errors:{...e.errors,[`puntomaglia_${e.Npuntomaglia+2}`]:string().required('Il campo è obbligatorio').nullable()}}))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete='off' style={formStyle}>
      <Backdrop sx={{ color: '#fff', zIndex: 100 }} open={isLoading}>
        <CircularProgress color='inherit' />
      </Backdrop>
      <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
        <ErrorBox label='Codice articolo' error={errors.codiceArticolo?.message} warnings={warnings.codiceArticolo?.message}>
          <TextField id='id' variant='outlined' placeholder='Campo alfanumerico' {...register('codiceArticolo')} />
        </ErrorBox>
        <ErrorBox label='Note' error={errors.description?.message} warnings={warnings.description?.message}>
          <TextField multiline rows={6} id='description' variant='outlined' placeholder='Campo alfanumerico' {...register('description')} />
        </ErrorBox>
        <ErrorBox label='Tipo Finitura' error={errors.tipofinitura?.message} warnings={warnings.tipofinitura?.message}>
          <ControlledAutocomplete {...{ control, options: top100Films, label: 'Seleziona Tipo Finitura', name: 'tipofinitura', id: 'tipofinitura' }} />
        </ErrorBox>
        <Paper elevation={4} sx={{ padding: '1rem', display: 'flex ', gap: 2, flexDirection: "row", flexWrap: "wrap",borderRadius: '1rem', flexGrow: 2, width: 300 }}>
          <Typography variant="button">tipo punto maglia</Typography>
          {Array.from({ length: schema.Npuntomaglia + 1 }, (_, index) => index + 1).map((_, i) => (
            <ErrorBoxNoPaper key={i+1} label='Tipo Punto Maglia' error={errors[`puntomaglia_${i+1}`]?.message} warnings={warnings.puntomaglia_1?.message} id={i+1}>
              <ControlledAutocomplete {...{ control, options: top100Films, label: 'Seleziona Tipo Punto Maglia', name: `puntomaglia_${i+1}`, id: "puntomaglia" }} />
            </ErrorBoxNoPaper>
          ))}
          <Stack direction="row" alignItems='center' sx={{ gap: 2 }}>
            <Typography>{schema.Npuntomaglia + 2}</Typography>
            <Button onClick={addPuntomaglia} >AGGIUNGI </Button>
          </Stack>
        </Paper>
        <ErrorBox label='Altezza finita' error={errors.altezzafinita?.message} warnings={warnings.altezzafinita?.message}>
          <TextField
            id='altezzafinita'
            variant='outlined'
            type='number'
            placeholder='Numero da 1 a 50'
            {...register('altezzafinita', {
              valueAsNumber: true,
            })}
          />
        </ErrorBox>
        <ErrorBox label='Numero fili' error={errors.numerofili?.message} warnings={warnings.numerofili?.message}>
          <TextField
            id='numerofili'
            variant='outlined'
            type='number'
            placeholder='Numero intero da 1 a 10'
            {...register('numerofili')}
          />
        </ErrorBox>
        <ErrorBox label='Rigato'>
          <Controller
            name='rigato'
            control={control}
            render={({ field }) => <FormControlLabel control={<Checkbox checked={field.value ?? false} onChange={(_, value) => field.onChange({ target: { value } })} />} label='SI/NO' />}
          />
        </ErrorBox>
        <ErrorBox label='Tipo Maglia' error={errors.tipomaglia?.message} warnings={warnings.tipomaglia?.message}>
          <ControlledAutocomplete {...{ control, options: top100Films, label: 'Seleziona Tipo Maglia', name: 'tipomaglia', id: 'tipomaglia' }} />
        </ErrorBox>
        <ErrorBox label='Scheda di lavorazione' error={errors.schedadilavorazione?.message} warnings={warnings.schedadilavorazione?.message}>
          <TextField id='schedadilavorazione' variant='outlined' placeholder='4 cifre' {...register('schedadilavorazione')} />
        </ErrorBox>
        <ErrorBox label='Filato' error={errors.filato?.message} warnings={warnings.filato?.message}>
          <ControlledAutocomplete {...{ control, options: top100Films, label: 'Seleziona Tipo filato', name: 'filato', id: 'filato' }} />
        </ErrorBox>
      </Stack>
      <FileBlock {...filesProps} />
      <Button variant='contained' type='submit' sx={{ padding: '1rem', width: 'calc(100% - 70px)', borderRadius: '1rem' }}>
        SALVA
      </Button>
    </form>
  );
}
