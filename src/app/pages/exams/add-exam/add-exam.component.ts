import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateModule } from '@ngx-translate/core';
import { tap } from 'rxjs';
import {
  CreateExamDto,
  CreateExamResponseQuestionDto,
  EditExamDto,
  ExamResponseDto,
  ProfessorHttpService,
} from '../../../../clients/dz-dialect-training-api';
import { ChipsSentenceComponent } from '../../../shared/design-system/chips-sentence/chips-sentence.component';

@UntilDestroy()
@Component({
  selector: 'app-add-exam',
  templateUrl: './add-exam.component.html',
  styleUrls: ['./add-exam.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    TextFieldModule,
    MatSlideToggleModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatButtonToggleModule,
    ChipsSentenceComponent,
  ],
})
export class AddExamComponent {
  questionTypeOptions = Object.keys(CreateExamResponseQuestionDto.TypeEnum);

  examForm: FormGroup = new FormGroup({
    name: new FormControl(this.data.exam?.name, [Validators.required]),
    courseId: new FormControl(this.data.courseId ?? '', [Validators.required]),
    questions: new FormArray(this.buildQuestionsFormArray(this.data.exam?.questions ?? [])),
  });

  get isEditMode(): boolean {
    return !!this.data.exam;
  }

  get questionArray(): FormArray<FormGroup> {
    return this.examForm.get('questions') as FormArray<FormGroup>;
  }

  constructor(
    private readonly professorHttpService: ProfessorHttpService,
    private readonly dialogRef: MatDialogRef<AddExamComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { exam?: ExamResponseDto; courseId: string },
  ) {}

  addQuestion(): void {
    (this.examForm.get('questions') as FormArray).push(
      new FormGroup({
        id: new FormControl(undefined),
        type: new FormControl(CreateExamResponseQuestionDto.TypeEnum.WORD_LIST, [
          Validators.required,
        ]),
        question: new FormControl('', [Validators.required]),
      }),
    );
  }

  addAfterQuestion(index: number): void {
    (this.examForm.get('questions') as FormArray).insert(
      index + 1,
      new FormGroup({
        id: new FormControl(undefined),
        type: new FormControl(CreateExamResponseQuestionDto.TypeEnum.WORD_LIST, [
          Validators.required,
        ]),
        question: new FormControl('', [Validators.required]),
      }),
    );
  }

  removeQuestion(index: number): void {
    (this.examForm.get('questions') as FormArray).removeAt(index);
  }

  addOrEditExam() {
    if (!this.examForm.valid) {
      return;
    }

    if (this.isEditMode) {
      this.editExam();
    } else {
      this.addCourse();
    }
  }

  private addCourse() {
    const payload: CreateExamDto = {
      name: this.examForm.value.name,
      courseId: this.examForm.value.courseId,
      questions: this.examForm.value.questions,
    };

    this.professorHttpService
      .createCourseExam(payload)
      .pipe(
        tap(() => this.dialogRef.close({ updated: false })),
        untilDestroyed(this),
      )
      .subscribe();
  }

  private editExam() {
    if (!this.data.exam) {
      return;
    }

    const payload: EditExamDto = {
      name: this.examForm.value.name,
      courseId: this.examForm.value.courseId,
      questions: this.examForm.value.questions,
    };

    this.professorHttpService
      .editExam(this.data.exam.id, payload)
      .pipe(
        tap(() => this.dialogRef.close({ updated: true })),
        untilDestroyed(this),
      )
      .subscribe();
  }

  private buildQuestionsFormArray(questions: CreateExamResponseQuestionDto[]): FormGroup[] {
    return questions.map((question) => {
      return new FormGroup({
        id: new FormControl(question.id),
        type: new FormControl(question.type, [Validators.required]),
        question: new FormControl(question.question, [Validators.required]),
        propositions: new FormArray(question.propositions.map((p) => new FormControl(p)) ?? [], [
          Validators.required,
        ]),
        answer: new FormArray(question.answer.map((v) => new FormControl(v)) ?? [], [
          Validators.required,
        ]),
      });
    });
  }
}
