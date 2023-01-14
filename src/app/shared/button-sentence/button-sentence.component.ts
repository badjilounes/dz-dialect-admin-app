import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

type ButtonOption = {
  value: string;
  label: string;
};

@Component({
  selector: 'app-button-sentence',
  templateUrl: './button-sentence.component.html',
  styleUrls: ['./button-sentence.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonToggleModule],
})
export class ButtonSentenceComponent implements OnInit {
  @Input() label: string = '';
  @Input() parentForm: FormGroup = new FormGroup([]);
  @Input() controlName: string = '';
  @Input() options: ButtonOption[] = [];
  @Input() required = false;

  formControl = new FormControl();

  constructor() {}

  ngOnInit(): void {
    if (this.options.length > 0) {
      this.formControl.setValue(this.options[0].value);
    }

    if (this.required) {
      this.formControl.setValidators(Validators.required);
    }

    this.parentForm.addControl(this.controlName, this.formControl);
  }
}
