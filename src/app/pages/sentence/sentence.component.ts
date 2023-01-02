import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddSentenceComponent } from './add-sentence/add-sentence.component';

@Component({
  selector: 'app-sentence',
  templateUrl: './sentence.component.html',
  styleUrls: ['./sentence.component.scss'],
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
})
export class SentenceComponent implements OnInit {
  constructor(public dialog: MatDialog, private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {}

  addPost() {
    const isHandset: boolean = this.breakpointObserver.isMatched(Breakpoints.Handset);

    this.dialog.open(AddSentenceComponent, {
      maxWidth: '500px',
      width: '100%',
      height: isHandset ? '100%' : undefined,
    });
  }
}
