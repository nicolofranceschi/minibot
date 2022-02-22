import { TextField, Button, Checkbox } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import FormControlLabel from '@mui/material/FormControlLabel';
import { ErrorBox } from './ErrorBox';
import ControlledAutocomplete from 'components/ControlledAutocomplete';
import FileBlock from 'components/FileBlock';
import { object, string, boolean, number, InferType } from 'yup';
import { useState } from 'react';
import useResolver from 'hooks/useResolver';

const schema = object({
  codiceArticolo: string().required('Il campo è obbligatorio').min(10, 'Il campo deve contenere almeno 10 caratteri'),
  description: string(),
  tipoFinitura: string(),
  rigato: boolean(),
  puntomaglia: string(),
  altezzafinita: number()
    .typeError('Il campo deve essere un numero')
    .positive('Il campo deve essere maggiore di 0')
    .integer('Il campo deve essere un numero intero')
    .required('Il campo è obbligatorio')
    .max(50, 'Il campo deve essere minore di 50'),
  numerofili: number()
    .typeError('Il campo deve essere un numero')
    .positive('Il campo deve essere maggiore di 0')
    .integer('Il campo deve essere un numero intero')
    .required('Il campo è obbligatorio')
    .max(50, 'Il campo deve essere minore di 50'),
  schedadilavorazione: string().required('Il campo è obbligatorio').max(4, 'Il campo non può avere più di 4 cifre'),
  tipomaglia: string(),
  filato: string(),
});

const formStyle = { padding: '1rem', display: 'flex', flexDirection: 'column', gap: 1 } as const;

const top100Films = ['test', 'abc', 'def'];
type Form = InferType<typeof schema>;
type WarningsType = Partial<
  Record<
    keyof Form,
    {
      message: string;
    }
  >
>;

export default function Add() {
  const [warnings, setWarnings] = useState<WarningsType>({});
  const resolver = useResolver(schema, setWarnings);

  const { register, handleSubmit, control } = useForm<Form>({
    mode: 'onChange',
    resolver,
  });

  const onSubmit = (data: Form) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete='off' style={formStyle}>
      <ErrorBox label='Codice articolo' error={warnings.codiceArticolo?.message}>
        <TextField id='id' variant='outlined' placeholder='Campo alfanumerico' {...register('codiceArticolo')} />
      </ErrorBox>
      <ErrorBox label='Note' error={warnings.description?.message}>
        <TextField multiline rows={6} id='description' variant='outlined' placeholder='Campo alfanumerico' {...register('description')} />
      </ErrorBox>
      <ErrorBox label='Tipo Finitura' error={warnings.tipoFinitura?.message}>
        <ControlledAutocomplete {...{ control, options: top100Films, label: 'Seleziona Tipo Finitura', name: 'tipofinitura' }} />
      </ErrorBox>
      <ErrorBox label='Tipo Punto Maglia' error={warnings.puntomaglia?.message}>
        <ControlledAutocomplete {...{ control, options: top100Films, label: 'Seleziona Tipo Punto Maglia', name: 'puntomaglia' }} />
      </ErrorBox>
      <ErrorBox label='Altezza finita' error={warnings.altezzafinita?.message}>
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
      <ErrorBox label='Numero fili' error={warnings.numerofili?.message}>
        <TextField
          id='numerofili'
          variant='outlined'
          type='number'
          placeholder='Numero intero da 1 a 10'
          {...register('numerofili', {
            valueAsNumber: true,
          })}
        />
      </ErrorBox>
      <ErrorBox label='Rigato'>
        <Controller
          name='rigato'
          control={control}
          render={({ field }) => <FormControlLabel control={<Checkbox checked={field.value ?? false} onChange={(_, value) => field.onChange({ target: { value } })} />} label='SI/NO' />}
        />
      </ErrorBox>
      <ErrorBox label='Tipo Maglia' error={warnings.tipomaglia?.message}>
        <ControlledAutocomplete {...{ control, options: top100Films, label: 'Seleziona Tipo Maglia', name: 'tipomaglia' }} />
      </ErrorBox>
      <ErrorBox label='Scheda di lavorazione' error={warnings.schedadilavorazione?.message}>
        <TextField id='schedadilavorazione' variant='outlined' placeholder='4 cifre' {...register('schedadilavorazione')} />
      </ErrorBox>
      <ErrorBox label='Filato' error={warnings.filato?.message}>
        <ControlledAutocomplete {...{ control, options: top100Films, label: 'Seleziona Tipo filato', name: 'filato' }} />
      </ErrorBox>
      {/* <FileBlock /> */}
      <Button variant='contained' type='submit' sx={{ padding: '1rem', display: 'flex', borderRadius: '1rem' }}>
        SALVA
      </Button>
    </form>
  );
}
