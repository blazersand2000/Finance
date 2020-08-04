import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { QuoteService, Quote } from 'src/app/quote/quote.service';
import { PortfolioService } from 'src/app/shared/portfolio.service';

@Component({
  selector: 'app-buy',
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.css']
})
export class BuyComponent implements OnInit {
  buyForm: FormGroup;
  errorMessage: string;
  isLoading: boolean = false;

  constructor(private portfolioService: PortfolioService) { }

  ngOnInit() {
    this.buyForm = new FormGroup({
      symbol: new FormControl({value: '', disabled: this.isLoading}, Validators.required),
      quantity: new FormControl({value: '', disabled: this.isLoading}, Validators.required),
    });

  }

  onSubmit() {
    this.errorMessage = null;
    this.isLoading = true;
    this.portfolioService.buyStocks({ symbol: this.buyForm.value.symbol, quantity: this.buyForm.value.quantity })
    .subscribe(
      buyRes => {
        console.log(buyRes);
        this.errorMessage = null;
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
