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
// Define that we specifically want to look for UPC codes
  allowedFormats = [ BarcodeFormat.UPC_A, BarcodeFormat.UPC_E, BarcodeFormat.EAN_13 ];
  // scannedResult = '';

  // onCodeResult(resultString: string) {
  //   this.scannedResult = resultString;
  //   console.log('UPC Scanned:', resultString);

  // }
  // // State control
  // isScanning = false;
  // isFillingForm = false;

  // // Data
  
  // product = {
  //   upc: '',
  //   name: '',
  //   price: 0,
  //   quantity: 1
  // };

  startScan() {
    this.isScanning = true;
    this.isFillingForm = false;
    this.product.upc = ''; // Reset for new scan
  }

  // handleScanSuccess(result: string) {
  //   this.product.upc = result;
  //   this.isScanning = false;
  //   this.isFillingForm = true;
  // }

  // saveProduct() {
  //   console.log('Saving to Database:', this.product);
    
  //   // Reset for the next round
  //   this.isFillingForm = false;
  //   this.isScanning = true; // Automatically open scanner for next item
    
  //   // Clear form fields but keep UPC for logic if needed
  //   this.product = { upc: '', name: '', price: 0, quantity: 1 };
  // }

  private firestore = inject(Firestore); // Inject Firestore

  isScanning = false;
  isFillingForm = false;
  isExistingProduct = false; // Flag to change button text

  product = { upc: '', name: '', price: 0, quantity: 1 };

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
          price: this.product.price,
          quantity: increment(this.product.quantity) // Atomically add to existing stock
        });
      } else {
        // CREATE: Save new document
        await setDoc(docRef, {
          name: this.product.name,
          price: this.product.price,
          quantity: this.product.quantity,
          upc: this.product.upc,
          createdAt: new Date()
        });
      }

      alert('Inventory Updated!');
      this.resetFlow();
    } catch (err) {
      console.error("Error saving to Firebase:", err);
    }
  }

  resetFlow() {
    this.isFillingForm = false;
    this.isScanning = true; // Loop back to scanner
  }
}
