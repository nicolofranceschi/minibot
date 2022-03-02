import { Autocomplete, createFilterOptions, TextField } from '@mui/material';
import { Control, Controller } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { addDataToAutoCompletes, getAutoCompletes, removeDataToAutoCompletes } from 'config/firebase/db';

const filter = createFilterOptions();
const QUERY_KEY = 'getAutoCompletes';

type ArrayFunction = (arr: string[], val: string) => string[];
type Ret = { data: Autocomplete[] | null };

const ADD_LABEL = 'Aggiungi';
const addToArray: ArrayFunction = (arr, val) => [...arr, val];
const removeFromArray: ArrayFunction = (arr, val) => arr.filter(v => v !== val);
const isNew = (s: string) => s.startsWith(ADD_LABEL);

export default function ControlledAutocomplete({ control, name, label }: { control: Control<any>; options: string[]; label: string; name: string }) {
  const selectAutocompleteFromDB = ({ data }: Ret) => data?.find(o => o.id === name)?.options ?? [];

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
  const { mutate: add } = useMutation(data => addDataToAutoCompletes(name, data), mutationOptions(addToArray));
  const { mutate: remove } = useMutation(data => removeDataToAutoCompletes(name, data), mutationOptions(removeFromArray));

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
              const value = isNew(newValue) ? newValue.split(`${ADD_LABEL} `)[1] : newValue;
              if (isNew(newValue)) add(value);
              onChange({ target: { value } });
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
              <span>{option}</span>
              {!isNew(option) && (
                <span
                  onClick={e => {
                    e.stopPropagation();
                    remove(option);
                    if (option === value) onChange({ target: { value: null } });
                  }}
                >
                  x
                </span>
              )}
            </li>
          )}
          freeSolo
          renderInput={params => <TextField {...params} label={label} />}
        />
      )}
    />
  );
}
