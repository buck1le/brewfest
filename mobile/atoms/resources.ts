import { atom } from "jotai";
import request from "lib/request";
import { Image as ImageResource } from "types/api-responses";
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
  images: ImageResource[] | undefined
) => {
  const innerAtom = atom<FetchResponse<Response>>({ loading: false });
  const resourceAtom = atom(
    (get) => get(innerAtom),
    async (_, set) => {
      set(innerAtom, { loading: true });

      try {
        if (!images) return
        await Image.prefetch(images.map(item => item.url));
      } finally {
        set(innerAtom, { loading: false });
      }
    }
  );
  resourceAtom.onMount = (set) => {
    set();
  };

  return resourceAtom;
}


export {
  createResourceAtom,
  createResourceWithCategoryAtom,
  createPrefetchedImagesAtom
};
