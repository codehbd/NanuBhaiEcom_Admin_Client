// Get full image URL
export const getImageUrl = (imageUrl: string): string => {
  // If the URL already includes the domain, return as is
  if (imageUrl?.startsWith("http")) {
    return imageUrl;
  }
  // Otherwise, assume it's a relative path and construct the URL
  return `${process.env.NEXT_PUBLIC_API_URL}/image/${imageUrl}`;
};

// simulate a delay
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// convert formdata to object
export function formDataToObject(formData: FormData) {
  const obj: Record<string, any> = {};

  formData.forEach((value, key) => {
    if (key === "images") {
      const files = formData
        .getAll("images")
        .filter((v) => v instanceof File) as File[];
      obj[key] = files.length > 0 ? files : undefined;
    } else {
      obj[key] = value;
    }
  });

  return obj;
}

// generate varient SKU
export function generateSKU(
  productName: string,
  attributes: { name: string; value: string }[]
) {
  const productCode = productName.replace(/\s+/g, "").toUpperCase();

  // Use attribute keys + values (safer than substring)
  const attrCode = attributes
    .map(
      (attr) =>
        `${attr.name.substring(0, 2).toUpperCase()}-${attr.value
          .substring(0, 3)
          .toUpperCase()}`
    )
    .join("-");

  // Add a short random suffix for uniqueness
  const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();

  return `${productCode}-${attrCode}-${randomCode}`;
}
