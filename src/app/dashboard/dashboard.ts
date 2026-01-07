import { Component, inject, computed, signal, model } from '@angular/core';
import { Router } from '@angular/router';
import { ProductTile } from "../product-tile/product-tile";
import { Scanner } from '../scanner/scanner';
import { ProductCategories } from '../product-categories/product-categories';
import { CartService } from '../service/cart.service';
import { ProductService } from '../service/products';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // For standard pipes if needed
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ProductTile, Scanner, ProductCategories, FormsModule, CommonModule, MatButtonModule, MatInputModule, MatFormFieldModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  cartService = inject(CartService);
  productService = inject(ProductService);
  private router = inject(Router);

  cartItems = this.cartService.itemsArray;
  totalPrice = this.cartService.totalPrice;

  goToCheckout() {
    this.router.navigate(['/checkout']);
  }
}
