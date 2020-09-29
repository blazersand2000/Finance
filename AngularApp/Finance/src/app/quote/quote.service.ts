import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class QuoteService {
   private readonly unknownErrorMessage = "Connection error."

   constructor(private http: HttpClient) { }

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

   updateCachedSymbolsIfNeeded() {
      const symbolsString = localStorage.getItem('symbols');
      if (symbolsString == null || (Date.now() - (JSON.parse(symbolsString) as SymbolCache).timestamp) > 1000 * 60 * 60 * 24) {

         return this.http.get<SymbolCache>(
            environment.apiUrl + `symbols`
         )
         .pipe(
            tap(symbolResponse => localStorage.setItem('symbols', JSON.stringify(symbolResponse))),
            catchError((errorResponse: HttpErrorResponse) => {
               return throwError(errorResponse.error.message || this.unknownErrorMessage)
            })
         );

      }
   }

   getCachedSymbols(): SymbolCache {
      return JSON.parse(localStorage.getItem('symbols'));
   }
}

export interface SymbolCache {
   timestamp: number;
   symbols: {symbol: string, companyName: string}[];
}

export interface Quote {
   companyName: string;
   latestPrice: number;
   symbol: string;
}