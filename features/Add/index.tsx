import { Box, TextField, Autocomplete, Button, Checkbox } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import FormControlLabel from '@mui/material/FormControlLabel';
import { ErrorBox } from "./ErrorBox";
import ControlledAutocomplete from "components/ControlledAutocomplete";
import { IsInt } from "utils/functions";
import FileBlock from "components/FileBlock";

interface FormAdd {
    codiceArticolo: string;
    description: string;
    tipoFinitura: string;
    rigato: boolean;
    puntomaglia: string;
    altezzafinita: string;
    numerofili: string;
    schedadilavorazione: string;
    tipomaglia: string;
    filato: string;
}

const top100Films = [
    'test',
    'abc',
    'def'
]


export default function Add() {

    const { register, handleSubmit, control, formState: { errors } } = useForm<FormAdd>({
        mode: 'onChange',
        criteriaMode: 'all'
    });

    const onSubmit = (data: FormAdd) => {
        console.log(data);
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <Box sx={{ padding: '1rem', display: 'flex', flexDirection: "column", gap: 1 }}>
                <ErrorBox label="Codice articolo" error={errors.codiceArticolo?.message}>
                    <TextField id="id" variant="outlined" placeholder="Campo alfanumerico" {...register("codiceArticolo", {
                        required: 'Il campo è obbligatorio',
                        minLength: { value: 10, message: 'Il campo deve contenere almeno 10 caratteri' },
                    })} />
                </ErrorBox>
                <ErrorBox label="Note" error={errors.description?.message}>
                    <TextField multiline rows={6} id="description" variant="outlined" placeholder="Campo alfanumerico" {...register("description")} />
                </ErrorBox>
                <ErrorBox label="Tipo Finitura" error={errors.tipoFinitura?.message}>
                    <ControlledAutocomplete {...{ control, options: top100Films, label: "Seleziona Tipo Finitura", name: "tipofinitura" }} />
                </ErrorBox>
                <ErrorBox label="Tipo Punto Maglia" error={errors.puntomaglia?.message}>
                    <ControlledAutocomplete {...{ control, options: top100Films, label: "Seleziona Tipo Punto Maglia", name: "puntomaglia" }} />
                </ErrorBox>
                <ErrorBox label="Altezza finita" error={errors.altezzafinita?.message}>
                    <TextField id="altezzafinita" variant="outlined" type="number" placeholder="Numero da 1 a 50" {...register("altezzafinita", {
                        required: 'Il campo è obbligatorio',
                        valueAsNumber: true,
                        min: { value: 1, message: 'Il campo deve essere maggiore di 0' },
                        max: { value: 50, message: 'Il campo deve essere minore di 50' },
                    })} />
                </ErrorBox>
                <ErrorBox label="Numero fili" error={errors.numerofili?.message}>
                    <TextField id="numerofili" variant="outlined" type="number" placeholder="Numero intero da 1 a 10" {...register("numerofili", {
                        required: 'Il campo è obbligatorio',
                        validate: x => IsInt(x), // bho
                        valueAsNumber: true,
                        min: { value: 1, message: 'Il campo deve essere maggiore di 0' },
                        max: { value: 10, message: 'Il campo deve essere minore di 10' },
                    })} />
                </ErrorBox>
                <ErrorBox label="Rigato">
                    <Controller
                        name="rigato"
                        control={control}
                        render={({ field }) => (
                            <FormControlLabel control={
                                <Checkbox
                                    checked={field.value ?? false}
                                    onChange={(_, value) => field.onChange({ target: { value } })} />
                            } label="SI/NO" />
                        )}
                    />
                </ErrorBox>
                <ErrorBox label="Tipo Maglia" error={errors.tipomaglia?.message}>
                    <ControlledAutocomplete {...{ control, options: top100Films, label: "Seleziona Tipo Maglia", name: "tipomaglia" }} />
                </ErrorBox>
                <ErrorBox label="Scheda di lavorazione" error={errors.schedadilavorazione?.message}>
                    <TextField id="schedadilavorazione" variant="outlined" placeholder="4 cifre" {...register("schedadilavorazione", {
                        required: 'Il campo è obbligatorio',
                        maxLength: { value: 4, message: 'Il campo non può avere più di 4 cifre' },
                    })} />
                </ErrorBox>
                <ErrorBox label="Filato" error={errors.filato?.message}>
                    <ControlledAutocomplete {...{ control, options: top100Films, label: "Seleziona Tipo filato", name: "filato" }} />
                </ErrorBox>
                <FileBlock />
                <Button variant="contained" type="submit" sx={{ padding: '1rem', display: 'flex', borderRadius: '1rem' }}>SALVA</Button>
            </Box>
        </form>
    )
}

