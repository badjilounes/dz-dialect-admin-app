import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CreateSentenceDto, SentenceHttpService, SentenceResponseDto } from 'src/app/core/clients/sentence-api';




@Component({
  selector: 'app-add-sentence',
  templateUrl: './add-sentence.component.html',
  styleUrls: ['./add-sentence.component.scss']
})
export class AddSentenceComponent implements OnInit {

  parentForm: FormGroup = new FormGroup([]);
  schemaOptions= [
    {value: 'p', label: 'P'},
    {value: 'pv', label: 'PV'},
    {value: 'number', label: 'Number'},
    {value: 'pva_temp', label: 'PVA_TEMP'},

  ]

  tensOptions= [
    {value: 'passé', label: 'Passé'},
    {value: 'présent', label: 'Présent'},
    {value: 'futur', label: 'Futur'},
  ]

  constructor(private readonly sentenceHttpService: SentenceHttpService, private readonly router: Router, private readonly dialogRef: MatDialogRef<AddSentenceComponent>, private fb: FormBuilder) {
    this.parentForm = this.fb.group({});
   }

  ngOnInit(): void {

  }

  getValue() {
    if (this.parentForm.valid) {
     // const user = JSON.parse(localStorage.getItem('user') || '{}')
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


     this.sentenceHttpService.createSentence(payload).subscribe(
        (newSentence: SentenceResponseDto) => {
          if (newSentence) {
            this.dialogRef.close({ refresh: true });
          }
        });
    }
  }

}
