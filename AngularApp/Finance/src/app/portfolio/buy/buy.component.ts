import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { QuoteService, Quote } from 'src/app/quote/quote.service';
import { PortfolioService } from 'src/app/portfolio/portfolio.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';

@Component({
  selector: 'app-buy',
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.css']
})
export class BuyComponent implements OnInit {
  buyForm: FormGroup;
  errorMessage: string;
  isLoading: boolean = false;

  selected: string;
  symbols: {symbol: string, companyName: string, prettyPrinted: string}[];

  get currentlySelectedCompanyName(): string {
    return this.symbols.find(symbol => symbol.symbol.toUpperCase() === this.selected?.toUpperCase())?.companyName ?? "";
  }

  constructor(private portfolioService: PortfolioService,
              private router: Router,
              private route: ActivatedRoute,
              private quoteService: QuoteService) { }

  ngOnInit() {
    this.symbols = this.quoteService.getCachedSymbols().symbols.map(symbolDetail => {return {...symbolDetail, prettyPrinted: symbolDetail.symbol + ' ' + symbolDetail.companyName}});
    this.buyForm = new FormGroup({
      symbol: new FormControl({value: '', disabled: this.isLoading}, Validators.required),
      quantity: new FormControl({value: '', disabled: this.isLoading}, Validators.required),
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

}
