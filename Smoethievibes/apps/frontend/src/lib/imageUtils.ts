// lib/imageUtils.ts

/**
 * Helper function untuk mendapatkan URL gambar produk
 * Menangani kasus imagePath yang kosong atau undefined
 */
export function getProductImageUrl(imagePath: string | undefined | null): string {
  if (!imagePath) {
    return '/images/placeholder-product.jpg';
  }
  
  // Jika sudah URL lengkap, gunakan langsung
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Jika dimulai dengan /, gunakan langsung
  if (imagePath.startsWith('/')) {
    return imagePath;
  }
  
  // Jika hanya nama file, tambahkan path uploads
  return `/uploads/products/${imagePath}`;
}

/**
 * Helper function untuk mendapatkan URL gambar kategori
 */
export function getCategoryImageUrl(imagePath: string | undefined | null): string {
  if (!imagePath) {
    return '/images/placeholder-category.jpg';
  }
  
  // Jika sudah URL lengkap, gunakan langsung
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Jika dimulai dengan /, gunakan langsung
  if (imagePath.startsWith('/')) {
    return imagePath;
  }
  
  // Jika hanya nama file, tambahkan path uploads
  return `/uploads/categories/${imagePath}`;
}