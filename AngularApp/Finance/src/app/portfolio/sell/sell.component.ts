import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { PortfolioService, Position } from 'src/app/portfolio/portfolio.service';

@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.css'],
  //changeDetection: ChangeDetectionStrategy.Default
})
export class SellComponent implements OnInit {
  sellForm: FormGroup;
  errorMessage: string;
  isLoading: boolean = false;
  positions: Position[];
  selectedPosition: Position = null;

  //form getters
  get position() { return this.sellForm.get('position'); }
  get quantity() { return this.sellForm.get('quantity'); }

  constructor(private portfolioService: PortfolioService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.loadPortfolio();
    this.sellForm = new FormGroup({
      position: new FormControl({value: ''}, [Validators.required]),
      quantity: new FormControl({value: '', disabled: false}, [Validators.required]),
    });
    console.log(this.sellForm.get('position').value)
  }

  private loadPortfolio() {
    this.errorMessage = null;
    this.isLoading = true;
    this.portfolioService.getPortfolio()
      .subscribe(
        response => {
          //console.log(response);
          this.positions = response.filter((position) => position.symbol.toUpperCase() != "DEPOSIT").sort();
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

  onChangePosition(newPosition: string) {
    console.log("Position changed");
    this.quantity.markAsPristine();
    this.quantity.markAsUntouched();
    this.quantity.setValue('');
    this.quantity.enable();
    this.selectedPosition = this.positions.find(p => p.symbol.toUpperCase() == newPosition.toUpperCase());
    this.quantity.setValidators([Validators.min(1), Validators.max(this.selectedPosition.quantity), Validators.required, Validators.pattern(/^[0-9]*$/)])
    this.quantity.updateValueAndValidity();
  }

  onSubmit() {
    this.errorMessage = null;
    this.isLoading = true;
    this.portfolioService.sellStocks({ symbol: this.sellForm.value.position, quantity: this.sellForm.value.quantity })
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
