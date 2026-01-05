
import { Component, inject } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ProductService } from '../service/products';
import { Observable } from 'rxjs';
import { Product } from '../models/product/product-module';
import { AsyncPipe } from '@angular/common';
@Component({
  selector: 'app-product-tile',
  imports: [MatButtonModule, MatCardModule,AsyncPipe],
  templateUrl: './product-tile.html',
  styleUrl: './product-tile.css',
})
export class ProductTile {
private productService = inject(ProductService);

  data = [



    {
      "price": "489",
      "title": "Tender Coconut Cling Wrapped (1 pc) (Approx 900 g - 1300 g)",
      "uri": "https://www.jiomart.com/images/product/original/590003564/tender-coconut-cling-wrapped-1-pc-approx-900-g-1300-g-product-images-o590003564-p590003564-0-202408070949.jpg"
    },
    {
      "price": "89",
      "title": "Kiwi Imported 3 pcs (Pack)",
      "uri": "https://www.jiomart.com/images/product/original/590009674/kiwi-imported-3-pcs-pack-product-images-o590009674-p590317377-0-202408070949.jpg"
    },
    {
      "price": "89",
      "title": "Papaya (Each) (Approx. 800 g - 1600 g)",
      "uri": "https://www.jiomart.com/images/product/original/590001247/papaya-each-approx-800-g-1600-g-product-images-o590001247-p590001247-0-202409041925.jpg"
    },
    {
      "price": "89",
      "title": "Pineapple Queen 1 pc (Approx 700 g - 1200 g)",
      "uri": "https://www.jiomart.com/images/product/original/590000070/pineapple-queen-1-pc-approx-700-g-1200-g-product-images-o590000070-p590000070-0-202409041925.jpg"
    },
    {
      "price": "89",
      "title": "Apple Royal Gala 4 pcs (Approx 500 g - 700 g)",
      "uri": "https://www.jiomart.com/images/product/original/590001723/apple-royal-gala-4-pcs-approx-500-g-700-g-product-images-o590001723-p590001723-0-202409061145.jpg"
    },
    {
      "price": "89",
      "title": "Strawberry Small Pack 180 g",
      "uri": "https://www.jiomart.com/images/product/original/590001814/strawberry-small-pack-180-g-product-images-o590001814-p590116964-0-202412161658.jpg"
    },
    {
      "price": "89",
      "title": "Thai Guava 2 pcs (Approx. 550 g - 700 g)",
      "uri": "https://www.jiomart.com/images/product/original/590003435/thai-guava-2-pcs-approx-550-g-700-g-product-images-o590003435-p590034336-0-202505122349.jpg"
    },
    {
      "price": "89",
      "title": "Orange 6 pcs (Pack) (Approx 750 g - 900 g)",
      "uri": "https://www.jiomart.com/images/product/original/590001738/orange-6-pcs-pack-approx-750-g-900-g-product-images-o590001738-p590034369-0-202412031959.jpg"
    },
    {
      "price": "89",
      "title": "Anjeer (Pack) (Approx 300 g - 400 g)",
      "uri": "https://www.jiomart.com/images/product/original/590004501/anjeer-pack-approx-300-g-400-g-product-images-o590004501-p590144488-0-202501061730.jpg"
    },
    {
      "price": "89",
      "title": "Mosambi 6 pcs (Pack) (Approx. 450 g - 850 g)",
      "uri": "https://www.jiomart.com/images/product/original/590001739/mosambi-6-pcs-pack-approx-450-g-850-g-product-images-o590001739-p590001739-0-202409251417.jpg"
    },
    {
      "price": "89",
      "title": "Orange Imported 4 Pcs",
      "uri": "https://www.jiomart.com/images/product/original/590004112/orange-imported-4-pcs-pack-approx-900-g-1100-g-product-images-o590004112-p590087385-0-202409171903.jpg"
    },
    {
      "price": "89",
      "title": "GO KITCHEN Dried Kiwi 250gm - Natural Fruit Snack | High Fibre | Energy Booster | No Added Sugar | Healthy & Tasty",
      "uri": "https://www.jiomart.com/images/product/original/rvjiilfvoh/go-kitchen-dried-kiwi-250gm-natural-fruit-snack-high-fibre-energy-booster-no-added-sugar-healthy-tasty-product-images-orvjiilfvoh-p611769728-0-202507010948.jpg"
    },



  ]

products$ = this.productService.getAllProducts();
  

}

  

