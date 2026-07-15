import styles from './address_selection_popup.module.css'
import {useEffect, useRef, useState} from "react";
import {importLibrary, setOptions} from "@googlemaps/js-api-loader";
import DeliveryOptionSidebar from "./delivery_option_sidebar/delivery_option_sidebar.tsx";
import {getUserLocationOnce, type LatLng, type SelectedAddress} from "../../../../../utils/location.tsx";
import {useTheme} from "../../../../../hooks/theme.tsx";

setOptions({
    key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
    v: "weekly",
});

type Props = {
    onClose: () => void,
    setSelectedAddress: (address: SelectedAddress) => void,
}

export default function AddressSelectionPopup(props: Props) {
    const {theme} = useTheme();
    const mapRef = useRef<HTMLDivElement | null>(null);
    const autocompleteRef = useRef<HTMLDivElement | null>(null);
    const [selectedAddress, setSelectedAddress] = useState<SelectedAddress | null>(null);

    useEffect(() => {
        async function init() {
            if (!mapRef.current || !autocompleteRef.current) {
                return;
            }

            const {Map} = await importLibrary("maps");
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

            let defaultPosition;

            try {
                defaultPosition = await getUserLocationOnce()
            } catch {
                defaultPosition = fallbackPosition
            }
            setSelectedAddress({
                address: "",
                latitude: defaultPosition.lat,
                longitude: defaultPosition.lng,
            });

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

            function setLocation(location: LatLng, address = "") {
                marker.position = location;

                setSelectedAddress({
                    address,
                    latitude: location.lat,
                    longitude: location.lng,
                });
            }

            map.addListener("click", (event: google.maps.MapMouseEvent) => {
                if (!event.latLng) {
                    return;
                }

                const clickedLocation = {
                    lat: event.latLng.lat(),
                    lng: event.latLng.lng(),
                };

                setLocation(clickedLocation);
            });

            const marker = new AdvancedMarkerElement({
                map,
                position: defaultPosition,
            });

            const autocomplete = new PlaceAutocompleteElement({
                types: ["address"],
            });

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

                setSelectedAddress({
                    address: place.formattedAddress ?? "",
                    latitude: nextLocation.lat,
                    longitude: nextLocation.lng,
                });
            });
        }

        init();
    }, []);

    return (
        <div className={styles.AddressSelectionPopup}>
            <DeliveryOptionSidebar
                onClose={props.onClose}
                selectedAddress={selectedAddress}
                setSelectedAddress={props.setSelectedAddress}
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