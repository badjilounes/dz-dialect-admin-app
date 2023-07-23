import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  host: {
    class: 'app-search-input',
  },
})
export class SearchInputComponent {
  @Input() placeholder = 'Rechercher';
  @Input() label = 'Rechercher';

  @Output() search: EventEmitter<string> = new EventEmitter<string>();

  emitSearch(value: string): void {
    this.search.emit(value);
  }
}
