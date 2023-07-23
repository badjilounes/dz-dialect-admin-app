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
  CreateTrainingDto,
  EditTrainingDto,
  ProfessorHttpService,
  TrainingResponseDto,
} from '../../../../clients/dz-dialect-training-api';

@UntilDestroy()
@Component({
  selector: 'app-add-training',
  templateUrl: './add-training.component.html',
  styleUrls: ['./add-training.component.scss'],
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
export class AddTrainingComponent {
  trainingForm: FormGroup = new FormGroup({
    name: new FormControl(this.data?.name, [Validators.required]),
    description: new FormControl(this.data?.description ?? ''),
    isPresentation: new FormControl(this.data?.isPresentation ?? false),
  });

  constructor(
    private readonly professorHttpService: ProfessorHttpService,
    private readonly dialogRef: MatDialogRef<AddTrainingComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: TrainingResponseDto,
  ) {}

  addOrEditTraining() {
    if (!this.trainingForm.valid) {
      return;
    }

    if (this.data) {
      this.editTraining();
    } else {
      this.addTraining();
    }
  }

  private addTraining() {
    const payload: CreateTrainingDto = {
      name: this.trainingForm.value.name,
      description: this.trainingForm.value.description,
      isPresentation: this.trainingForm.value.isPresentation,
    };

    this.professorHttpService
      .createTraining(payload)
      .pipe(
        tap(() => this.dialogRef.close({ updated: false })),
        untilDestroyed(this),
      )
      .subscribe();
  }

  private editTraining() {
    if (!this.data) {
      return;
    }

    const payload: EditTrainingDto = {
      name: this.trainingForm.value.name,
      description: this.trainingForm.value.description,
      isPresentation: this.trainingForm.value.isPresentation,
    };

    this.professorHttpService
      .editTraining(this.data.id, payload)
      .pipe(
        tap(() => this.dialogRef.close({ updated: true })),
        untilDestroyed(this),
      )
      .subscribe();
  }
}
