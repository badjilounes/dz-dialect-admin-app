import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { MenuComponent } from './core/menu/menu.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { AddSentenceComponent } from './pages/sentence/add-sentence/add-sentence.component';
import { SentenceComponent } from './pages/sentence/sentence.component';
import { UsersComponent } from './pages/users/users.component';
import { ButtonSentenceComponent } from './shared/design-system/button-sentence/button-sentence.component';
import { ChipsSentenceComponent } from './shared/design-system/chips-sentence/chips-sentence.component';
import { TextSentenceComponent } from './shared/design-system/text-sentence/text-sentence.component';

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    CoreModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MenuComponent,
    LoginComponent,
    UsersComponent,
    SentenceComponent,
    AddSentenceComponent,
    ChipsSentenceComponent,
    TextSentenceComponent,
    ButtonSentenceComponent,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
