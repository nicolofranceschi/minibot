import { useCallback, useState } from 'react';
import { Resolver, FieldErrors, UnpackNestedValue, ResolverOptions } from 'react-hook-form';
import { InferType, ValidationError } from 'yup';
import { OptionalObjectSchema } from 'yup/lib/object';
import { TypedSchema } from 'yup/lib/util/types';

type ErrorsType<T extends TypedSchema> = Partial<
  Record<
    keyof InferType<T>,
    {
      message: string;
    }
  >
>;

export default function useResolver<T extends OptionalObjectSchema<any>>(schema: T, warnings: boolean = false): [ErrorsType<T>, Resolver<InferType<T>>] {
  type Data = InferType<T>;
  const [errors, setErrors] = useState<ErrorsType<T>>({});
  const resolver = useCallback(
    async (data: Data) => {
      const emptyErrors = {} as FieldErrors<Data>;
      try {
        const values = await schema.validate(data, { abortEarly: false });
        setErrors(emptyErrors);
        return { values, errors: emptyErrors };
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
          ) as FieldErrors<Data>;
          setErrors(errors);
          return { values: data, errors: warnings ? emptyErrors : errors };
        } else throw error;
      }
    },
    [schema, setErrors, warnings],
  );
  return [errors, resolver];
}

export function aggregateResolvers<T extends OptionalObjectSchema<any>>(...resolvers: Resolver<InferType<T>>[]): Resolver<InferType<T>> {
  type Data = InferType<T>;
  return async (data: Data) => {
    const values = await Promise.all(resolvers.map(resolver => resolver(data as UnpackNestedValue<Data>, {}, {} as ResolverOptions<Data>)));
    return {
      values: values.reduce((acc, { values }) => ({ ...acc, ...values }), {}),
      errors: values.reduce((acc, { errors }) => ({ ...acc, ...errors }), {}) as FieldErrors<Data>,
    };
  };
}
