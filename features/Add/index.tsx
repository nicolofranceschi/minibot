import { TextField, Button, Checkbox, CircularProgress, Backdrop, Stack } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import FormControlLabel from '@mui/material/FormControlLabel';
import { ErrorBox } from './ErrorBox';
import ControlledAutocomplete from 'components/ControlledAutocomplete';
import FileBlock from 'components/FileBlock';
import useResolver, { aggregateResolvers } from 'hooks/useResolver';
import useFiles from 'components/FileBlock/useFiles';
import { AddBody, errorsSchema, warningsSchema } from 'features/Add/schema';
import { useUpload } from './useUpload';

const formStyle = { padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' } as const;

const top100Films = ['test', 'abc', 'def'];

export default function Add() {
  const [warnings, warningsResolver] = useResolver(warningsSchema, true);
  const [errors, errorsResolver] = useResolver(errorsSchema);

  const { filesProps } = useFiles();

  const { register, handleSubmit, control } = useForm<AddBody>({
    mode: 'onChange',
    resolver: aggregateResolvers(warningsResolver, errorsResolver),
  });

  console.log(warnings, errors)

  const { carica, percent, isLoading } = useUpload();

  const onSubmit = async (data: AddBody) => {
    carica({ data, files: filesProps.files });
    console.log("daata",data)
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete='off' style={formStyle}>
      <Backdrop sx={{ color: '#fff', zIndex: 100 }} open={isLoading}>
        <CircularProgress color='inherit' />
      </Backdrop>
      <Stack direction="row" sx={{flexWrap:"wrap" , gap: 1 }}>
        <ErrorBox label='Codice articolo' error={errors.codiceArticolo?.message} warnings={warnings.codiceArticolo?.message}>
          <TextField id='id' variant='outlined' placeholder='Campo alfanumerico' {...register('codiceArticolo')} />
        </ErrorBox>
        <ErrorBox label='Note' error={errors.description?.message} warnings={warnings.description?.message}>
          <TextField multiline rows={6} id='description' variant='outlined' placeholder='Campo alfanumerico' {...register('description')} />
        </ErrorBox>
        <ErrorBox label='Tipo Finitura' error={errors.tipofinitura?.message} warnings={warnings.tipofinitura?.message}>
          <ControlledAutocomplete {...{ control, options: top100Films, label: 'Seleziona Tipo Finitura', name: 'tipofinitura' }} />
        </ErrorBox>
        <ErrorBox label='Tipo Punto Maglia' error={errors.puntomaglia?.message} warnings={warnings.puntomaglia?.message}>
          <ControlledAutocomplete {...{ control, options: top100Films, label: 'Seleziona Tipo Punto Maglia', name: 'puntomaglia' }} />
        </ErrorBox>
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
          <ControlledAutocomplete {...{ control, options: top100Films, label: 'Seleziona Tipo Maglia', name: 'tipomaglia' }} />
        </ErrorBox>
        <ErrorBox label='Scheda di lavorazione' error={errors.schedadilavorazione?.message} warnings={warnings.schedadilavorazione?.message}>
          <TextField id='schedadilavorazione' variant='outlined' placeholder='4 cifre' {...register('schedadilavorazione')} />
        </ErrorBox>
        <ErrorBox label='Filato' error={errors.filato?.message} warnings={warnings.filato?.message}>
          <ControlledAutocomplete {...{ control, options: top100Films, label: 'Seleziona Tipo filato', name: 'filato' }} />
        </ErrorBox>
      </Stack>
      <FileBlock {...filesProps} />
      <Button variant='contained' type='submit' sx={{ padding: '1rem', width: 'calc(100% - 70px)', borderRadius: '1rem' }}>
        SALVA
      </Button>
    </form>
  );
}
