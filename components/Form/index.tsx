import { IconButton, InputAdornment, TextareaAutosize, TextField, Switch as UISwitch } from '@mui/material';
import { ComponentProps, HTMLProps, useEffect, useReducer } from 'react';
import { Controller, DeepPartial, FormProvider, SubmitHandler, UnpackNestedValue, useForm, useFormContext } from 'react-hook-form';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Select from '@mui/material/Select';

interface FormProps<T> extends ChildrenProps, Omit<HTMLProps<HTMLFormElement>, 'onSubmit'> {
  defaultValues?: UnpackNestedValue<DeepPartial<T>>;
  onSubmit: SubmitHandler<T>;
}

export default function Form<T extends {}>({ defaultValues, children, onSubmit = () => { }, ...props }: FormProps<T>) {
  const methods = useForm<T>({ defaultValues, shouldUnregister: false });

  useEffect(() => methods.reset(defaultValues), [defaultValues, methods]); // dynamic update

  return (
    <form onSubmit={methods.handleSubmit(onSubmit)} {...props}>
      <FormProvider {...methods}>{children}</FormProvider>
    </form>
  );
}
type Name = { name: string };
type InputProps = ComponentProps<typeof TextField> & Name;

function Input({ name, type = 'text', ...props}: InputProps) {
  const { register } = useFormContext();
  return <TextField type={type} {...register(name)} {...props} />;
}


function Hidden({ name }: Name) {
  const { register } = useFormContext();
  return <input {...register(name)} type='hidden' />;
}

function PlainInput({ name, placeholder, ...props }: Name & HTMLProps<HTMLInputElement>) {
  const { register } = useFormContext();
  return <input placeholder={placeholder} {...register(name)} {...props} />;
}

function Password(props: InputProps) {
  const [show, toggleShow] = useReducer(s => !s, false);
  return (
    <Form.Input
      type={show ? 'text' : 'password'}
      InputProps={{
        endAdornment: (
          <InputAdornment position='end'>
            <IconButton onClick={toggleShow} edge='end'>
              {show ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      {...props}
    />
  );
}

function Textarea({ name, ...props }: Name & ComponentProps<typeof TextareaAutosize>) {
  const { register } = useFormContext();
  return <TextareaAutosize {...register(name)} {...props} />;
}

function Switch({ name, ...props }: Name & ComponentProps<typeof UISwitch>) {
  const { control } = useFormContext();
  return <Controller {...{ control, name }} render={({ field: { onBlur, onChange, value } }) => <UISwitch checked={value ?? false} {...{ ...props, onBlur, onChange }} />} />;
}



function SelectForm({ children, name, ...props }: Name & ComponentProps<typeof Select>) {
  const { control } = useFormContext();
  return <Controller {...{ control, name }} render={({ field: { onBlur, onChange, value } }) => <Select value={value} {...{ ...props, onBlur, onChange }}>{children}</Select>} />;
}

Form.Input = Input;
Form.Hidden = Hidden;
Form.PlainInput = PlainInput;
Form.Password = Password;
Form.Textarea = Textarea;
Form.Switch = Switch;
Form.SelectForm = SelectForm;
