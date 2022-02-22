import { Autocomplete, TextField } from '@mui/material';
import { Control, Controller } from 'react-hook-form';

export default function ControlledAutocomplete({ control, options, label, name }: { control: Control<any>; options: string[]; label: string; name: string }) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Autocomplete
          value={field.value ?? null}
          onChange={(_, value) => field.onChange({ target: { value } })}
          disablePortal
          options={options}
          sx={{ width: 300 }}
          renderInput={params => <TextField {...params} label={label} />}
        />
      )}
    />
  );
}
