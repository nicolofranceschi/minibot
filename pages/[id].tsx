import { getScheda } from 'config/firebase/db';
import Add from 'features/Add';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';

export default function Edit() {
  const router = useRouter();
  const { id } = router.query;
  const { data, isLoading } = useQuery(['getScheda', id], () => getScheda(String(id)), { enabled: Boolean(id), select: res => res.data });
  if (isLoading) return <span>Caricamento...</span>;
  if (!data) return <span>404: Scheda non trovata</span>;
  console.log('edit', data);
  return <Add dataFirebase={data} />;
}
