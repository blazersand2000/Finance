import { Actions, ofType, Effect } from '@ngrx/effects';
import { switchMap, catchError, map, tap, delay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as AuthActions from './auth.actions';
import { User } from '../user.model';
import { AuthService } from '../auth.service';

export interface AuthResponseData {
   idToken: string;
   email: string;
   refreshToken: string;
   expiresIn: string;
   localId: string;
   registered?: boolean;
}

const handleAuthentication = (
   expiresIn: number, 
   email: string, 
   userId: string, 
   token: string
) => {
   const expirationDate = new Date(
      new Date().getTime() + +expiresIn * 1000
   );
   const user = new User(email, userId, token, expirationDate);
   
   localStorage.setItem('userData', JSON.stringify(user));

   return new AuthActions.AuthenticateSuccess({
      email: email,
      userId: userId,
      token: token,
      expirationDate: expirationDate,
      redirect: true
   });
};

const handleError = (errorRes: any) => {
   let errorMessage = 'An unknown error occurred.'
   if (!errorRes.error || !errorRes.error.error) {
      return of(new AuthActions.AuthenticateFail(errorMessage));
   }
   switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
         errorMessage = 'An account with this email already exists.';
         break;
      case 'OPERATION_NOT_ALLOWED':
         errorMessage = 'Sign up is not enabled for this application.';
         break;
      case 'TOO_MANY_ATTEMPTS_TRY_LATER':
         errorMessage = 'Sign up is blocked due to excessive attempts, please try again later.';
         break;
      case 'USER_DISABLED':
      // errorMessage = 'This account is disabled.';
      // break;
      case 'EMAIL_NOT_FOUND':
      case 'INVALID_PASSWORD':
         errorMessage = 'Invalid email and/or password.';
         break;
      default:
         break;
   }
   return of(new AuthActions.AuthenticateFail(errorMessage));
};

@Injectable()
export class AuthEffects {

   constructor(
      private actions$: Actions,
      private http: HttpClient,
      private router: Router,
      private authService: AuthService) { }

   @Effect()
   authSignup = this.actions$.pipe(
      ofType(AuthActions.SIGNUP_START),
      switchMap((signupAction: AuthActions.SignUpStart) => {
         return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
            {
               email: signupAction.payload.email,
               password: signupAction.payload.password,
               returnSecureToken: true
            }
         ).pipe(delay(1000),
            tap(resData => {
               this.authService.setLogoutTimer(+resData.expiresIn * 1000)
            }),
            map(resData => {
               return handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken);
            }),
            catchError(errorRes => {
               return handleError(errorRes);
            })

         );
      })
   );

   @Effect()
   authLogin = this.actions$.pipe(
      ofType(AuthActions.LOGIN_START),
      switchMap((authData: AuthActions.LoginStart) => {
         return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
            {
               email: authData.payload.email,
               password: authData.payload.password,
               returnSecureToken: true
            }
         ).pipe(delay(1000),
            tap(resData => {
               this.authService.setLogoutTimer(+resData.expiresIn * 1000)
            }),
            map(resData => {
               return handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken);
            }),
            catchError(errorRes => {
               return handleError(errorRes);
            })

         );
      })

   );

   @Effect({ dispatch: false })
   authRedirect = this.actions$.pipe(
      ofType(AuthActions.AUTHENTICATE_SUCCESS),
      tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
         if (authSuccessAction.payload.redirect === true) {
            this.router.navigate(['/']);
         }
      })
   );

   @Effect()
   autoLogin = this.actions$.pipe(
      ofType(AuthActions.AUTO_LOGIN),
      map(() => {
         const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string;
          } = JSON.parse( localStorage.getItem('userData'));
          if (!userData) {
            return { type: 'DUMMY'};
          }
          const loadedUser = new User(
            userData.email, 
            userData.id, 
            userData._token, 
            new Date(userData._tokenExpirationDate)
          );
      
          if (loadedUser.token) {
            // this.user.next(loadedUser);
            const expirationDuration = 
              new Date(userData._tokenExpirationDate).getTime() - 
              new Date().getTime();
            this.authService.setLogoutTimer(expirationDuration);
            return new AuthActions.AuthenticateSuccess({
              email: loadedUser.email,
              userId: loadedUser.id,
              token: loadedUser.token,
              expirationDate: new Date(userData._tokenExpirationDate),
              redirect: false
            });

          }

          return { type: 'DUMMY'}
      
      })
   )

   @Effect({dispatch: false})
   authLogout = this.actions$.pipe(
      ofType(AuthActions.LOGOUT),
      tap(() => {
         this.authService.clearLogoutTimer();
         localStorage.removeItem('userData');
         this.router.navigate(['/auth']);
      })
   )

}