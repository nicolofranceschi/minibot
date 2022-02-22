import { useCallback } from 'react';
import { InferType, ValidationError } from 'yup';
import { OptionalObjectSchema } from 'yup/lib/object';

export default function useResolver(schema: OptionalObjectSchema<Record<string, any>>, setErrors: SetFunction<any>) {
  return useCallback(
    async (data: InferType<typeof schema>) => {
      try {
        const values = await schema.validate(data, { abortEarly: false });
        return { values, errors: {} };
      } catch (error) {
        if (error instanceof ValidationError) {
          const errors = error.inner.reduce(
            (acc, { path = '', message }) => ({
              ...acc,
              [path]: {
                message,
              },
            }),
            {},
          );
          setErrors(errors);
          return { values: data, errors: {} };
        } else throw error;
      }
    },
    [schema, setErrors],
  );
}
