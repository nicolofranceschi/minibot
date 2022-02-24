import { useQuery } from 'react-query';
import algolia from 'config/algolia';
import { useState } from 'react';
import useDebounce from 'hooks/useDebounce';

export default function Search() {
  const [input, setInput] = useState('');
  const debouncedQuery = useDebounce(input);
  const { data, isLoading } = useQuery(['search', debouncedQuery], () => algolia.search(debouncedQuery, { filters: 'description:"dsnksjnsk" AND filato:"abc"' }), {
    select: ({ hits }: any) => hits,
    onSuccess: hits => console.log(hits),
  });
  return (
    <div>
      <input value={input} onChange={e => setInput(e.target.value)} />
    </div>
  );
}
