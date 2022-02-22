import { TextField, Button, Checkbox, CircularProgress, Backdrop } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import FormControlLabel from '@mui/material/FormControlLabel';
import { ErrorBox } from './ErrorBox';
import ControlledAutocomplete from 'components/ControlledAutocomplete';
import FileBlock from 'components/FileBlock';
import { useState } from 'react';
import useResolver from 'hooks/useResolver';
import useFiles from 'components/FileBlock/useFiles';
import { Form, schema, WarningsType } from 'config/schema';
import { useUpload } from './useUpload';


const formStyle = { padding: '1rem', display: 'flex', flexDirection: 'column', gap: "1rem" } as const;

const top100Films = ['test', 'abc', 'def'];


export default function Add() {

    const [warnings, setWarnings] = useState<WarningsType>({});
    const resolver = useResolver(schema, setWarnings);

    const { filesProps } = useFiles();

    const { register, handleSubmit, control } = useForm<Form>({
        mode: 'onChange',
        resolver,
    });

    const { carica, percent , isLoading } = useUpload()

    const onSubmit = async (data: Form) => {
        console.log(warnings)
        if(Object.values(warnings).length === 0) return;
        carica({ data, files: filesProps.files })
    };

    console.log(percent)

    return (
        <form onSubmit={handleSubmit(onSubmit)} autoComplete='off' style={formStyle}>
            <Backdrop sx={{ color: '#fff', zIndex: 100 }} open={isLoading}>
                <CircularProgress color="inherit" />
            </Backdrop>
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
            <FileBlock {...filesProps} />
            <Button variant='contained' type='submit' sx={{ padding: '1rem', display: 'flex', borderRadius: '1rem' }}>
                SALVA
            </Button>
        </form>
    );
}
