import { useMemo } from 'react';
import { createPrefetchedImagesAtom } from 'atoms/resources';

const useImagesAtom = (urls: string[] | undefined) => {
  return useMemo(() => createPrefetchedImagesAtom(urls), []);
}

export {
  useImagesAtom
};
