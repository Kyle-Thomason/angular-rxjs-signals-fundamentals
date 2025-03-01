import { Component, inject, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';

import { NgIf, NgFor, CurrencyPipe } from '@angular/common';
import { Product } from '../product';
import { catchError, EMPTY, Subscription, tap } from 'rxjs';
import { ProductService } from '../product.service';
import { CartService } from 'src/app/cart/cart.service';

@Component({
    selector: 'pm-product-detail',
    templateUrl: './product-detail.component.html',
    standalone: true,
    imports: [NgIf, NgFor, CurrencyPipe]
})
export class ProductDetailComponent implements OnChanges, OnDestroy {
  @Input() productId: number = 0;
  errorMessage = '';
  sub!: Subscription;

  private productService = inject(ProductService);
  private cartService = inject(CartService);
  
  // Product to display
  product: Product | null = null;

  // Set the page title
  pageTitle = this.product ? `Product Detail for: ${this.product.productName}` : 'Product Detail';

  ngOnChanges(changes: SimpleChanges): void {
    const id = changes['productId'].currentValue;
    if (id) {
      this.sub = this.productService.getProduct(id)
        .pipe(
          tap(() => console.log('In component pipeline:')),
          catchError(err => {
            this.errorMessage = err;
            return EMPTY;
          })
        )
        .subscribe({
          next: product => {
            this.product = product;
            this.pageTitle = `Product Detail for: ${this.product?.productName ?? 'Unknown Product'}`;
          }
        });
    }
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    
  } 

  addToCart(product: Product) {
    this.cartService.addToCart(product);     
  }
}
