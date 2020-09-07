import { Component, OnInit } from '@angular/core';
import { PortfolioService, Transaction } from 'src/app/portfolio/portfolio.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  errorMessage: string;
  isLoading = false;
  transactions: Transaction[];

  constructor(private portfolioService: PortfolioService) { }

  ngOnInit() {
    this.loadHistory();
  }

  private loadHistory() {
    this.errorMessage = null;
    this.isLoading = true;
    this.portfolioService.getHistory()
    .subscribe(
      response => {
        console.log(response);
        this.transactions = response.sort((a, b) => b.timestamp - a.timestamp);
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
