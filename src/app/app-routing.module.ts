import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

import { AuthenticatedGuard } from 'src/app/core/authentication/authenticated.guard';
import { UnauthenticatedGuard } from 'src/app/core/authentication/unauthenticated.guard';
import { UsersComponent } from 'src/app/pages/users/users.component';
import { MenuComponent } from './core/menu/menu.component';
import { LoginComponent } from './pages/login/login.component';
import { SentenceComponent } from './pages/sentence/sentence.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: '',
    component: MenuComponent,
    canActivateChild: [AuthenticatedGuard],
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'sentences', component: SentenceComponent },
      { path: 'users', component: UsersComponent },
    ],
  },

  { path: 'login', component: LoginComponent, canActivate: [UnauthenticatedGuard] },

  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
