
import { Component, inject } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ProductService } from '../service/products';
import { Observable, switchMap } from 'rxjs';
import { Product } from '../models/product/product-module';
import { AsyncPipe } from '@angular/common';
import { ProductCategories } from '../product-categories/product-categories';
@Component({
  selector: 'app-product-tile',
  imports: [MatButtonModule, MatCardModule],
  templateUrl: './product-tile.html',
  styleUrl: './product-tile.css',
})
export class ProductTile {
private productService = inject(ProductService);


products$!: any[];

jhjimjh$ = this.productService.uploadProducts();
  categories = new ProductCategories().categories;
   ngOnInit() {
    this.productService.selectedCategory$
      .pipe(
        switchMap(categoryId =>
          this.productService.getProductByCategory(categoryId)
        )
      )
      .subscribe(products => {
        this.products$ = products;
      });
  }

}

  

