import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuoteComponent } from './quote/quote.component';
import { BuyComponent } from './buy/buy/buy.component';


const routes: Routes = [
  { path: '', redirectTo: '/quote', pathMatch: 'full' },
  { path: 'quote', component: QuoteComponent },
  { path: 'buy', component: BuyComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
