import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { QuoteService, Quote } from 'src/app/quote/quote.service';
import { PortfolioService } from 'src/app/portfolio/portfolio.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { forkJoin, Subscription } from 'rxjs';

@Component({
  selector: 'app-buy',
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.css']
})
export class BuyComponent implements OnInit, OnDestroy {
  buyForm: FormGroup;
  errorMessage: string;
  isLoading = false;
  isCardLoading = false;
  cashAvailable: number = null;
  currentPrice: number = null;
  selected: string;
  quantity: number = null;
  symbols: {symbol: string, companyName: string, prettyPrinted: string}[];
  priceCalculationSub: Subscription;
  currentlySelectedCompanyName = "";

  constructor(private portfolioService: PortfolioService,
              private router: Router,
              private route: ActivatedRoute,
              private quoteService: QuoteService) { }

  ngOnInit() {
    this.symbols = this.quoteService.getCachedSymbols().symbols.map(symbolDetail => {return {...symbolDetail, prettyPrinted: symbolDetail.symbol + ' ' + symbolDetail.companyName}});
    this.buyForm = new FormGroup({
      symbol: new FormControl({value: '', disabled: this.isLoading}, Validators.required),
      quantity: new FormControl({value: '', disabled: this.isLoading}, [Validators.required, Validators.min(1)]),
    });
  }
  
  onSelect(event: TypeaheadMatch): void {
    this.selected = event.item.symbol;
  }

  onSubmit() {
    this.errorMessage = null;
    this.isLoading = true;
    this.portfolioService.buyStocks({ symbol: this.buyForm.value.symbol, quantity: this.buyForm.value.quantity })
    .subscribe(
      buyRes => {
        console.log(buyRes);
        this.errorMessage = null;
        this.router.navigate(['../'], {relativeTo: this.route});
      },
      error => {
        console.log(error);
        this.errorMessage = error;
      }
    ).add(() => {
      this.isLoading = false;
    });
  }

  onCalculatePrice() {
    this.priceCalculationSub?.unsubscribe();
    this.isCardLoading = true;
    this.priceCalculationSub = forkJoin([
      this.portfolioService.getPortfolio(), 
      this.quoteService.getQuote(this.selected)
    ]).subscribe(
      result => {
        if (this.currentlySelectedCompanyName === "") {
          this.cashAvailable = null;
          this.currentPrice = null;
        } else {
          this.cashAvailable = result[0].find(position => position.symbol.toLowerCase() === 'deposit')?.currentValue ?? 0;
          this.currentPrice = result[1].latestPrice;
        }
      },
      () => {
        this.cashAvailable = null;
        this.currentPrice = null;
      }
    ).add(() => {
      this.isCardLoading = false;
    });
  }

  onSymbolValueChange() {
    const foundCompany = this.symbols.find(symbol => symbol.symbol.toUpperCase() === this.selected?.toUpperCase());
    if (foundCompany) {
      this.currentlySelectedCompanyName = foundCompany.companyName;
      this.onCalculatePrice();
    } else {
      this.currentlySelectedCompanyName = "";
      this.cashAvailable = null;
      this.currentPrice = null;
      this.priceCalculationSub?.unsubscribe();
    }
  }

  ngOnDestroy() {
    this.priceCalculationSub?.unsubscribe();
  }

}
