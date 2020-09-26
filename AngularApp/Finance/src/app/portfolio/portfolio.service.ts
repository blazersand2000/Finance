import { flatMap, catchError, map } from 'rxjs/operators'
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { QuoteService } from '../quote/quote.service';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private readonly unknownErrorMessage = "Connection error."

  constructor(
    private http: HttpClient,
    private quoteService: QuoteService) { }

  buyStocks(transaction: { symbol: string, quantity: number }) {
    return this.http
      .post(
        environment.apiUrl + `transactions`,
        {
          ...transaction,
        }
      )
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          return throwError(errorResponse.error.message || this.unknownErrorMessage)
        })
      );
  }

  sellStocks(transaction: { symbol: string, quantity: number }) {
    return this.buyStocks({
      ...transaction,
      quantity: -1 * transaction.quantity
    });
  }

  getHistory() {
    return this.http.get<Transaction[]>(
      environment.apiUrl + `transactions`
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
          return throwError(errorResponse.error.message || this.unknownErrorMessage)
        })
      );
  }

  getPortfolio() {
    return this.http.get<Position[]>(
      environment.apiUrl + `portfolio`
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
          return throwError(errorResponse.error.message || this.unknownErrorMessage)
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