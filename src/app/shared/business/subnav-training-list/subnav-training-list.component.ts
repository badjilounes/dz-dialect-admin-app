import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Observable, map, of } from 'rxjs';
import {
  ProfessorHttpService,
  TrainingResponseDto,
} from '../../../../clients/dz-dialect-training-api';
import { SubnavComponent, SubnavItem } from '../../design-system/subnav/subnav.component';

@UntilDestroy()
@Component({
  selector: 'app-subnav-training-list',
  templateUrl: './subnav-training-list.component.html',
  styleUrls: ['./subnav-training-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, SubnavComponent],
})
export class SubnavTrainingListComponent implements OnInit {
  trainingList$: Observable<SubnavItem[]> = of([]);

  constructor(private readonly professorHttpService: ProfessorHttpService) {}

  ngOnInit(): void {
    this.trainingList$ = this.professorHttpService.searchTraining(0, 200, '').pipe(
      map((data) =>
        data.elements.map((training: TrainingResponseDto) => ({
          label: training.name,
          link: `/trainings/${training.id}/courses`,
        })),
      ),
    );
  }
}
