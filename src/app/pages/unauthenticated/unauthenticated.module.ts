import { NgModule } from '@angular/core';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { UnauthenticatedRoutingModule } from './unauthenticated-routing.module';

@NgModule({
  declarations: [LoginComponent, SignupComponent],
  imports: [UnauthenticatedRoutingModule],
})
export class UnauthenticatedModule {}
