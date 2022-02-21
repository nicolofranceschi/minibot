import { useTheme } from "@emotion/react";
import { Box, TextField, Typography, Autocomplete, Button, Checkbox } from "@mui/material";
import { useForm,Controller } from "react-hook-form";

interface FormAdd {
    codiceArticolo: string;
    description: string;
    tipoFinitura: string;
    rigato: boolean;
}

const top100Films = [
    'test',
    'abc',
    'def'
]

const calcStateColor = (isError, theme) => {
    if (isError) return theme.palette.error.main
    return theme.palette.success.main
}

export default function Add() {
    const { register, handleSubmit,control, formState: { errors } } = useForm<FormAdd>({
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
                        minLength: {value: 10, message: 'Il campo deve contenere almeno 10 caratteri'},
                    })} />
                </ErrorBox>
                <ErrorBox label="Note" error={errors.description?.message}>
                    <TextField multiline rows={6} id="description" variant="outlined" placeholder="Campo alfanumerico" {...register("description")} />
                </ErrorBox>
                <ErrorBox label="Tipo Finitura" error={errors.tipoFinitura?.message}>
                    <Controller
                        name="tipoFinitura"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <Autocomplete
                                value={field.value ?? null}
                                onChange={(_, value) => field.onChange({ target: { value } })}
                                disablePortal
                                options={top100Films}
                                sx={{ width: 300 }}
                                renderInput={(params) => <TextField {...params} label="Seleziona tipo finitura" />} />
                        )}
                    />
                </ErrorBox>
                <ErrorBox label="Checkbox">
                    <Controller
                        name="rigato"
                        control={control}
                        render={({ field }) => (
                            <Checkbox
                                checked={field.value ?? false}
                                onChange={(_, value) => field.onChange({ target: { value } })} />
                        )}
                    />
                </ErrorBox>
                
                <Button variant="contained" type="submit" sx={{padding: '1rem', display: 'flex' , borderRadius: '1rem'}}>SALVA</Button>
            </Box>
        </form>
    )
}

function ErrorBox ({ children, label, error }: ChildrenProps & { label: string; error?: string }) {
    const theme = useTheme();

    const color = calcStateColor(error, theme);
    return (
        <Box sx={{ padding: '1rem', display: 'flex ', gap: 2, flexDirection: "column", borderRadius: '1rem', outline: `2px solid ${color}`, outlineOffset: '-2px' }}>
            <Typography variant="button">{label}</Typography>
            {children}
            {error && <Typography variant="caption" color="error">{error}</Typography>}
        </Box>
    );
}