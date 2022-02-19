import { Box, Paper, TextField, Typography, Autocomplete, Button } from "@mui/material";
import { useForm,Controller } from "react-hook-form";

interface FormAdd {
    codiceArticolo: string;
    description: string;
    tipoFinitura: string;
}

const top100Films = [
    { label: 'The Shawshank Redemption', year: 1994 },
    { label: 'The Godfather', year: 1972 },
    { label: 'The Godfather: Part II', year: 1974 },
    { label: 'The Dark Knight', year: 2008 },
    { label: '12 Angry Men', year: 1957 },
    { label: "Schindler's List", year: 1993 },
    { label: 'Pulp Fiction', year: 1994 }
]

export default function Add() {

    const { register, handleSubmit,control, watch, formState: { errors } } = useForm<FormAdd>();
    const onSubmit = (data: FormAdd) => {
        console.log(data);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <Box sx={{ padding: '1rem', display: 'flex', flexDirection: "column", gap: 1 }}>
                <Paper elevation={4} sx={{ padding: '1rem', display: 'flex ', gap: 2, flexDirection: "column", borderRadius: '1rem' }}>
                    <Typography variant="button">Codice articolo</Typography>
                    <TextField id="id" variant="outlined" placeholder="Campo alfanumerico" {...register("codiceArticolo")} />
                </Paper>
                <Paper elevation={4} sx={{ padding: '1rem', display: 'flex ', gap: 2, flexDirection: "column", borderRadius: '1rem' }}>
                    <Typography variant="button">note</Typography>
                    <TextField multiline rows={6} id="description" variant="outlined" placeholder="Campo alfanumerico" {...register("description")} />
                </Paper>
                <Paper elevation={4} sx={{ padding: '1rem', display: 'flex ', gap: 2, flexDirection: "column", borderRadius: '1rem' }}>
                    <Typography variant="button">Tipo Finitura</Typography>
                    <Controller
                        name="tipoFinitura"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => ( 
                        <Autocomplete
                            {...field}
                            disablePortal
                            id="tipoFinitura"
                            options={top100Films}
                            sx={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="Seleziona tipo finitura" />}
                        />
                        )}
                    />
                </Paper>
                <Button type="submit">SALVA</Button>
            </Box>
        </form>
    )
}