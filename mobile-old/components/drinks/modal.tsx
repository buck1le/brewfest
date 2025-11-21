import { useAtomValue } from "jotai";
import { useVendorAtom } from "./atoms";
import { VendorModal } from "components/vendors";
import { InventoryItem } from "types/api-responses";


const DrinkModal = ({ item }: { item: InventoryItem }) => {
    const vendorAtom = useVendorAtom(item.resources.vendor.href);
    const vendor = useAtomValue(vendorAtom);

    if (!vendor.data) {
        return
    }

    return (
      <VendorModal item={vendor.data} />
    )
}

export default DrinkModal;


