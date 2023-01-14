import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ButtonSentenceComponent } from 'src/app/shared/button-sentence/button-sentence.component';
import { ChipsSentenceComponent } from 'src/app/shared/chips-sentence/chips-sentence.component';
import { TextSentenceComponent } from 'src/app/shared/text-sentence/text-sentence.component';
import {
  CreateSentenceDto,
  SentenceHttpService,
  SentenceResponseDto,
} from 'src/clients/dz-dialect-api';

@Component({
  selector: 'app-add-sentence',
  templateUrl: './add-sentence.component.html',
  styleUrls: ['./add-sentence.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    ChipsSentenceComponent,
    TextSentenceComponent,
    ButtonSentenceComponent,
  ],
})
export class AddSentenceComponent implements OnInit {
  parentForm: FormGroup = new FormGroup([]);
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
    private fb: FormBuilder,
  ) {
    this.parentForm = this.fb.group({});
  }

  ngOnInit(): void {}

  addSentence() {
    if (this.parentForm.valid) {
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
        .subscribe((newSentence: SentenceResponseDto) => {
          if (newSentence) {
            this.dialogRef.close({ refresh: true });
          }
        });
    }
  }
}
