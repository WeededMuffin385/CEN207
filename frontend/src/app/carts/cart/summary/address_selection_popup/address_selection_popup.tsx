import styles from './address_selection_popup.module.css'
import {useEffect, useRef, useState} from "react";
import {importLibrary, setOptions} from "@googlemaps/js-api-loader";
import DeliveryOptionSidebar from "./delivery_option_sidebar/delivery_option_sidebar.tsx";
import {getUserLocationOnce, type LatLng, type SelectedAddress} from "../../../../../utils/location.tsx";
import {useTheme} from "../../../../../hooks/theme.tsx";
import {createAddressDraft, confirmAddressDraft} from "./address_selection_state.ts";

setOptions({
    key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
    v: "weekly",
});

type Props = {
    onCancel: () => void,
    onConfirm: (address: SelectedAddress) => void,
    confirmedAddress: SelectedAddress | null,
}

export default function AddressSelectionPopup(props: Props) {
    const {theme} = useTheme();
    const mapRef = useRef<HTMLDivElement | null>(null);
    const autocompleteRef = useRef<HTMLDivElement | null>(null);
    const [draftAddress, setDraftAddress] = useState<SelectedAddress | null>(props.confirmedAddress);

    useEffect(() => {
        async function init() {
            if (!mapRef.current || !autocompleteRef.current) {
                return;
            }

            const {Map} = await importLibrary("maps");
            const {Geocoder} = (await importLibrary("geocoding")) as google.maps.GeocodingLibrary;
            const {AdvancedMarkerElement} = (await importLibrary(
                "marker",
            )) as google.maps.MarkerLibrary;

            const {PlaceAutocompleteElement} = (await importLibrary(
                "places",
            )) as google.maps.PlacesLibrary;

            const fallbackPosition: LatLng = {
                lat: 0.0,
                lng: 0.0,
            };

            let fallback = fallbackPosition;
            if (!props.confirmedAddress) {
                try { fallback = await getUserLocationOnce(); } catch { fallback = fallbackPosition; }
            }
            const initialAddress = createAddressDraft(props.confirmedAddress, fallback);
            const defaultPosition = {lat: initialAddress.latitude, lng: initialAddress.longitude};
            setDraftAddress(initialAddress);

            const colorScheme =
                theme === "dark"
                    ? google.maps.ColorScheme.DARK
                    : google.maps.ColorScheme.LIGHT;

            const map = new Map(mapRef.current, {
                center: defaultPosition,
                zoom: 16,
                mapId: "36734faaaa12069470173954",
                colorScheme,
                disableDefaultUI: true,
                styles: [
                    {
                        featureType: "poi",
                        stylers: [
                            {visibility: "off"},
                        ],
                    },
                ],
            });

            function setLocation(location: LatLng, address: string) {
                marker.position = location;
                setDraftAddress({
                    address,
                    latitude: location.lat,
                    longitude: location.lng,
                });
            }

            const geocoder = new Geocoder();
            map.addListener("click", async (event: google.maps.MapMouseEvent) => {
                if (!event.latLng) {
                    return;
                }

                const clickedLocation = {
                    lat: event.latLng.lat(),
                    lng: event.latLng.lng(),
                };

                try {
                    const response = await geocoder.geocode({location: clickedLocation});
                    setLocation(clickedLocation, response.results[0]?.formatted_address ?? "Dropped pin");
                } catch (error) {
                    console.error("Failed to resolve the selected map location", error);
                    setLocation(clickedLocation, "Dropped pin");
                }
            });

            const marker = new AdvancedMarkerElement({
                map,
                position: defaultPosition,
            });

            const autocomplete = new PlaceAutocompleteElement();

            autocompleteRef.current.replaceChildren(autocomplete);


            autocomplete.addEventListener("gmp-select", async (event) => {
                const placePrediction = event.placePrediction;
                const place = placePrediction.toPlace();

                await place.fetchFields({
                    fields: ["formattedAddress", "location"],
                });

                if (!place.location) {
                    return;
                }

                const nextLocation = {
                    lat: place.location.lat(),
                    lng: place.location.lng(),
                };

                map.setCenter(nextLocation);
                map.setZoom(16);
                marker.position = nextLocation;

                setDraftAddress({
                    address: place.formattedAddress ?? "",
                    latitude: nextLocation.lat,
                    longitude: nextLocation.lng,
                });
            });
        }

        init();
    }, [props.confirmedAddress, theme]);

    return (
        <div className={styles.AddressSelectionPopup}>
            <DeliveryOptionSidebar
                onCancel={props.onCancel}
                onConfirm={() => {
                    if (draftAddress) props.onConfirm(confirmAddressDraft(draftAddress));
                }}
                selectedAddress={draftAddress}
            />

            <div className={styles.MapContainer}>
                <div ref={autocompleteRef} className={styles.Autocomplete}/>
                <div
                    ref={mapRef}
                    className={styles.Map}
                />
            </div>

        </div>
    )
}
