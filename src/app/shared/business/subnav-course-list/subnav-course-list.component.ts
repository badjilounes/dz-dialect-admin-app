import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Observable, map, of } from 'rxjs';
import {
  CourseResponseDto,
  ProfessorHttpService,
} from '../../../../clients/dz-dialect-training-api';
import { SubnavComponent, SubnavItem } from '../../design-system/subnav/subnav.component';

@UntilDestroy()
@Component({
  selector: 'app-subnav-course-list',
  templateUrl: './subnav-course-list.component.html',
  styleUrls: ['./subnav-course-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, SubnavComponent],
})
export class SubnavCourseListComponent implements OnInit {
  @Input() trainingId!: string;

  courseList$: Observable<SubnavItem[]> = of([]);

  constructor(private readonly professorHttpService: ProfessorHttpService) {}

  ngOnInit(): void {
    this.courseList$ = this.professorHttpService.searchCourse(this.trainingId, 0, 200, '').pipe(
      map((data) =>
        data.elements.map((course: CourseResponseDto) => ({
          label: course.name,
          link: `/trainings/${this.trainingId}/courses/${course.id}/exams`,
        })),
      ),
    );
  }
}
