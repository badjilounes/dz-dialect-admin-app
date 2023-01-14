import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { tap } from 'rxjs';
import { ButtonSentenceComponent } from 'src/app/shared/button-sentence/button-sentence.component';
import { ChipsSentenceComponent } from 'src/app/shared/chips-sentence/chips-sentence.component';
import { TextSentenceComponent } from 'src/app/shared/text-sentence/text-sentence.component';
import {
  CreateSentenceDto,
  SentenceHttpService,
  SentenceResponseDto,
} from 'src/clients/dz-dialect-api';

@UntilDestroy()
@Component({
  selector: 'app-add-sentence',
  templateUrl: './add-sentence.component.html',
  styleUrls: ['./add-sentence.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    ChipsSentenceComponent,
    TextSentenceComponent,
    ButtonSentenceComponent,
  ],
})
export class AddSentenceComponent {
  parentForm: FormGroup = new FormGroup({});
  schemaOptions = [
    { value: 'p', label: 'P' },
    { value: 'pv', label: 'PV' },
    { value: 'number', label: 'Number' },
    { value: 'pva_temp', label: 'PVA_TEMP' },
  ];

  tensOptions = [
    { value: 'passé', label: 'Passé' },
    { value: 'présent', label: 'Présent' },
    { value: 'futur', label: 'Futur' },
  ];

  constructor(
    private readonly sentenceHttpService: SentenceHttpService,
    private readonly dialogRef: MatDialogRef<AddSentenceComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: SentenceResponseDto,
  ) {}

  addOrEditSentence() {
    if (!this.parentForm.valid) {
      return;
    }

    if (this.data) {
      this.editSentence();
    } else {
      this.addSentence();
    }
  }

  private addSentence() {
    const payload: CreateSentenceDto = {
      dz: this.parentForm.value.dz,
      dz_ar: this.parentForm.value.dz_ar,
      fr: this.parentForm.value.fr,
      adjectives: this.parentForm.value.adjectives,
      pronouns: this.parentForm.value.pronouns,
      schema: this.parentForm.value.schema,
      tense: this.parentForm.value.tense,
      verbs: this.parentForm.value.verbs,
      word_propositions_dz: this.parentForm.value.word_propositions_dz,
      word_propositions_fr: this.parentForm.value.word_propositions_fr,
    };

    this.sentenceHttpService
      .createSentence(payload)
      .pipe(
        tap(() => this.dialogRef.close({ updated: false })),
        untilDestroyed(this),
      )
      .subscribe();
  }

  private editSentence() {
    if (!this.data) {
      return;
    }

    const payload: CreateSentenceDto = {
      dz: this.parentForm.value.dz,
      dz_ar: this.parentForm.value.dz_ar,
      fr: this.parentForm.value.fr,
      adjectives: this.parentForm.value.adjectives,
      pronouns: this.parentForm.value.pronouns,
      schema: this.parentForm.value.schema,
      tense: this.parentForm.value.tense,
      verbs: this.parentForm.value.verbs,
      word_propositions_dz: this.parentForm.value.word_propositions_dz,
      word_propositions_fr: this.parentForm.value.word_propositions_fr,
    };

    this.sentenceHttpService
      .editSentence(this.data.id, payload)
      .pipe(
        tap(() => this.dialogRef.close({ updated: true })),
        untilDestroyed(this),
      )
      .subscribe();
  }
}
