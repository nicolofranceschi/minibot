
import { Paper,Box, Typography, Stack } from "@mui/material";
import { GreenPulse , RedPulse } from "components/Puls";


export function ErrorBox({ children, label, error }: ChildrenProps & { label: string; error?: string; }) {

    return (
        <Paper elevation={4} sx={{ padding: '1rem', display: 'flex ', gap: 2, flexDirection: "column", borderRadius: '1rem'}}>
            <Stack direction="row" alignItems='center' sx={{gap:2}}>
                <Box>
                    {error ? <RedPulse /> : <GreenPulse />}
                </Box>
                <Typography variant="button">{label}</Typography>
            </Stack>
            {children}
            {error && <Typography variant="caption" color="error">{error}</Typography>}
        </Paper>
    );
}
