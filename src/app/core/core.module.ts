import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HTTP_BEARER_TOKEN_INTERCEPTOR_PROVIDER } from 'src/app/core/authentication/bearer-token.interceptor';
import { HTTP_ERROR_INTERCEPTOR_PROVIDER } from 'src/app/core/authentication/http-error.interceptor';
import { IdentityClientModule } from 'src/app/core/clients/identity-client.module';
import { SentenceClientModule } from 'src/app/core/clients/sentence-client.module';
import { TrainingClientModule } from 'src/app/core/clients/training-client.module';
import { AppTranslateModule } from './translate/translate.module';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    AppTranslateModule,
    SentenceClientModule,
    TrainingClientModule,
    IdentityClientModule,
  ],
  providers: [
    HTTP_BEARER_TOKEN_INTERCEPTOR_PROVIDER,
    HTTP_ERROR_INTERCEPTOR_PROVIDER,
    { provide: LOCALE_ID, useValue: 'fr' },
  ],
})
export class CoreModule {
  constructor(private readonly translate: TranslateService) {
    this.translate.setDefaultLang('fr');
    this.translate.use('fr');
  }
}
