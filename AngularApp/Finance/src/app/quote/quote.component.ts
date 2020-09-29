import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TypeaheadMatch, TypeaheadModule } from 'ngx-bootstrap/typeahead';

import { QuoteService, Quote, SymbolCache } from './quote.service';

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

  selected: string;
  symbols: {symbol: string, companyName: string, prettyPrinted: string}[];
  states: string[] = [
    'Alabama',
    'Alaska',
    'Arizona',
    'Arkansas',
    'California',
    'Colorado',
    'Connecticut',
    'Delaware',
    'Florida',
    'Georgia',
    'Hawaii',
    'Idaho',
    'Illinois',
    'Indiana',
    'Iowa',
    'Kansas',
    'Kentucky',
    'Louisiana',
    'Maine',
    'Maryland',
    'Massachusetts',
    'Michigan',
    'Minnesota',
    'Mississippi',
    'Missouri',
    'Montana',
    'Nebraska',
    'Nevada',
    'New Hampshire',
    'New Jersey',
    'New Mexico',
    'New York',
    'North Dakota',
    'North Carolina',
    'Ohio',
    'Oklahoma',
    'Oregon',
    'Pennsylvania',
    'Rhode Island',
    'South Carolina',
    'South Dakota',
    'Tennessee',
    'Texas',
    'Utah',
    'Vermont',
    'Virginia',
    'Washington',
    'West Virginia',
    'Wisconsin',
    'Wyoming'
  ];

  constructor(private quoteService: QuoteService) { }

  ngOnInit() {
    this.symbols = this.quoteService.getCachedSymbols().symbols.map(symbolDetail => {return {...symbolDetail, prettyPrinted: symbolDetail.symbol + ' ' + symbolDetail.companyName}});
    this.quoteForm = new FormGroup({
      symbol: new FormControl({ value: '', disabled: this.isLoading }, Validators.required)
    });
  }

  onSelect(event: TypeaheadMatch): void {
    this.selected = event.item.symbol;
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
