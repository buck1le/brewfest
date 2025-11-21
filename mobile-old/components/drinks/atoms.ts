import { createResourceCacheMapAtom, createSingleCacheEntryAtom } from "atoms/resources"
import { useMemo } from "react"
import { Vendor } from "types/api-responses"

const vendorCacheAtom = createResourceCacheMapAtom<Vendor>()

export const useVendorAtom = (href: string) =>
  useMemo(() => createSingleCacheEntryAtom(vendorCacheAtom)(href), [href])


