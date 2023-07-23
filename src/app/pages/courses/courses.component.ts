import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { map, shareReplay, tap } from 'rxjs';
import { CourseResponseDto, ProfessorHttpService } from '../../../clients/dz-dialect-training-api';
import { SubnavTrainingListComponent } from '../../shared/business/subnav-training-list/subnav-training-list.component';
import {
  UiSortableCrudComponent,
  UiSortableCrudConfiguration,
} from '../../shared/business/ui-sortable-crud/ui-sortable-crud.component';
import {
  ConfirmButtonColor,
  ConfirmData,
} from '../../shared/design-system/confirm-dialog/confirm-dialog.service';
import { AddCourseComponent } from './add-course/add-course.component';

@UntilDestroy()
@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    MatSnackBarModule,
    MatIconModule,
    MatButtonModule,
    SubnavTrainingListComponent,
    UiSortableCrudComponent,
  ],
})
export class CoursesComponent implements OnInit {
  trainingId!: string;

  configuration!: UiSortableCrudConfiguration<CourseResponseDto>;

  isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map((result) => result.matches),
    shareReplay(),
  );

  constructor(
    private readonly professorHttpService: ProfessorHttpService,
    private readonly title: Title,
    private readonly snackBar: MatSnackBar,
    private readonly breakpointObserver: BreakpointObserver,
    private readonly route: ActivatedRoute,
  ) {
    this.title.setTitle('Cours');
  }

  ngOnInit(): void {
    this.route.params
      .pipe(
        tap(() => (this.trainingId = this.route.snapshot.params['trainingId'])),
        tap(() => (this.configuration = { ...this.buildUiConfiguration() })),
        untilDestroyed(this),
      )
      .subscribe();
  }

  private buildUiConfiguration(): UiSortableCrudConfiguration<CourseResponseDto> {
    return {
      title: 'Cours',
      create: {
        buttonLabel: 'Ajouter un cours',
        dialogComponent: AddCourseComponent,
        dialogData: () => ({ trainingId: this.trainingId }),
        onSuccess: () =>
          this.snackBar.open(`Le cours a bien été ajouté`, 'Fermer', { duration: 2000 }),
      },
      read: {
        service$: (pageIndex: number, pageSize: number, query?: string) =>
          this.professorHttpService.searchCourse(this.trainingId, pageIndex, pageSize, query),
      },
      update: {
        dialogComponent: AddCourseComponent,
        dialogData: (course: CourseResponseDto) => ({ course, trainingId: this.trainingId }),
        onSuccess: () =>
          this.snackBar.open(`Le cours a bien été modifié`, 'Fermer', { duration: 2000 }),
      },
      delete: {
        confirmConfiguration: (course: CourseResponseDto): MatDialogConfig<ConfirmData> => ({
          data: {
            title: 'Supprimer le cours',
            content: `Êtes-vous sûr de vouloir supprimer le cours "${course.name}" ?`,
            cancelLabel: 'Annuler',
            acceptLabel: 'Supprimer',
            acceptButtonColor: ConfirmButtonColor.WARN,
          },
        }),
        onSuccess: (course: CourseResponseDto) =>
          this.snackBar.open(`Le cours "${course.name}" a été supprimé`, 'Fermer', {
            duration: 2000,
          }),
        service$: (course: CourseResponseDto) => this.professorHttpService.deleteCourse(course.id),
      },
      reorder: {
        service$: (courses: CourseResponseDto[]) =>
          this.professorHttpService.reorderCourses({
            courses: courses.map((course, index) => ({
              id: course.id,
              order: index + 1,
            })),
          }),
        onSuccess: () =>
          this.snackBar.open(`Les cours ont bien été réordonnées`, 'Fermer', { duration: 2000 }),
      },
    };
  }
}
