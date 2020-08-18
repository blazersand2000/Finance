import { Component, OnInit } from '@angular/core';
import { PortfolioService, Position } from 'src/app/shared/portfolio.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {
  errorMessage: string;
  isLoading = false;
  positions: Position[];

  constructor(private portfolioService: PortfolioService) { }

  ngOnInit() {
    this.loadPortfolio();
  }

  private loadPortfolio() {
    this.errorMessage = null;
    this.isLoading = true;
    this.portfolioService.getPortfolio()
    .subscribe(
      response => {
        console.log(response);
        this.positions = response.sort();
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
