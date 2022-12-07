import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-text-sentence',
  templateUrl: './text-sentence.component.html',
  styleUrls: ['./text-sentence.component.scss']
})
export class TextSentenceComponent implements OnInit {

  @Input() name: string= '';
  @Input() label: string = '';
  @Input() formData: FormGroup = new FormGroup([]);

  formControl = new FormControl() ;



  constructor() { }

  ngOnInit(): void {
    this.formControl.valueChanges.subscribe((value) => console.log('valeur reçue', value));

    this.addGroupToParent();
  }


  private addGroupToParent(): void {
    this.formData.addControl(this.name, this.formControl);
  }
}
