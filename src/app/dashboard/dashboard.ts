import { Component } from '@angular/core';
import { ProductTile } from "../product-tile/product-tile";
import { Scanner } from '../scanner/scanner';

@Component({
  selector: 'app-dashboard',
  imports: [ProductTile,Scanner],
  // imports: [Scanner],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

}
