import algoliasearch from 'algoliasearch/lite';

const client = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION ?? '', process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY ?? '');

const algolia = client.initIndex(process.env.NEXT_PUBLIC_ALGOLIA_INDEX ?? '');
export default algolia;
