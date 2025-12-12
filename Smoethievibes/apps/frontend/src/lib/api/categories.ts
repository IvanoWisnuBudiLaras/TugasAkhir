export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
}

export interface CategoriesResponse {
  success: boolean;
  data: Category[];
}

class CategoriesAPI {
  private baseURL = `/api/categories`;

  async getCategories(): Promise<Category[]> {
    try {
      const response = await fetch(`${this.baseURL}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data: CategoriesResponse = await response.json();
      return data.data || (data as unknown as Category[]);
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }
}

export const categoriesAPI = new CategoriesAPI();