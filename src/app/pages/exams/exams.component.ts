import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { tap } from 'rxjs';
import {
  ConfirmButtonColor,
  ConfirmData,
} from 'src/app/shared/design-system/confirm-dialog/confirm-dialog.service';
import { ExamResponseDto, ProfessorHttpService } from '../../../clients/dz-dialect-training-api';
import { SubnavCourseListComponent } from '../../shared/business/subnav-course-list/subnav-course-list.component';
import { SubnavTrainingListComponent } from '../../shared/business/subnav-training-list/subnav-training-list.component';
import {
  UiSortableCrudComponent,
  UiSortableCrudConfiguration,
} from '../../shared/business/ui-sortable-crud/ui-sortable-crud.component';
import { AddExamComponent } from './add-exam/add-exam.component';

@UntilDestroy()
@Component({
  selector: 'app-exams',
  templateUrl: './exams.component.html',
  styleUrls: ['./exams.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    SubnavTrainingListComponent,
    SubnavCourseListComponent,
    UiSortableCrudComponent,
  ],
})
export class ExamsComponent implements OnInit {
  configuration!: UiSortableCrudConfiguration<ExamResponseDto>;
  courseId!: string;
  trainingId!: string;

  constructor(
    private readonly professorHttpService: ProfessorHttpService,
    private readonly title: Title,
    private readonly snackBar: MatSnackBar,
    private readonly route: ActivatedRoute,
  ) {
    this.title.setTitle('Examens');
  }

  ngOnInit(): void {
    this.route.params
      .pipe(
        tap(() => (this.trainingId = this.route.snapshot.params['trainingId'])),
        tap(() => (this.courseId = this.route.snapshot.params['courseId'])),
        tap(() => (this.configuration = { ...this.buildUiConfiguration() })),
        untilDestroyed(this),
      )
      .subscribe();
  }

  private buildUiConfiguration(): UiSortableCrudConfiguration<ExamResponseDto> {
    return {
      title: 'Cours',
      create: {
        buttonLabel: 'Ajouter un examen',
        dialogComponent: AddExamComponent,
        dialogData: () => ({ courseId: this.courseId }),
        onSuccess: () =>
          this.snackBar.open(`L'examen a bien été ajouté`, 'Fermer', { duration: 2000 }),
      },
      read: {
        service$: (pageIndex: number, pageSize: number, query?: string) =>
          this.professorHttpService.searchExam(this.courseId, pageIndex, pageSize, query),
      },
      update: {
        dialogComponent: AddExamComponent,
        dialogData: (exam: ExamResponseDto) => ({ exam, courseId: this.courseId }),
        onSuccess: () =>
          this.snackBar.open(`L'examen a bien été modifié`, 'Fermer', { duration: 2000 }),
      },
      delete: {
        confirmConfiguration: (exam: ExamResponseDto): MatDialogConfig<ConfirmData> => ({
          data: {
            title: "Supprimer l'examen",
            content: `Êtes-vous sûr de vouloir supprimer l'examen "${exam.name}" ?`,
            cancelLabel: 'Annuler',
            acceptLabel: 'Supprimer',
            acceptButtonColor: ConfirmButtonColor.WARN,
          },
        }),
        onSuccess: (exam: ExamResponseDto) =>
          this.snackBar.open(`L'examen "${exam.name}" a été supprimé`, 'Fermer', {
            duration: 2000,
          }),
        service$: (exam: ExamResponseDto) => this.professorHttpService.deleteExam(exam.id),
      },
      reorder: {
        service$: (exams: ExamResponseDto[]) =>
          this.professorHttpService.reorderExams({
            exams: exams.map((exam, index) => ({
              id: exam.id,
              order: index + 1,
            })),
          }),
        onSuccess: () =>
          this.snackBar.open(`Les examens ont bien été réordonnées`, 'Fermer', { duration: 2000 }),
      },
    };
  }
}
