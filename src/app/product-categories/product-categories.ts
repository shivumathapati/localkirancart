import { Component, inject } from '@angular/core';
import { ProductService } from '../service/products';

@Component({
  selector: 'app-product-categories',
  imports: [],
  templateUrl: './product-categories.html',
  styleUrl: './product-categories.css',
})
export class ProductCategories {
private productService = inject(ProductService);
  categories = this.productService.getCategories();
  selectedCategory: string = '';
  
  selectCategory(category: string) {
    this.productService.setCategory(category);
  }

}
