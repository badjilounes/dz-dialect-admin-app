import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-text-sentence',
  templateUrl: './text-sentence.component.html',
  styleUrls: ['./text-sentence.component.scss']
})
export class TextSentenceComponent implements OnInit {

  @Input() label: string = '';


  constructor() { }

  ngOnInit(): void {
  }

}
