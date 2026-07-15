export type LatLng = {
    lat: number;
    lng: number;
};

export type SelectedAddress = {
    address: string;
    latitude: number;
    longitude: number;
};

const USER_LOCATION_STORAGE_KEY = "user_location";

function getUserLocation(): Promise<LatLng> {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Geolocation is not supported"));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            reject,
            {
                enableHighAccuracy: true,
                timeout: 10_000,
                maximumAge: 60_000,
            },
        );
    });
}

function getCachedUserLocation(): LatLng | null {
    const raw = localStorage.getItem(USER_LOCATION_STORAGE_KEY);

    if (!raw) {
        return null;
    }

    const parsed = JSON.parse(raw) as LatLng;

    if (
        typeof parsed.lat !== "number" ||
        typeof parsed.lng !== "number"
    ) {
        localStorage.removeItem(USER_LOCATION_STORAGE_KEY);
        return null;
    }

    return parsed;
}

function saveUserLocation(location: LatLng) {
    localStorage.setItem(USER_LOCATION_STORAGE_KEY, JSON.stringify(location));
}

export async function getUserLocationOnce(): Promise<LatLng> {
    const cachedLocation = getCachedUserLocation();

    if (cachedLocation) {
        return cachedLocation;
    }

    const location = await getUserLocation();
    saveUserLocation(location);

    return location;
}