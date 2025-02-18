import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, concat, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { Product } from './product';
import { ProductData } from './product-data';
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
  private reviewservice = inject(ReviewService);

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsUrl)
    .pipe(
      tap(() => console.log('In http.get pipeline')),
      catchError(err => this.handleError(err))
    );
  }

  getProduct(id: number): Observable<Product> {
    const productUrl = this.productsUrl + '/' + id;
    return this.http.get<Product>(productUrl)
    .pipe(
      tap(() => console.log('In http.get pipeline')),
      switchMap(product => product.hasReviews ? this.getProductWithReviews(product) : of(product)),
      catchError(err => this.handleError(err))
    );
  }

  private getProductWithReviews(product: Product): Observable<Product> {
    return this.http.get<Review[]>(this.reviewservice.getReviewUrl(product.id))
    .pipe(
      map(reviews => ({...product, reviews} as Product))
    );
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    const formattedMessage = this.errorService.formatError(err);
    return throwError(() => formattedMessage);
  }
}
