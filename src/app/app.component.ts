import { Component } from '@angular/core';
import { AppStore } from 'src/app/app.store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'dz-dialect-admin-app';

  constructor(private readonly appStore: AppStore) {
    this.appStore.initStore();
  }
}
