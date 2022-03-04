import { Autocomplete, createFilterOptions, TextField, Typography, IconButton } from '@mui/material';
import { Control, Controller } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { addDataToAutoCompletes, getAutoCompletes, removeDataToAutoCompletes } from 'config/firebase/db';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from 'services/auth';

const filter = createFilterOptions();
const QUERY_KEY = 'getAutoCompletes';

type ArrayFunction = (arr: string[], val: string) => string[];
type Ret = { data: Autocomplete[] | null };

const ADD_LABEL = 'Aggiungi';
const addToArray: ArrayFunction = (arr, val) => [...arr, val];
const removeFromArray: ArrayFunction = (arr, val) => arr.filter(v => v !== val);
const isNew = (s: string) => s.startsWith(ADD_LABEL);

export default function ControlledAutocomplete({ control, name, label, id }: { control: Control<any>; label: string; name: string; id: string }) {
  const selectAutocompleteFromDB = ({ data }: Ret) => data?.find(o => o.id === id)?.options ?? [];

  const { user } = useAuth();

  const queryClient = useQueryClient();
  const mutationOptions = (fn: ArrayFunction) => ({
    onMutate: async (option: string) => {
      await queryClient.cancelQueries(QUERY_KEY);

      const previousTodos = selectAutocompleteFromDB(queryClient.getQueryData(QUERY_KEY) ?? { data: [] });

      queryClient.setQueryData(QUERY_KEY, old => fn(selectAutocompleteFromDB((old ?? { data: [] }) as Ret), option));

      return { previousTodos };
    },
    onError: (err: unknown, option: unknown, context: { previousTodos: string[] } | undefined) => {
      queryClient.setQueryData(QUERY_KEY, context?.previousTodos);
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEY),
  });
  const { data: options } = useQuery([QUERY_KEY], getAutoCompletes, {
    select: selectAutocompleteFromDB,
  });
  const { mutate: add } = useMutation(data => addDataToAutoCompletes(id, data), mutationOptions(addToArray));
  const { mutate: remove } = useMutation(data => removeDataToAutoCompletes(id, data), mutationOptions(removeFromArray));

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <Autocomplete
          value={value ?? null}
          onChange={(_, newValue) => {
            if (!newValue) onChange({ target: { value: null } });
            else {
              if (user?.status === 'ADMIN') {
                const value = isNew(newValue) ? newValue.split(`${ADD_LABEL} `)[1] : newValue;
                if (isNew(newValue)) add(value);
                onChange({ target: { value } });
              } else onChange({ target: { value: newValue } });
            }
          }}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);
            const { inputValue } = params;
            const isExisting = options.some(option => inputValue === option);
            if (inputValue !== '' && !isExisting) filtered.push(`${ADD_LABEL} ${inputValue}`);

            return filtered;
          }}
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          options={options ?? []}
          renderOption={(props, option) => (
            <li {...props} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography>{option}</Typography>
              {!isNew(option) && user?.status === 'ADMIN' && (
                <IconButton
                  onClick={e => {
                    e.stopPropagation();
                    remove(option);
                    if (option === value) onChange({ target: { value: null } });
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </li>
          )}
          freeSolo
          sx={{ flexGrow: 1 }}
          renderInput={params => <TextField {...params} label={label} />}
        />
      )}
    />
  );
}
