import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';
import { Configuration, ConfigurationParameters, ApiModule } from './clients/sentence-api';
import { HttpClientModule } from '@angular/common/http';

function apiConfigFactory(): Configuration {
  const params: ConfigurationParameters = {
    basePath: environment.sentenceApiUrl,
  };
  return new Configuration(params);
}


@NgModule({
  declarations: [],
  imports: [
    CommonModule, ApiModule.forRoot(apiConfigFactory), HttpClientModule
  ]
})
export class CoreModule { }


