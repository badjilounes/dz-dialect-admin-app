import { Component, Input, OnInit } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import {COMMA, ENTER} from  '@angular/cdk/keycodes' ;

export interface Word {
  name: string;
}

@Component({
  selector: 'app-chips-sentence',
  templateUrl: './chips-sentence.component.html',
  styleUrls: ['./chips-sentence.component.scss']
})
export class ChipsSentenceComponent implements OnInit {

  @Input() label: string = '';

  constructor() { }

  ngOnInit(): void {
  }
  
  addOnBlur = true ;
  readonly separatorKeysCodes = [ENTER, COMMA] as  const ;
  words : Word[] = [];

  add(event: MatChipInputEvent): void {
     const value = (event.value || '' ).trim();


    if (value) {
       this .words.push({ name : value});
    }


    event.chipInput!.clear();
  }

  remove(word : Word): void {
     const index = this .words.indexOf(word);

    if (index >= 0 ) {
       this .words.splice(index, 1 );
    }
  }
}
