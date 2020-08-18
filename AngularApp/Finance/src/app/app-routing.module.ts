import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuoteComponent } from './quote/quote.component';
import { BuyComponent } from './portfolio/buy/buy.component';
import { HistoryComponent } from './portfolio/history/history.component';
import { PortfolioComponent } from './portfolio/portfolio/portfolio.component';
import { SellComponent } from './portfolio/sell/sell.component';


const routes: Routes = [
  { path: '', component: PortfolioComponent, pathMatch: 'full' },
  { path: 'quote', component: QuoteComponent },
  { path: 'buy', component: BuyComponent },
  { path: 'sell', component: SellComponent },
  { path: 'history', component: HistoryComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
