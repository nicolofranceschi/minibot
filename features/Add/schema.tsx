import { object, string, boolean, number, InferType } from 'yup';

export const warningsObject = {
  codiceArticolo: string().required('Il campo è obbligatorio'),
  description: string(),
  tipofinitura: string().required('Il campo è obbligatorio').nullable(),
  rigato: boolean(),
  puntomaglia_1: string().required('Il campo è obbligatorio').nullable(),
  altezzafinita: number()
    .typeError('Il campo deve essere un numero')
    .positive('Il campo deve essere maggiore di 0')
    .required('Il campo è obbligatorio')
    .max(50, 'Il campo deve essere minore di 50'),
  numerofili: number()
    .typeError('Il campo deve essere un numero')
    .positive('Il campo deve essere maggiore di 0')
    .integer('Il campo deve essere un numero intero')
    .required('Il campo è obbligatorio')
    .max(10, 'Il campo deve essere minore di 10'),
  schedadilavorazione: string().required('Il campo è obbligatorio').max(4, 'Il campo non può avere più di 4 cifre'),
  tipomaglia: string().required('Il campo è obbligatorio').nullable(),
  filato: string().required('Il campo è obbligatorio').nullable(),
}

export const warningsSchema = object(warningsObject);

export const errorsObject = {
  codiceArticolo: string().required('Il campo è obbligatorio'),
  description: string(),
  tipofinitura:string().required('Il campo è obbligatorio').nullable(),
  rigato: boolean(),
  puntomaglia_1: string().required('Il campo è obbligatorio').nullable(),
  altezzafinita: number().typeError('Il campo deve essere un numero').required('Il campo è obbligatorio'),
  numerofili: number().typeError('Il campo deve essere un numero').required('Il campo è obbligatorio'),
  schedadilavorazione: string().required('Il campo è obbligatorio').max(4, 'Il campo non può avere più di 4 cifre'),
  tipomaglia: string().required('Il campo è obbligatorio').nullable(),
  filato: string().required('Il campo è obbligatorio').nullable(),
}

export const errorsSchema = object(errorsObject);

export type AddBody = InferType<typeof warningsSchema>;
