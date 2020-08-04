import { flatMap } from 'rxjs/operators'
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QuoteService } from '../quote/quote.service';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
private readonly url = "https://cs50-finance-9582e.firebaseio.com/";

  constructor(
    private http: HttpClient,
    private quoteService: QuoteService) { }

  buyStocks(transaction: {symbol: string, quantity: number}) {
    return this.quoteService.getQuote(transaction.symbol)
    .pipe(flatMap(quote => {
      return this.http
      .post(
        this.url + 'transactions.json',
        {
          ...transaction,
          costBasis: quote.latestPrice,
          timestamp: Date.now()
        }
      );
    }));
  }
}
