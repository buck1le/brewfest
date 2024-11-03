import { atom } from "jotai";
import request from "lib/request";

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

export {
  createResourceAtom
};
