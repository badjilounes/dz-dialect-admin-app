import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

import { LoginComponent } from './pages/login/login.component';
import { MenuComponent } from './core/menu/menu.component';
import { SentenceComponent } from './pages/sentence/sentence.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  { path: 'login', component: LoginComponent },

  { 
    path: '', 
    component: MenuComponent, 
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'sentence', component: SentenceComponent }
    ] 
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
