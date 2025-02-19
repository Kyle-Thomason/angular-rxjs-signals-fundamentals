import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, forkJoin, map, Observable, of, tap, throwError } from 'rxjs';
import { shareReplay, switchMap } from 'rxjs/operators';
import { Product } from './product';
import { HttpErrorService } from '../utilities/http-error.service';
import { ReviewService } from '../reviews/review.service';
import { Review } from '../reviews/review';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'api/products';

  private http = inject(HttpClient);
  private errorService = inject(HttpErrorService);
  private reviewService = inject(ReviewService);

  private productsCache$!: Observable<Product[]>;

  getProducts(): Observable<Product[]> {
    if (!this.productsCache$) {
      this.productsCache$ = this.fetchProductsWithReviews().pipe(
        shareReplay(1),
        catchError(err => {
          console.error('There was an error returning your product list');
          //return this.handleError(err);
          return throwError(() => new Error('There was an error returning your product list'));
        })
      );
    }
    return this.productsCache$;
  }

  getProduct(id: number): Observable<Product> {
    return this.getProducts().pipe(
      map(products => products.find(product => product.id === id)),
      switchMap(product => product ? of(product) : throwError(() => new Error('Product not found'))),
      catchError(err => {
        console.error('There was an error returning your product');
        return throwError(() => new Error('There was an error returning your product'));
      })
    );
  }

  private fetchProductsWithReviews(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsUrl).pipe(
      switchMap(products => forkJoin(products.map(product => this.addReviewsToProduct(product)))),
      tap(() => console.log('Fetched products with reviews'))
    );
  }

  private addReviewsToProduct(product: Product): Observable<Product> {
    return this.http.get<Review[]>(this.reviewService.getReviewUrl(product.id)).pipe(
      map(reviews => ({ ...product, reviews } as Product))
    );
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    const formattedMessage = this.errorService.formatError(err);
    const userFriendlyMessage = 'An error occurred while processing your request. Please try again later.';
    console.error(formattedMessage);
    return throwError(() => userFriendlyMessage);
  }
}
