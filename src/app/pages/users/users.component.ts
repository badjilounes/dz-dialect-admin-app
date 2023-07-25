import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { EMPTY, catchError, tap } from 'rxjs';
import { UserResponseDto, UsersHttpService } from 'src/clients/dz-dialect-identity-api';
import {
  UiSortableCrudComponent,
  UiSortableCrudConfiguration,
} from '../../shared/business/ui-sortable-crud/ui-sortable-crud.component';

@UntilDestroy()
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  standalone: true,
  imports: [CommonModule, MatSlideToggleModule, UiSortableCrudComponent],
})
export class UsersComponent {
  configuration: UiSortableCrudConfiguration<UserResponseDto> = this.buildConfiguration();

  constructor(
    private readonly usersHttpService: UsersHttpService,
    private readonly snackBar: MatSnackBar,
    private readonly title: Title,
  ) {
    this.title.setTitle('Utilisateurs');
  }

  toggleAdmin(userId: string, isAdmin: boolean) {
    this.usersHttpService
      .updateAdmin({ userId, isAdmin })
      .pipe(
        tap(() =>
          this.snackBar.open("Les droits de l'utilisateur ont bien été modifié", 'Fermer', {
            duration: 3000,
          }),
        ),
        tap(() => (this.configuration = { ...this.buildConfiguration() })),
        catchError((error) => {
          this.snackBar.open(error.error.message, 'Fermer', { duration: 3000 });
          return EMPTY;
        }),
        untilDestroyed(this),
      )
      .subscribe();
  }

  private buildConfiguration(): UiSortableCrudConfiguration<UserResponseDto> {
    return {
      title: 'Utilisateurs',
      emptyState: {
        withSearch: (search: string) => ({
          title: search ? `Aucun utilisateur ne correspond à "${search}"` : 'Aucun utilisateur',
          subtitle: '',
        }),
      },
      search: {
        label: 'Rechercher un utilisateur',
        placeholder: 'Rechercher un utilisateur',
      },
      read: {
        service$: (pageIndex: number, pageSize: number, query?: string) =>
          this.usersHttpService.getAll(pageIndex, pageSize, query ?? ''),
      },
    };
  }
}
