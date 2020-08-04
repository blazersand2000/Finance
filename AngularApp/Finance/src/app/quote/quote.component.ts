import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { QuoteService, Quote } from './quote.service';

@Component({
  selector: 'app-quote',
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.css']
})
export class QuoteComponent implements OnInit {
  @ViewChild('symbolInput', { static: false }) symbolInput: ElementRef;
  quote: Quote;
  errorMessage: string;
  isLoading: boolean = false;

  constructor(private quoteService: QuoteService) { }

  ngOnInit() {
  }

  handleGetQuoteClick() {
    this.errorMessage = null;
    this.isLoading = true;
    this.quoteService.getQuote(this.symbolInput.nativeElement.value)
    .subscribe(
      quote => {
        this.quote = quote;
        this.errorMessage = null;
        this.isLoading = false;
      },
      error => {
        this.errorMessage = error;
        this.isLoading = false;
      }
    );
  }

}
