import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-chapters',
  templateUrl: './chapters.component.html',
  styleUrls: ['./chapters.component.scss'],
  standalone: true,
  imports: [CommonModule, MatButtonModule],
})
export class ChaptersComponent implements OnInit {
  constructor(private readonly title: Title) {
    this.title.setTitle('Chapîtres');
  }

  ngOnInit(): void {}
}
