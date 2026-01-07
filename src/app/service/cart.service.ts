import { Injectable, computed, signal } from '@angular/core';
import { Product } from '../models/product/product-module';

export interface CartItem {
    product: Product;
    quantity: number;
}

@Injectable({
    providedIn: 'root'
})
export class CartService {
    // Signal to track cart items: productId -> CartItem
    private items = signal<Map<string, CartItem>>(new Map());

    // Computed signals for UI
    cartCount = computed(() => {
        let count = 0;
        for (const item of this.items().values()) {
            count += item.quantity;
        }
        return count;
    });

    totalPrice = computed(() => {
        let total = 0;
        for (const item of this.items().values()) {
            total += (item.product.price || 0) * item.quantity;
        }
        return total;
    });

    itemsArray = computed(() => Array.from(this.items().values()));

    addToCart(product: Product, quantity: number) {
        const currentItems = new Map(this.items());
        const existing = currentItems.get(product.upc);

        if (existing) {
            currentItems.set(product.upc, { ...existing, quantity: existing.quantity + quantity });
        } else {
            currentItems.set(product.upc, { product, quantity });
        }
        this.items.set(currentItems);
    }

    removeFromCart(productId: string) {
        const currentItems = new Map(this.items());
        currentItems.delete(productId);
        this.items.set(currentItems);
    }

    updateQuantity(productId: string, quantity: number) {
        const currentItems = new Map(this.items());
        const existing = currentItems.get(productId);
        if (existing) {
            if (quantity <= 0) {
                currentItems.delete(productId);
            } else {
                currentItems.set(productId, { ...existing, quantity });
            }
            this.items.set(currentItems);
        }
    }

    clearCart() {
        this.items.set(new Map());
    }
}
