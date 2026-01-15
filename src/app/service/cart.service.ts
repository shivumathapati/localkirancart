import { Injectable, computed, signal, inject } from '@angular/core';
import { Product } from '../models/product/product-module';
import { HttpClient } from '@angular/common/http';
import { Firestore, collection, writeBatch, doc } from '@angular/fire/firestore';
import { firstValueFrom } from 'rxjs';

export interface CartItem {
    product: Product;
    quantity: number;
}

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private http = inject(HttpClient);
    private firestore = inject(Firestore);

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
            total += (item.product.product_price || 0) * item.quantity;
        }
        return total;
    });

    itemsArray = computed(() => Array.from(this.items().values()));
    itemsMap = computed(() => this.items());

    addToCart(product: Product, quantity: number) {
        const currentItems = new Map(this.items());
        const existing = currentItems.get(product.product_id);

        if (existing) {
            currentItems.set(product.product_id, { ...existing, quantity: existing.quantity + quantity });
        } else {
            currentItems.set(product.product_id, { product, quantity });
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

    async seedCategories() {
        try {
            const data: any = await firstValueFrom(this.http.get('/CategoriesData.json'));
            const rootCategories = data.categoriesData;

            if (!rootCategories || !Array.isArray(rootCategories)) {
                console.error('Invalid categories data format');
                return;
            }

            const batch = writeBatch(this.firestore);
            const categoriesRef = collection(this.firestore, 'categories');
            let operationCount = 0;

            // Helper to recursively process categories
            const processCategory = (category: any) => {
                // Create a copy to modify
                const categoryDoc = { ...category };

                // Remove the nested sub_categorie array from the document to be saved
                // We will process the children separately
                delete categoryDoc.sub_categorie;

                // Set the document
                const docRef = doc(categoriesRef, categoryDoc.id.toString());
                batch.set(docRef, categoryDoc);
                operationCount++;

                // Process children if they exist
                if (category.sub_categorie && Array.isArray(category.sub_categorie)) {
                    category.sub_categorie.forEach((child: any) => processCategory(child));
                }
            };

            rootCategories.forEach((cat: any) => processCategory(cat));

            // Firestore batch has a limit of 500 operations. 
            // If we exceed this, we'd need to chunk it. 
            // Assuming < 500 for now based on file size, but good to note.
            if (operationCount > 500) {
                console.warn('Warning: Batch size exceeds 500. This might fail. Consider chunking.');
            }

            await batch.commit();
            console.log(`Successfully seeded ${operationCount} categories.`);
        } catch (error) {
            console.error('Error seeding categories:', error);
        }
    }
}
