import { WritableAtom, atom } from "jotai";
import request from "lib/request";
import { Image } from "expo-image";

import { FetchResponse } from "lib/request/types";

/**
 * Creates a Jotai atom for managing the state of a resource fetched from a given URL.
 *
 * @param href - The URL from which the resource will be fetched. If undefined, no fetch operation is initiated.
 * @returns An atom that manages the loading state, fetched data, and any errors encountered during the fetch operation.
 *
 * The returned atom:
 * - Reads the current fetch state from an inner atom.
 * - Performs an asynchronous GET request to the provided `href` when invoked, updating the inner atom's state based on the request's outcome (loading, data, error, status).
 * - Triggers a fetch when mounted via the `onMount` lifecycle method.
 *
 * @typeParam Response - The expected shape of the response data.
 */
const createResourceAtom = <Response>(
  href: string | undefined
) => {
  const innerAtom = atom<FetchResponse<Response>>({ loading: false });
  const resourceAtom = atom(
    (get) => get(innerAtom),
    async (_, set) => {
      if (!href) return;
      set(innerAtom, { loading: true });
      const res = await request.get<Response>(href);
      set(innerAtom, { loading: false, data: res.data, error: res.error, status: res.status });
    }
  );
  resourceAtom.onMount = (set) => {
    set();
  };

  return resourceAtom;
}

/**
 * Creates a Jotai atom for managing the state of a resource fetched from a given URL
 * that can be passed a category as a query parameter to filter the response.
 *
 * @param href - The URL from which the resource will be fetched. If undefined, no fetch operation is initiated.
 * @param category - The category to filter the response by. If null, no category filter is applied.
 * @returns An atom that manages the loading state, fetched data, and any errors encountered during the fetch operation.
 *
 * The returned atom:
 * - Reads the current fetch state from an inner atom.
 * - Performs an asynchronous GET request to the provided `href` when invoked, updating the inner atom's state based on the request's outcome (loading, data, error, status).
 * - Triggers a fetch when mounted via the `onMount` lifecycle method.
 *
 * @typeParam Response - The expected shape of the response data.
 */
const createResourceWithCategoryAtom = <Response>(
  href: string | undefined,
  category: string | undefined
) => {
  const innerAtom = atom<FetchResponse<Response>>({ loading: false });
  const resourceAtom = atom(
    (get) => get(innerAtom),
    async (_, set) => {
      if (!href) return;
      set(innerAtom, { loading: true });

      if (category) {
        href += `?category=${category}`;
      }

      const res = await request.get<Response>(href);
      set(innerAtom, { loading: false, data: res.data, error: res.error, status: res.status });
    }
  );
  resourceAtom.onMount = (set) => {
    set();
  };

  return resourceAtom;
}

const createPrefetchedImagesAtom = <Response>(
  urls: string[] | undefined
) => {
  const innerAtom = atom<FetchResponse<Response>>({ loading: false });
  const resourceAtom = atom(
    (get) => get(innerAtom),
    async (_, set) => {
      set(innerAtom, { loading: true });

      try {
        if (!urls) return
        console.log('Prefetching images:', urls);
        await Image.prefetch(urls);
      } finally {
        console.log('Prefetched images');
        set(innerAtom, { loading: false });
      }
    }
  );
  resourceAtom.onMount = (set) => {
    set();
  };

  return resourceAtom;
}

const createResourceCacheMapAtom = <
  Response
>(): ResourceCacheMapAtom<Response> => {
  const mapBaseAtom = atom<Record<string, FetchResponse<Response> | undefined>>(
    {}
  );
  const mapAtom = atom<
    Record<string, FetchResponse<Response> | undefined>,
    [ResourceCacheAtomPayload],
    void
  >(
    (get) => {
      return get(mapBaseAtom)
    },
    async (get, set, payload) => {
      const href = payload.href;
      if (!href) {
        return;
      }
      const detail = get(mapBaseAtom)[payload.href];
      if (!detail || payload.force) {
        set(mapBaseAtom, (current) => ({
          ...current,
          [payload.href]: { loading: true, data: undefined },
        }));
        const res = await request.get<Response>(
          href,
        );

        set(mapBaseAtom, (current) => ({
          ...current,
          [payload.href]: {
            loading: false,
            status: res.status,
            data: res.data,
          },
        }));
      }
    }
  );

  return mapAtom;
};


export interface ResourceCacheAtomPayload {
  href: string;
  force?: boolean;
  abortController?: AbortController;
}

export type ResourceCacheMapAtom<Response> = WritableAtom<
  Record<string, FetchResponse<Response> | undefined>,
  [ResourceCacheAtomPayload],
  void
>;


const createSingleCacheEntryAtom =
  <Response>(cache: ResourceCacheMapAtom<Response>) =>
    (
      href: string,
    ) => {
      const singleEntryAtom = atom<
        FetchResponse<Response>,
        [ResourceCacheAtomPayload],
        void
      >(
        (get) => {
          return get(cache)[href] || { loading: true, data: undefined, status: undefined };
        },
        (_get, set, payload) => {
          set(cache, { ...payload });
        }
      );
      singleEntryAtom.onMount = (set) => {
        set({ href });
      };
      return singleEntryAtom;
    };

export {
  createResourceAtom,
  createResourceWithCategoryAtom,
  createPrefetchedImagesAtom,
  createSingleCacheEntryAtom,
  createResourceCacheMapAtom,
};
