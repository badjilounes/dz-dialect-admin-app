import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddSentenceComponent } from './add-sentence/add-sentence.component';


@Component({
  selector: 'app-sentence',
  templateUrl: './sentence.component.html',
  styleUrls: ['./sentence.component.scss']
})
export class SentenceComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  addPost() {
    const dialogRef = this.dialog.open(AddSentenceComponent, {
      minWidth: '250px'
    });
  }

}
