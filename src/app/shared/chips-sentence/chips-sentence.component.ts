import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

export interface Word {
  name: string;
}

@Component({
  selector: 'app-chips-sentence',
  templateUrl: './chips-sentence.component.html',
  styleUrls: ['./chips-sentence.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatChipsModule, MatFormFieldModule, MatIconModule],
})
export class ChipsSentenceComponent implements OnInit {
  @Input() label: string = '';
  @Input() formChips: FormGroup = new FormGroup([]);
  @Input() nameChips: string = '';
  @Input() required = false;

  formArray = new FormArray<FormControl>([]);

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA, SPACE] as const;

  constructor() {}

  ngOnInit(): void {
    if (this.required) {
      this.formArray.setValidators(Validators.required);
    }

    this.formChips.addControl(this.nameChips, this.formArray);
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.formArray.push(new FormControl(value));
    }

    event.chipInput!.clear();
  }

  remove(word: string): void {
    const index = this.formArray.value.indexOf(word);

    if (index >= 0) {
      this.formArray.removeAt(index);
    }
  }
}
