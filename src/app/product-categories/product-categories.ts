import { Component, inject } from '@angular/core';
import { ProductService } from '../service/products';
import { AsyncPipe } from '@angular/common';

@Component({

  selector: 'app-product-categories',
  imports: [AsyncPipe],
  templateUrl: './product-categories.html',
  styleUrl: './product-categories.css',
})
export class ProductCategories {
  private productService = inject(ProductService);
  categories = this.productService.getCategories();
  selectedCategory: string = '29001';

  selectCategory(category: string) {
    this.productService.setCategory(category);
  }

}
