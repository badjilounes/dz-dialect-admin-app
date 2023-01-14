import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { catchError, EMPTY, tap } from 'rxjs';
import { AppStore } from 'src/app/app.store';
import { AuthenticationHttpService } from 'src/clients/dz-dialect-identity-api';

@UntilDestroy()
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatInputModule,
    MatSnackBarModule,
  ],
})
export class LoginComponent implements OnInit {
  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });
  hidePassword = true;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authenticationHttpService: AuthenticationHttpService,
    private readonly userAppStore: AppStore,
    private readonly snackBar: MatSnackBar,
    private readonly matIconRegistry: MatIconRegistry,
    private readonly domSanitizer: DomSanitizer,
    private readonly title: Title,
  ) {
    this.title.setTitle('Connexion');
    this.matIconRegistry.addSvgIcon(
      'twitter',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/svg/twitter.svg'),
    );
    this.matIconRegistry.addSvgIcon(
      'google',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/svg/google.svg'),
    );
  }

  ngOnInit(): void {
    const error = this.route.snapshot.queryParams['error'];
    if (error) {
      this.snackBar.open(error, 'Fermer', { duration: 3000 });
    }
  }

  submit() {
    this.authenticationHttpService
      .adminSignIn(this.form.value)
      .pipe(
        tap(({ token }) => this.userAppStore.setAsAuthenticated(token)),
        tap(() => this.router.navigate(['/home'])),
        catchError((error) => {
          this.snackBar.open(error.error.message, 'Fermer', { duration: 3000 });
          return EMPTY;
        }),
        untilDestroyed(this),
      )
      .subscribe();
  }

  signInWith(provider: string) {
    this.authenticationHttpService
      .adminRedirectToAuthorizeUrl(provider)
      .pipe(
        tap(({ url }) => (window.location.href = url)),
        catchError((error) => {
          this.snackBar.open(error.error.message, 'Fermer', { duration: 3000 });
          return EMPTY;
        }),
        untilDestroyed(this),
      )
      .subscribe();
  }
}
