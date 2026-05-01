export interface Recipe {
  id: number;
  title: string;
  description?: string;
  ingredients?: string;
  instructions?: string;
  calories?: number;
  category?: string;
  createdAt: string;
}

export interface RecipeRequest {
  title: string;
  description?: string | null;
  ingredients?: string | null;
  instructions?: string | null;
  calories?: number | null;
  category?: string | null;
}
