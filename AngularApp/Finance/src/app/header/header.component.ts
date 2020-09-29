import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import { QuoteService } from '../quote/quote.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  authenticatedUser = null;
  private userSub: Subscription;
  private symbolSub: Subscription;

  constructor(private store: Store<fromApp.AppState>,
              private quoteService: QuoteService) { }

  ngOnInit() {
    this.userSub = this.store
      .select('auth')
      .pipe(map(authState => authState.user))
      .subscribe(user => {
        this.authenticatedUser = user;
      });

    this.symbolSub = this.quoteService.updateCachedSymbolsIfNeeded()
      .subscribe();
  }

  onLogout() {
    this.store.dispatch(new AuthActions.Logout());
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.symbolSub.unsubscribe();
  }

}
