import { gql } from '@apollo/client';

// Query untuk mendapatkan semua kategori
export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
      description
      image
      createdAt
      updatedAt
    }
  }
`;

// Query untuk mendapatkan produk berdasarkan kategori
export const GET_PRODUCTS_BY_CATEGORY_SLUG = gql`
  query GetProductsByCategorySlug($categorySlug: String!) {
    productsByCategorySlug(categorySlug: $categorySlug) {
      id
      name
      slug
      description
      price
      image
      images
      stock
      categoryId
      isActive
      isFeatured
      createdAt
      updatedAt
      category {
        id
        name
        slug
        image
      }
    }
  }
`;

// Query untuk mendapatkan semua produk aktif
export const GET_ALL_PRODUCTS = gql`
  query GetAllProducts($skip: Int, $take: Int) {
    products(skip: $skip, take: $take, where: { isActive: true }) {
      id
      name
      slug
      description
      price
      image
      images
      stock
      category {
        id
        name
        slug
      }
    }
  }
`;

// Query untuk mendapatkan produk by slug
export const GET_PRODUCT_BY_SLUG = gql`
  query GetProductBySlug($slug: String!) {
    product(where: { slug: $slug }) {
      id
      name
      slug
      description
      price
      image
      images
      stock
      category {
        id
        name
        slug
      }
    }
  }
`;