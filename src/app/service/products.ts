import { Injectable, inject, Injector, runInInjectionContext } from '@angular/core';
import { Firestore, collection, collectionData, query, where, doc, setDoc } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product/product-module';
import { HttpClient } from '@angular/common/http';
import { Category } from '../models/category.model';
import { CategoryService } from './category.service';


@Injectable({ providedIn: 'root' })
export class ProductService {
  private firestore = inject(Firestore);
  private http = inject(HttpClient);
  private categoryService = inject(CategoryService);
  private injector = inject(Injector);

  private categorySource = new BehaviorSubject<string>('');
  selectedCategory$ = this.categorySource.asObservable();

  getCategories() {
    return this.categoryService.getCategoriesWithSubcategories();
  }

  setCategory(categoryId: string) {
    console.log('ProductService: setting category', categoryId);
    this.categorySource.next(categoryId);
  }

  getAllProducts(): Observable<Product[]> {
    // Get reference to the 'products' collection
    const productsRef = collection(this.firestore, 'products');

    // Return the data as an observable
    // idField: 'upc' ensures the document ID is included in the object
    return runInInjectionContext(this.injector, () =>
      collectionData(productsRef, { idField: 'product_id' }) as Observable<Product[]>
    );
  }

  getProductByCategory(category: string): Observable<Product[]> {
    const productsRef = collection(this.firestore, 'products');
    const categoryQuery = query(productsRef, where('product_categoryid', '==', String(category)));
    return runInInjectionContext(this.injector, () =>
      collectionData(categoryQuery, { idField: 'product_id' }) as Observable<Product[]>
    );
  }
  getProductBySubcategory(subcategory: string): Observable<Product[]> {
    console.log('ProductService: fetching for subcategory', subcategory);
    const productsRef = collection(this.firestore, 'products');
    const subcategoryQuery = query(productsRef, where('product_subcategoryid', '==', String(subcategory)));
    return runInInjectionContext(this.injector, () =>
      collectionData(subcategoryQuery, { idField: 'product_id' }) as Observable<Product[]>
    );
  }



  async placeOrder(orderData: any): Promise<string> {
    const ordersRef = collection(this.firestore, 'product_order');
    const docRef = doc(ordersRef); // Generate new ID
    await setDoc(docRef, {
      ...orderData,
      id: docRef.id,
      createdAt: new Date().toISOString() // Use string format for better serialization
    });
    return docRef.id;
  }

  // Admin: Get all orders (optionally filter by status later if needed)
  getOrders(): Observable<any[]> {
    const ordersRef = collection(this.firestore, 'product_order');
    // You might want to order by date, requiring an index
    return collectionData(ordersRef, { idField: 'id' });
  }

  // User: Get orders for specific user/email
  getUserOrders(email: string): Observable<any[]> {
    const ordersRef = collection(this.firestore, 'product_order');
    // Assuming 'email' or 'userId' is stored in orderData. 
    // In dashboard.ts we should ensure email is saved.
    // For now, let's query assuming we'll save 'userEmail' in the order.
    // Note: Use 'userEmail' field.
    const q = query(ordersRef, where('userEmail', '==', email));
    return collectionData(q, { idField: 'id' });
  }

  // Admin: Update Status
  async updateOrderStatus(orderId: string, status: string) {
    const orderDoc = doc(this.firestore, 'product_order', orderId);
    await setDoc(orderDoc, { status }, { merge: true });
  }

  // Admin: Update Items (mark unavailable etc)
  async updateOrderItems(orderId: string, items: any[]) {
    const orderDoc = doc(this.firestore, 'product_order', orderId);
    await setDoc(orderDoc, { items }, { merge: true });
  }

  uploadProducts() {
    this.http.get<Product[]>('products_100.json')
      .subscribe(async (products) => {

        const productRef = collection(this.firestore, 'products');

        for (const product of products) {
          const docRef = doc(productRef, product.product_id);
          await setDoc(docRef, product);
        }

        console.log('✅ Products uploaded successfully');
      });
  }

  async uploadCategoryRecursive(category: Category, collectionRef: any) {
    const { sub_categorie, ...categoryData } = category; // Separate nested data
    const docRef = doc(collectionRef, category.id.toString());

    // Upload current category document
    await setDoc(docRef, categoryData);

    // Recursively upload subcategories
    if (sub_categorie && sub_categorie.length > 0) {
      const subCollectionRef = collection(docRef, 'sub_categorie');
      for (const subCat of sub_categorie) {
        await this.uploadCategoryRecursive(subCat, subCollectionRef);
      }
    }
  }

  uploadCategories() {
    this.http.get<Category[]>('CategoriesData.json')
      .subscribe(async (categories) => {
        const categoriesRef = collection(this.firestore, 'categories');

        console.log('🔄 Starting recursive category upload...');
        for (const category of categories) {
          await this.uploadCategoryRecursive(category, categoriesRef);
        }
        console.log('✅ Categories uploaded successfully recursively');
      });
  }

}

