import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { tap } from 'rxjs';
import {
  CourseResponseDto,
  CreateCourseDto,
  EditCourseDto,
  ProfessorHttpService,
} from '../../../../clients/dz-dialect-training-api';

@UntilDestroy()
@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    TextFieldModule,
    MatSlideToggleModule,
    MatInputModule,
  ],
})
export class AddCourseComponent {
  courseForm: FormGroup = new FormGroup({
    name: new FormControl(this.data.course?.name, [Validators.required]),
    description: new FormControl(this.data.course?.description ?? ''),
    trainingId: new FormControl(this.data.trainingId ?? '', [Validators.required]),
  });

  get isEditMode(): boolean {
    return !!this.data.course;
  }

  constructor(
    private readonly professorHttpService: ProfessorHttpService,
    private readonly dialogRef: MatDialogRef<AddCourseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { course?: CourseResponseDto; trainingId: string },
  ) {}

  addOrEditCourse() {
    if (!this.courseForm.valid) {
      return;
    }

    if (this.isEditMode) {
      this.editCourse();
    } else {
      this.addCourse();
    }
  }

  private addCourse() {
    const payload: CreateCourseDto = {
      name: this.courseForm.value.name,
      description: this.courseForm.value.description,
      trainingId: this.courseForm.value.trainingId,
    };

    this.professorHttpService
      .createTrainingCourse(payload)
      .pipe(
        tap(() => this.dialogRef.close({ updated: false })),
        untilDestroyed(this),
      )
      .subscribe();
  }

  private editCourse() {
    if (!this.data.course) {
      return;
    }

    const payload: EditCourseDto = {
      name: this.courseForm.value.name,
      description: this.courseForm.value.description,
      trainingId: this.courseForm.value.trainingId,
    };

    this.professorHttpService
      .editCourse(this.data.course.id, payload)
      .pipe(
        tap(() => this.dialogRef.close({ updated: true })),
        untilDestroyed(this),
      )
      .subscribe();
  }
}
