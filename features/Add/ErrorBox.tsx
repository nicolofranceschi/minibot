
import { Paper, Box, Typography, Stack } from "@mui/material";
import { OrangePulse, RedPulse } from "components/Puls";
import { Fragment } from "react";


export function ErrorBox({ children, label, error, warnings }: ChildrenProps & { label: string; error?: string; warnings?: string; }) {

    return (
        <Paper elevation={4} sx={{ padding: '1rem', display: 'flex ', gap: 2, flexDirection: "column", borderRadius: '1rem', flexGrow: 2, width: 300 }}>
            <Stack direction="row" alignItems='center' sx={{ gap: 2 }}>
                <Box>
                    {error ? <RedPulse /> : warnings ? <OrangePulse /> : null}
                </Box>
                <Typography variant="button">{label}</Typography>
            </Stack>
            {children}
            {error ? <Typography variant="caption" color="error">{error}</Typography> : warnings ? <Typography variant="caption" color="rgba(255, 121, 63, 1)">{warnings}</Typography> : <Typography variant="caption" color="green">OK !</Typography>}
        </Paper>
    );
}

export function ErrorBoxNoPaper({ children, label, error, warnings, id }: ChildrenProps & { label: string; error?: string; warnings?: string; id: number }) {

    return (
        <Stack direction="column" sx={{ gap: 2 , width: "100%" }}>
            <Stack direction="row" alignItems='center' sx={{ gap: 2 }}>
                <Typography>{id}</Typography>
                {children}
            </Stack>
            <Stack direction="row" alignItems='center' sx={{ gap: 2 }}>
                <Box>
                    {error ? <RedPulse /> : warnings ? <OrangePulse /> : null}
                </Box>
                {error ? <Typography variant="caption" color="error">{error}</Typography> : warnings ? <Typography variant="caption" color="rgba(255, 121, 63, 1)">{warnings}</Typography> : <Typography variant="caption" color="green">OK !</Typography>}
            </Stack>
        </Stack>
    );
}

