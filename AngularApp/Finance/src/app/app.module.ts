import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { QuoteComponent } from './quote/quote.component';
import { HttpClientModule } from '@angular/common/http';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { BuyComponent } from './portfolio/buy/buy.component';
import { HistoryComponent } from './portfolio/history/history.component';
import { PortfolioComponent } from './portfolio/portfolio/portfolio.component';
import { AbsPipe } from './shared/abs.pipe';
import { SellComponent } from './portfolio/sell/sell.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    QuoteComponent,
    LoadingSpinnerComponent,
    BuyComponent,
    HistoryComponent,
    PortfolioComponent,
    AbsPipe,
    SellComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
