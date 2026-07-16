import type {LatLng, SelectedAddress} from "../../../../../utils/location.tsx";

export function createAddressDraft(confirmed: SelectedAddress | null, fallback: LatLng): SelectedAddress {
    return confirmed ? {...confirmed} : {address: "", latitude: fallback.lat, longitude: fallback.lng};
}

export function cancelAddressDraft(confirmed: SelectedAddress | null): SelectedAddress | null {
    return confirmed;
}

export function confirmAddressDraft(draft: SelectedAddress): SelectedAddress {
    return {...draft};
}
