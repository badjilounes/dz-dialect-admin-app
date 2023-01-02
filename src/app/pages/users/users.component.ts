import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { catchError, map, of, startWith, switchMap, EMPTY, tap } from 'rxjs';
import { UserResponseDto, UsersHttpService } from 'src/clients/dz-dialect-identity-api';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@UntilDestroy()
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatSnackBarModule,
  ],
})
export class UsersComponent implements AfterViewInit {
  displayedColumns: string[] = ['email', 'username', 'name', 'provider', 'isAdmin'];
  data: UserResponseDto[] = [];

  pageIndex = 0;
  pageSize = 10;
  length = 0;
  isLoadingResults = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private readonly usersHttpService: UsersHttpService,
    private readonly snackBar: MatSnackBar,
  ) {}

  ngAfterViewInit() {
    this.paginator.page
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.usersHttpService
            .getAll(this.paginator.pageIndex, this.paginator.pageSize)
            .pipe(catchError(() => of(null)));
        }),
        map((data) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;

          if (data === null) {
            return [];
          }

          // Only refresh the result length if there is new data. In case of rate
          // limit errors, we do not want to reset the paginator to zero, as that
          // would prevent users from re-triggering requests.
          this.length = data.length;
          this.pageIndex = data.pageIndex;
          this.pageSize = data.pageSize;

          return data.elements;
        }),
        untilDestroyed(this),
      )
      .subscribe((data) => (this.data = data));
  }

  toggleAdmin(userId: string, isAdmin: boolean) {
    this.usersHttpService
      .updateAdmin({ userId, isAdmin })
      .pipe(
        tap(() => this.snackBar.open('Opération effectuée', 'OK', { duration: 3000 })),
        tap(() => this.paginator.page.emit()),
        catchError((error) => {
          this.snackBar.open(error.error.message, 'OK', { duration: 3000 });
          return EMPTY;
        }),
        untilDestroyed(this),
      )
      .subscribe();
  }
}
