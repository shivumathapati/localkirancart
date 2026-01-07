
import { Component, inject } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ProductService } from '../service/products';
import { Observable, switchMap } from 'rxjs';
import { Product } from '../models/product/product-module';
import { AsyncPipe } from '@angular/common';
import { ProductCategories } from '../product-categories/product-categories';
import { CartService } from '../service/cart.service';
@Component({
  selector: 'app-product-tile',
  imports: [MatButtonModule, MatCardModule],
  templateUrl: './product-tile.html',
  styleUrl: './product-tile.css',
})
export class ProductTile {
  private productService = inject(ProductService);
  private cartService = inject(CartService);


  products$!: any[];

  // removed unused jhjimjh$

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

  getQuantity(product: Product): number {
    return this.cartService.itemsMap().get(product.upc)?.quantity || 0;
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product, 1);
  }

  increment(product: Product) {
    this.cartService.addToCart(product, 1);
  }

  decrement(product: Product) {
    const currentQty = this.getQuantity(product);
    if (currentQty > 0) {
      this.cartService.updateQuantity(product.upc, currentQty - 1);
    }
  }
}
