import { flatMap, catchError, map } from 'rxjs/operators'
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { QuoteService } from '../quote/quote.service';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private readonly url = "https://cs50-finance-9582e.firebaseio.com/";

  constructor(
    private http: HttpClient,
    private quoteService: QuoteService) { }

  buyStocks(transaction: { symbol: string, quantity: number }) {
    return this.quoteService.getQuote(transaction.symbol)
      .pipe(flatMap(quote => {
        return this.http
          .post(
            this.url + 'transactions.json',
            {
              ...transaction,
              stockPrice: quote.latestPrice,
              timestamp: Date.now()
            }
          );
      }));
  }

  getHistory() {
    return this.http.get<Transaction[]>(
      `http://localhost:4300/api/transactions`
    )
    .pipe(
      map(transactions => {
        return transactions.map(transaction => {
          return {
            ...transaction,
            symbol: transaction.symbol.toUpperCase(),
            quantity: transaction.quantity,
            stockPrice: transaction.stockPrice,
            totalTransactionAmount: transaction.stockPrice * transaction.quantity * -1
          }
        })
      }),
      catchError((errorResponse: HttpErrorResponse) => {
        console.log(errorResponse);
        return throwError("An error occured.")
      })
    );
  }

  getPortfolio() {
    return this.http.get<Position[]>(
      `http://localhost:4300/api/portfolio`
    )
    .pipe(
      map(positions => {
        return positions.map(position => {
          return {
            ...position,
            gain: position.currentValue - position.costBasis
          }
        })
      }),
      catchError((errorResponse: HttpErrorResponse) => {
        console.log(errorResponse);
        return throwError("An error occured.")
      })
    );
  }

}

export interface Transaction {
  symbol: string;
  quantity: number;
  stockPrice: number;
  totalTransactionAmount: number;
  timestamp: number;
}

export interface Position {
  symbol: string;
  quantity: number;
  costBasis: number;
  currentValue: number;
  gain: number;
}