import { object, string, boolean, number, InferType } from 'yup';

export const warningsSchema = object({
  codiceArticolo: string().required('Il campo è obbligatorio').min(10, 'Il campo deve contenere almeno 10 caratteri'),
  description: string(),
  tipoFinitura: string().required('Il campo è obbligatorio').nullable(),
  rigato: boolean(),
  puntomaglia: string().required('Il campo è obbligatorio').nullable(),
  altezzafinita: number()
    .typeError('Il campo deve essere un numero')
    .positive('Il campo deve essere maggiore di 0')
    .integer('Il campo deve essere un numero intero')
    .required('Il campo è obbligatorio')
    .max(50, 'Il campo deve essere minore di 50'),
  numerofili: number()
    .typeError('Il campo deve essere un numero')
    .positive('Il campo deve essere maggiore di 0')
    .integer('Il campo deve essere un numero intero')
    .required('Il campo è obbligatorio')
    .max(50, 'Il campo deve essere minore di 50'),
  schedadilavorazione: string().required('Il campo è obbligatorio').max(4, 'Il campo non può avere più di 4 cifre'),
  tipomaglia: string().required('Il campo è obbligatorio').nullable(),
  filato: string().required('Il campo è obbligatorio').nullable(),
});

export const errorsSchema = object({
  codiceArticolo: string().required('Il campo è obbligatorio').min(10, 'Il campo deve contenere almeno 10 caratteri'),
  description: string(),
});

export type AddBody = InferType<typeof warningsSchema>;
