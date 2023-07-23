import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';
import { map, shareReplay } from 'rxjs';
import {
  ConfirmButtonColor,
  ConfirmData,
} from 'src/app/shared/design-system/confirm-dialog/confirm-dialog.service';
import { ProfessorHttpService, TrainingResponseDto } from 'src/clients/dz-dialect-training-api';
import {
  UiSortableCrudComponent,
  UiSortableCrudConfiguration,
} from '../../shared/business/ui-sortable-crud/ui-sortable-crud.component';
import { AddTrainingComponent } from './add-training/add-training.component';

@UntilDestroy()
@Component({
  selector: 'app-trainings',
  templateUrl: './trainings.component.html',
  styleUrls: ['./trainings.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    UiSortableCrudComponent,
  ],
})
export class TrainingsComponent {
  configuration: UiSortableCrudConfiguration<TrainingResponseDto> = {
    title: 'Formations',
    create: {
      buttonLabel: 'Ajouter une formation',
      dialogComponent: AddTrainingComponent,
      dialogData: () => undefined,
      onSuccess: () =>
        this.snackBar.open(`La formation a bien été ajoutée`, 'Fermer', { duration: 2000 }),
    },
    read: {
      service$: (pageIndex: number, pageSize: number, query?: string) =>
        this.professorHttpService.searchTraining(pageIndex, pageSize, query),
    },
    update: {
      dialogComponent: AddTrainingComponent,
      dialogData: (training: TrainingResponseDto) => training,
      onSuccess: () =>
        this.snackBar.open(`La formation a bien été modifiée`, 'Fermer', { duration: 2000 }),
    },
    delete: {
      confirmConfiguration: (training: TrainingResponseDto): MatDialogConfig<ConfirmData> => ({
        data: {
          title: 'Supprimer la formation',
          content: `Êtes-vous sûr de vouloir supprimer la formation "${training.name}" ?`,
          cancelLabel: 'Annuler',
          acceptLabel: 'Supprimer',
          acceptButtonColor: ConfirmButtonColor.WARN,
        },
      }),
      onSuccess: (training: TrainingResponseDto) =>
        this.snackBar.open(`La formation "${training.name}" a été supprimée`, 'Fermer', {
          duration: 2000,
        }),
      service$: (training: TrainingResponseDto) =>
        this.professorHttpService.deleteTraining(training.id),
    },
    reorder: {
      service$: (trainings: TrainingResponseDto[]) =>
        this.professorHttpService.reorderTrainings({
          trainings: trainings.map((training, index) => ({
            id: training.id,
            order: index + 1,
          })),
        }),
      onSuccess: () =>
        this.snackBar.open(`Les formations ont bien été réordonnées`, 'Fermer', { duration: 2000 }),
    },
  };

  isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map((result) => result.matches),
    shareReplay(),
  );

  constructor(
    private readonly professorHttpService: ProfessorHttpService,
    private readonly title: Title,
    private readonly snackBar: MatSnackBar,
    private readonly breakpointObserver: BreakpointObserver,
  ) {
    this.title.setTitle('Formations');
  }
}
