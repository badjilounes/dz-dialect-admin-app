import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { tap } from 'rxjs';
import {
  ChapterResponseDto,
  CreateChapterDto,
  ProfessorHttpService,
} from 'src/clients/dz-dialect-training-api';

@UntilDestroy()
@Component({
  selector: 'app-add-chapter',
  templateUrl: './add-chapter.component.html',
  styleUrls: ['./add-chapter.component.scss'],
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
export class AddChapterComponent {
  chapterForm: FormGroup = new FormGroup({
    name: new FormControl(this.data?.name, [Validators.required]),
    description: new FormControl(this.data?.description ?? ''),
    isPresentation: new FormControl(this.data?.isPresentation ?? false),
  });

  constructor(
    private readonly professorHttpService: ProfessorHttpService,
    private readonly dialogRef: MatDialogRef<AddChapterComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: ChapterResponseDto,
  ) {}

  addOrEditChapter() {
    if (!this.chapterForm.valid) {
      return;
    }

    if (this.data) {
      this.editChapter();
    } else {
      this.addChapter();
    }
  }

  private addChapter() {
    const payload: CreateChapterDto = {
      name: this.chapterForm.value.name,
      description: this.chapterForm.value.description,
      isPresentation: this.chapterForm.value.isPresentation,
    };

    this.professorHttpService
      .createTrainingChapter(payload)
      .pipe(
        tap(() => this.dialogRef.close({ updated: false })),
        untilDestroyed(this),
      )
      .subscribe();
  }

  private editChapter() {
    if (!this.data) {
      return;
    }

    const payload: CreateChapterDto = {
      name: this.chapterForm.value.name,
      description: this.chapterForm.value.description,
      isPresentation: this.chapterForm.value.isPresentation,
    };

    this.professorHttpService
      .editChapterId(this.data.id, payload)
      .pipe(
        tap(() => this.dialogRef.close({ updated: true })),
        untilDestroyed(this),
      )
      .subscribe();
  }
}
