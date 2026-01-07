import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, query, where, doc, setDoc } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product/product-module';
import { HttpClient } from '@angular/common/http';


@Injectable({ providedIn: 'root' })
export class ProductService {
  private firestore = inject(Firestore);
  private http = inject(HttpClient);

  private categorySource = new BehaviorSubject<string>('');
  selectedCategory$ = this.categorySource.asObservable();

  categories = [
    {
      "id": "CAT01",
      "name": "Staples & Grocery Essentials",
      "subcategories": [
        "Rice",
        "Wheat",
        "Atta",
        "Toor Dal",
        "Chana Dal",
        "Moong Dal",
        "Sugar",
        "Salt",
        "Cooking Oil",
        "Rava"
      ]
    },
    {
      "id": "CAT02",
      "name": "Packaged Food & Snacks",
      "subcategories": [
        "Biscuits",
        "Chips",
        "Namkeen",
        "Instant Noodles",
        "Pasta",
        "Breakfast Cereals",
        "Ready-to-eat Meals",
        "Chocolates",
        "Energy Bars",
        "Popcorn"
      ]
    },
    {
      "id": "CAT03",
      "name": "Dairy & Bakery",
      "subcategories": [
        "Milk",
        "Curd",
        "Butter",
        "Cheese",
        "Paneer",
        "Ghee",
        "Bread",
        "Buns",
        "Cakes",
        "Khoya"
      ]
    },
    {
      "id": "CAT04",
      "name": "Beverages",
      "subcategories": [
        "Tea",
        "Coffee",
        "Soft Drinks",
        "Fruit Juices",
        "Energy Drinks",
        "Health Drinks",
        "Flavoured Milk",
        "Soda",
        "Packaged Water",
        "Coconut Water"
      ]
    },
    {
      "id": "CAT05",
      "name": "Spices & Condiments",
      "subcategories": [
        "Turmeric Powder",
        "Red Chilli Powder",
        "Coriander Powder",
        "Garam Masala",
        "Cumin Seeds",
        "Mustard Seeds",
        "Pickles",
        "Sauces",
        "Ketchup",
        "Vinegar"
      ]
    },
    {
      "id": "CAT06",
      "name": "Personal Care",
      "subcategories": [
        "Bath Soap",
        "Shampoo",
        "Conditioner",
        "Toothpaste",
        "Toothbrush",
        "Hair Oil",
        "Face Wash",
        "Shaving Cream",
        "Deodorant",
        "Sanitary Napkins"
      ]
    },
    {
      "id": "CAT07",
      "name": "Home Care & Cleaning",
      "subcategories": [
        "Detergent Powder",
        "Detergent Liquid",
        "Dishwash Bar",
        "Dishwash Liquid",
        "Floor Cleaner",
        "Toilet Cleaner",
        "Phenyl",
        "Garbage Bags",
        "Room Freshener",
        "Insect Repellent"
      ]
    },
    {
      "id": "CAT08",
      "name": "Baby Care",
      "subcategories": [
        "Baby Food",
        "Baby Milk Formula",
        "Diapers",
        "Baby Wipes",
        "Baby Soap",
        "Baby Shampoo",
        "Baby Oil",
        "Baby Lotion",
        "Baby Powder",
        "Feeding Bottles"
      ]
    },
    {
      "id": "CAT09",
      "name": "Health & Wellness",
      "subcategories": [
        "Protein Powder",
        "Multivitamins",
        "ORS Sachets",
        "Pain Relief Balm",
        "First Aid Kit",
        "Thermometer",
        "Ayurvedic Medicines",
        "Face Masks",
        "Hand Sanitizer",
        "Glucose Powder"
      ]
    },
    {
      "id": "CAT10",
      "name": "Stationery & Miscellaneous",
      "subcategories": [
        "Pens",
        "Notebooks",
        "Pencils",
        "Erasers",
        "Sharpeners",
        "Matchsticks",
        "Candles",
        "Batteries",
        "Rubber Bands",
        "Paper Cups"
      ]
    }
  ]

  getCategories() {
    return this.categories;
  }

  setCategory(categoryId: string) {
    this.categorySource.next(categoryId);
  }

  getAllProducts(): Observable<Product[]> {
    // Get reference to the 'products' collection
    const productsRef = collection(this.firestore, 'products');

    // Return the data as an observable
    // idField: 'upc' ensures the document ID is included in the object
    return collectionData(productsRef, { idField: 'upc' }) as Observable<Product[]>;
  }

  getProductByCategory(category: string): Observable<Product[]> {
    const productsRef = collection(this.firestore, 'products');
    const categoryQuery = query(productsRef, where('category', '==', category));
    return collectionData(categoryQuery, { idField: 'upc' }) as Observable<Product[]>;
  }
  getProductBySubcategory(subcategory: string): Observable<Product[]> {
    const productsRef = collection(this.firestore, 'products');
    const subcategoryQuery = query(productsRef, where('subcategory', '==', subcategory));
    return collectionData(subcategoryQuery, { idField: 'upc' }) as Observable<Product[]>;
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
          const docRef = doc(productRef, product.upc);
          await setDoc(docRef, product);
        }

        console.log('✅ Products uploaded successfully');
      });
  }

}

