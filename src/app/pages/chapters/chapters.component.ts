import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  of,
  shareReplay,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { AddChapterComponent } from 'src/app/pages/chapters/add-chapter/add-chapter.component';
import { ConfirmDialogModule } from 'src/app/shared/confirm-dialog/confirm-dialog.module';
import {
  ConfirmButtonColor,
  ConfirmDialogService,
} from 'src/app/shared/confirm-dialog/confirm-dialog.service';
import {
  ChapterResponseDto,
  ProfessorHttpService,
  ReorderChaptersDto,
} from 'src/clients/dz-dialect-training-api';

@UntilDestroy()
@Component({
  selector: 'app-chapters',
  templateUrl: './chapters.component.html',
  styleUrls: ['./chapters.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ConfirmDialogModule,
    DragDropModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatChipsModule,
  ],
})
export class ChaptersComponent implements AfterViewInit {
  data: ChapterResponseDto[] = [];
  query$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  isLoadingResults = true;
  isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map((result) => result.matches),
    shareReplay(),
  );

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private readonly dialog: MatDialog,
    private readonly breakpointObserver: BreakpointObserver,
    private readonly professorHttpService: ProfessorHttpService,
    private readonly title: Title,
    private readonly confirm: ConfirmDialogService,
    private readonly snackBar: MatSnackBar,
  ) {
    this.title.setTitle('Chapîtres');
  }

  ngAfterViewInit(): void {
    const debouncedQuery$ = this.query$.pipe(
      distinctUntilChanged(),
      debounceTime(250),
      untilDestroyed(this),
    );

    debouncedQuery$
      .pipe(
        startWith(''),
        tap((query) => this.loadData(query)),
        untilDestroyed(this),
      )
      .subscribe();
  }

  applyFilter(query: string) {
    this.query$.next(query);
  }

  addOrEditChapter(data?: ChapterResponseDto) {
    const isHandset: boolean = this.breakpointObserver.isMatched(Breakpoints.Handset);

    const dialogRef = this.dialog.open(AddChapterComponent, {
      data,
      width: '100%',
      maxWidth: isHandset ? '100%' : '65vw',
      maxHeight: isHandset ? '100%' : '85vh',
      panelClass: 'add-chapter-dialog',
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((result) => !!result),
        tap(({ updated }) =>
          this.snackBar.open(
            `Le chapître a bien été ${updated ? 'modifiée' : 'ajoutée'}`,
            'Fermer',
            {
              duration: 2000,
            },
          ),
        ),
        tap(() => this.loadData(this.query$.value)),
        untilDestroyed(this),
      )
      .subscribe();
  }

  deleteChapter(chapter: ChapterResponseDto) {
    this.confirm
      .confirm({
        data: {
          title: 'Supprimer la phrase',
          content: `Êtes-vous sûr de vouloir supprimer le chapître "${chapter.name}" ?`,
          cancelLabel: 'Annuler',
          acceptLabel: 'Supprimer',
          acceptButtonColor: ConfirmButtonColor.WARN,
        },
      })
      .pipe(
        filter((result) => !!result),
        switchMap(() => this.professorHttpService.deleteChapterId(chapter.id)),
        tap(() => this.loadData(this.query$.value)),
        tap(() =>
          this.snackBar.open(`Le chapître "${chapter.name}" a été supprimée`, 'Fermer', {
            duration: 2000,
          }),
        ),
        untilDestroyed(this),
      )
      .subscribe();
  }

  onReorder(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.data, event.previousIndex, event.currentIndex);

    const chapters: ReorderChaptersDto = {
      chapters: this.data.map((chapter, index) => ({
        id: chapter.id,
        order: index + 1,
      })),
    };

    of()
      .pipe(
        startWith(null),
        tap(() => (this.isLoadingResults = true)),
        switchMap(() => this.professorHttpService.reorderChapters(chapters)),
        tap(() => (this.isLoadingResults = false)),
        tap(() =>
          this.snackBar.open(`Les chapîtres ont bien été réordonnés`, 'Fermer', {
            duration: 2000,
          }),
        ),
        untilDestroyed(this),
      )
      .subscribe();
  }

  private loadData(query: string): void {
    this.isLoadingResults = true;
    this.professorHttpService
      .searchChapter(0, 200, query)
      .pipe(
        map((data) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;

          if (data === null) {
            this.data = [];
          }

          this.data = data.elements;
        }),
        catchError(() => of(null)),
        untilDestroyed(this),
      )
      .subscribe();
  }
}
