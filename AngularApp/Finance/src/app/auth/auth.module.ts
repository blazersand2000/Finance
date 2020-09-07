import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AuthComponent } from './auth.component';
//import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
   declarations: [AuthComponent],
   imports: [
      FormsModule,
      //SharedModule,
      RouterModule.forChild([{
         path: '', 
         component: AuthComponent
      }])
   ]
})
export class AuthModule {}