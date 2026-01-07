import { Component, inject, computed, signal, model } from '@angular/core';
import { Router } from '@angular/router';
import { ProductTile } from "../product-tile/product-tile";
import { Scanner } from '../scanner/scanner';
import { ProductCategories } from '../product-categories/product-categories';
import { CartService } from '../service/cart.service';
import { ProductService } from '../service/products';
import { AuthService } from '../service/auth.service'; // Import AuthService
import { NotificationService } from '../service/notification.service'; // Import NotificationService
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // For standard pipes if needed
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ProductTile, Scanner, ProductCategories, FormsModule, CommonModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatBadgeModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  cartService = inject(CartService);
  productService = inject(ProductService);
  authService = inject(AuthService);
  notificationService = inject(NotificationService);
  private router = inject(Router);

  cartItems = this.cartService.itemsArray;
  totalPrice = this.cartService.totalPrice;

  // Notification Counts
  adminPendingCount$ = this.notificationService.adminPendingCount$;
  userActiveCount$ = this.notificationService.userActiveCount$;

  // Use the isAdmin$ observable from AuthService
  isAdmin$ = this.authService.isAdmin$;

  goToCheckout() {
    this.router.navigate(['/checkout']);
  }

  goToMyOrders() {
    this.router.navigate(['/my-orders']);
  }

  goToAdminOrders() {
    this.router.navigate(['/admin/orders']);
  }

  logout() {
    this.authService.logout();
  }
}
