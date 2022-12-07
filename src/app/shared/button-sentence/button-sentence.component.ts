import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

type ButtonOption = {
  value: string;
  label: string;
}

@Component({
  selector: 'app-button-sentence',
  templateUrl: './button-sentence.component.html',
  styleUrls: ['./button-sentence.component.scss']
})
export class ButtonSentenceComponent implements OnInit {

  @Input() label: string = '';
  @Input() parentForm: FormGroup = new FormGroup([]);
  @Input() controlName: string= '';
  @Input() options: ButtonOption[] = [];

  formControl = new FormControl() ;



  constructor() { }

  ngOnInit(): void {
    this.formControl.valueChanges.subscribe((value) => console.log('valeur reçue', value));

    this.addGroupToParent();
  }


  private addGroupToParent(): void {
    this.parentForm.addControl(this.controlName, this.formControl);
  }
}
