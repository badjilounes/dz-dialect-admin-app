import { NgModule } from "@angular/core";
import { AuthenticatedRoutingModule } from "./authenticated-routing.module";
import { MenuModule } from "./menu/menu.module";

@NgModule({
  imports: [
    AuthenticatedRoutingModule,
    MenuModule,
  ]
})
export class AuthenticatedModule { }
