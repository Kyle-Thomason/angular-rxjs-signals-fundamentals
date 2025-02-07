import { inject, Injectable } from '@angular/core';
import { Review } from './review';
import { catchError, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpErrorService } from '../utilities/http-error.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  
  private reviewsUrl = 'api/reviews';
 private http = inject(HttpClient);
   private errorService = inject(HttpErrorService);

  getReviewUrl(productId: number): string {
    // Use appropriate regular expression syntax to
    // get an exact match on the id
    return this.reviewsUrl + '?productId=^' + productId + '$';
  }

 
  handleError(err: any) {
    throw new Error('Method not implemented.');
  }
}
