const imageModules = import.meta.glob<string>(
    "./placeholders/*.png",
    {
        eager: true,
        import: "default",
    },
);

export const cardImages = Object.values(imageModules).sort();

function hashString(value: string): number {
    let hash = 2166136261;

    for (let index = 0; index < value.length; index += 1) {
        hash ^= value.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
    }

    return hash >>> 0;
}

export function getCardImage(uuid: string): string {
    if (cardImages.length === 0) {
        throw new Error("No images were found");
    }

    if (uuid.length === 0) {
        throw new Error("UUID must not be empty");
    }

    const index = hashString(uuid) % cardImages.length;

    return cardImages[index];
}