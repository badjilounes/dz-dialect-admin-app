import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/unauthenticated/unauthenticated.module').then((m) => m.UnauthenticatedModule),
  },
  {
    path: 'app',
    loadChildren: () => import('./pages/authenticated/authenticated.module').then((m) => m.AuthenticatedModule),
  },
  { path: '**', redirectTo: 'app' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
