import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { QuoteService, Quote } from './quote.service';

@Component({
  selector: 'app-quote',
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.css']
})
export class QuoteComponent implements OnInit {
  quoteForm: FormGroup;
  quote: Quote;
  errorMessage: string;
  isLoading: boolean = false;

  constructor(private quoteService: QuoteService) { }

  ngOnInit() {
    this.quoteForm = new FormGroup({
      symbol : new FormControl({value: '', disabled: this.isLoading}, Validators.required)
    });
  }

  handleGetQuoteClick() {
    this.errorMessage = null;
    this.isLoading = true;
    this.quoteService.getQuote(this.quoteForm.value.symbol)
    .subscribe(
      quote => {
        this.quote = quote;
        this.errorMessage = null;
      },
      error => {
        this.errorMessage = error;
      }
    ).add(() => {
      this.isLoading = false;
    });
  }

}
