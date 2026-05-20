export function getNoteImageMeta(image = null) {
  if (!hasImageSource(image)) {
    return {
      available: false,
      label: "",
      ariaLabel: ""
    };
  }

  if (image.generated && image.localFallback) {
    return {
      available: true,
      label: "Local image",
      ariaLabel: "Note includes a locally generated fallback image",
      tone: "local"
    };
  }

  if (image.generated) {
    return {
      available: true,
      label: "AI image",
      ariaLabel: "Note includes a generated image",
      tone: "generated"
    };
  }

  return {
    available: true,
    label: "Image",
    ariaLabel: "Note includes an attached image",
    tone: "attached"
  };
}

function hasImageSource(image) {
  if (typeof image === "string") return image.startsWith("data:image/");
  return typeof image?.src === "string" && image.src.startsWith("data:image/");
}
