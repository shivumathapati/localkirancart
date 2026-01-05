import { Component, inject } from '@angular/core';
// import { Component } from '@angular/core';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Firestore, doc, getDoc, setDoc, updateDoc, increment } from '@angular/fire/firestore';

@Component({
  selector: 'app-scanner',
  imports: [CommonModule, FormsModule, ZXingScannerModule],
  templateUrl: './scanner.html',
  styleUrl: './scanner.css',
})
export class Scanner {

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
  subcategories: string[] = [];


  allowedFormats = [ BarcodeFormat.UPC_A, BarcodeFormat.UPC_E, BarcodeFormat.EAN_13 ];

  startScan() {
    this.isScanning = true;
    this.isFillingForm = false;
    this.product.upc = ''; // Reset for new scan
  }

 
  private firestore = inject(Firestore); // Inject Firestore

  isScanning = false;
  isFillingForm = false;
  isExistingProduct = false; // Flag to change button text

  product = { upc: '', name: '', price: 0, quantity: 1,category:'',subcategory:'' };

  async handleScanSuccess(result: string) {
    this.isScanning = false;
    this.product.upc = result;

    // 1. Check Firebase if product exists
    const docRef = doc(this.firestore, 'products', result);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // 2. If exists, load data and let user APPEND
      const existingData = docSnap.data();
      this.product.name = existingData['name'];
      this.product.price = existingData['price'];
      this.product.category = existingData['category'];
      this.product.subcategory = existingData['subcategory'];
      this.product.quantity = 1; // Default to 1 for "adding" more
      this.isExistingProduct = true;
    } else {
      // 3. If new, reset form
      this.product.name = '';
      this.product.price = 0;
      this.product.quantity = 1;
      this.isExistingProduct = false;
      
    }

    this.isFillingForm = true;
  }

  async saveProduct() {
    const docRef = doc(this.firestore, 'products', this.product.upc);

    try {
      if (this.isExistingProduct) {
        // UPDATE: Increment quantity and update price if changed
        await updateDoc(docRef, {
          name: this.product.name,
          price: this.product.price,
          quantity: increment(this.product.quantity), // Atomically add to existing stock
          category: this.product.category,
          subcategory: this.product.subcategory,
        });
      } else {
        // CREATE: Save new document
        await setDoc(docRef, {
          name: this.product.name,
          price: this.product.price,
          quantity: this.product.quantity,
          upc: this.product.upc,
          category: this.product.category,
          subcategory: this.product.subcategory,
          createdAt: new Date()
        });
      }

      alert('Inventory Updated!');
      this.resetFlow();
    } catch (err) {
      console.error("Error saving to Firebase:", err);
    }
  }

  onCategoryChange(event: Event) {
    const selectedCategoryId = (event.target as HTMLSelectElement).value;
   console.log('Category changed to:', this.product.category);
    const selectedCategory = this.categories.find(
      cat => cat.id === selectedCategoryId
    );

    this.subcategories = selectedCategory
      ? selectedCategory.subcategories
      : [];
  }

  resetFlow() {
    this.isFillingForm = false;
    this.isScanning = true; // Loop back to scanner
  }
}
