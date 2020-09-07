import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuoteComponent } from './quote/quote.component';
import { BuyComponent } from './portfolio/buy/buy.component';
import { HistoryComponent } from './portfolio/history/history.component';
import { PortfolioComponent } from './portfolio/portfolio/portfolio.component';
import { SellComponent } from './portfolio/sell/sell.component';
import { AuthGuard } from './auth/auth.guard';
import { AuthComponent } from './auth/auth.component';


const routes: Routes = [
  { path: '', component: PortfolioComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'quote', component: QuoteComponent, canActivate: [AuthGuard] },
  { path: 'buy', component: BuyComponent, canActivate: [AuthGuard] },
  { path: 'sell', component: SellComponent, canActivate: [AuthGuard] },
  { path: 'history', component: HistoryComponent, canActivate: [AuthGuard] },
  { path: 'auth', component: AuthComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
