import {describe, expect, it} from "vitest";
import {cancelAddressDraft, confirmAddressDraft, createAddressDraft} from "./address_selection_state.ts";
import type {SelectedAddress} from "../../../../../utils/location.tsx";

const saved: SelectedAddress = {address: "1 Existing Street, Sydney NSW", latitude: -33.8688, longitude: 151.2093};
const replacement: SelectedAddress = {address: "2 New Street, Melbourne VIC", latitude: -37.8136, longitude: 144.9631};

describe("address selection state", () => {
    it("preserves the confirmed address and coordinates when reopened", () => {
        expect(createAddressDraft(saved, {lat: 0, lng: 0})).toEqual(saved);
    });

    it("keeps the previously confirmed address when draft changes are cancelled", () => {
        const draft = createAddressDraft(saved, {lat: 0, lng: 0});
        Object.assign(draft, replacement);
        expect(cancelAddressDraft(saved)).toEqual(saved);
    });

    it("commits a newly selected address only when confirmed", () => {
        expect(confirmAddressDraft(replacement)).toEqual(replacement);
        expect(confirmAddressDraft(replacement)).not.toBe(replacement);
    });

    it("uses fallback coordinates only when no address has been confirmed", () => {
        expect(createAddressDraft(null, {lat: -27.47, lng: 153.02})).toEqual({address: "", latitude: -27.47, longitude: 153.02});
    });
});
