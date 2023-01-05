import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-chapters',
  templateUrl: './chapters.component.html',
  styleUrls: ['./chapters.component.scss'],
  standalone: true,
  imports: [CommonModule, MatButtonModule],
})
export class ChaptersComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
