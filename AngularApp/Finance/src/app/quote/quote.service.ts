import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class QuoteService {
   //private readonly url = 'https://courseproject-aeae3.firebaseio.com/recipes.json' + environment.iexApiKey

   constructor(private http: HttpClient) { }

   // getQuote(symbol: string) {
   //    return this.http
   //       .get<Quote>(`https://cloud-sse.iexapis.com/stable/stock/${symbol}/quote`, { params: new HttpParams().set('token', environment.iexApiKey) });
   // }

   getQuote(symbol: string) {
      return this.http.get<Quote>(
         environment.apiUrl + `quote/${symbol}`
      )
      .pipe(
         catchError((errorResponse: HttpErrorResponse) => {
            switch (errorResponse.status) {
               case 404:
                  return throwError(`The symbol ${symbol.toUpperCase()} was not found.`)
               default:
                  return throwError("An error occured.")
            }
         })
      );
   }
}

export interface Quote {
   companyName: string;
   latestPrice: number;
   symbol: string;
}