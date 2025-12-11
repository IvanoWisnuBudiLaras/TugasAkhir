// app/Kategori/utils.ts

/**
 * Utility function to get the full image URL for products
 * Handles both relative paths and absolute URLs
 */
export function getImageUrl(imagePath?: string): string {
  if (!imagePath) {
    return '';
  }

  // If it's already a full URL (starts with http:// or https://), return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // If it starts with /, it's a relative path from the public folder
  if (imagePath.startsWith('/')) {
    return imagePath;
  }

  // Otherwise, add a leading slash
  return `/${imagePath}`;
}

/**
 * Utility function to format currency in Indonesian Rupiah format
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Utility function to truncate text to a specific length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
}