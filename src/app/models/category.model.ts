/**
 * Generated TypeScript interfaces for public/CategoriesData.json
 */

export interface CategoriesDataFile {
  categoriesData: Category[];
}

export interface Category {
  id: number;
  name: string;
  description?: string | null;
  parent_id?: number | null;
  vertical_code?: string | null;
  category_type?: string | null;
  level?: number;
  position?: number;
  is_virtual?: boolean;
  url_path?: string | null;
  masthead_image_path?: string | null;
  thumbnail_image_path?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  header?: string | null;
  hierarchy?: string | null;
  sub_categorie?: Category[];
  [key: string]: any;
}
