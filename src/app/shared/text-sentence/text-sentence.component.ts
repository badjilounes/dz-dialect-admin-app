import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-text-sentence',
  templateUrl: './text-sentence.component.html',
  styleUrls: ['./text-sentence.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
})
export class TextSentenceComponent implements OnInit {
  @Input() name: string = '';
  @Input() label: string = '';
  @Input() formData: FormGroup = new FormGroup([]);
  @Input() required = false;

  formControl = new FormControl();

  constructor() {}

  ngOnInit(): void {
    if (this.required) {
      this.formControl.setValidators(Validators.required);
    }

    this.formData.addControl(this.name, this.formControl);
  }
}
