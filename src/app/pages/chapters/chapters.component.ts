import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  merge,
  of,
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
import { ChapterResponseDto, ProfessorHttpService } from 'src/clients/dz-dialect-training-api';

@UntilDestroy()
@Component({
  selector: 'app-chapters',
  templateUrl: './chapters.component.html',
  styleUrls: ['./chapters.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ConfirmDialogModule,
  ],
})
export class ChaptersComponent implements AfterViewInit {
  displayedColumns: string[] = ['name', 'description', 'isPresentation', 'actions'];
  data: ChapterResponseDto[] = [];

  query$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  pageIndex = 0;
  pageSize = 10;
  length = 0;
  isLoadingResults = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private readonly dialog: MatDialog,
    private readonly breakpointObserver: BreakpointObserver,
    private readonly paginatorIntl: MatPaginatorIntl,
    private readonly professorHttpService: ProfessorHttpService,
    private readonly title: Title,
    private readonly confirm: ConfirmDialogService,
    private readonly snackBar: MatSnackBar,
  ) {
    this.title.setTitle('Chapîtres');
    this.paginatorIntl.itemsPerPageLabel = 'Éléments par page';
    this.paginatorIntl.nextPageLabel = 'Page suivante';
    this.paginatorIntl.previousPageLabel = 'Page précédente';
    this.paginatorIntl.firstPageLabel = 'Première page';
    this.paginatorIntl.lastPageLabel = 'Dernière page';
    this.paginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      if (length === 0 || pageSize === 0) {
        return `0 sur ${length}`;
      }

      length = Math.max(length, 0);

      const startIndex = page * pageSize;

      // If the start index exceeds the list length, do not try and fix the end index to the end.
      const endIndex =
        startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;

      return `${startIndex + 1} - ${endIndex} sur ${length}`;
    };
  }

  ngAfterViewInit(): void {
    const debouncedQuery$ = this.query$.pipe(
      distinctUntilChanged(),
      debounceTime(250),
      untilDestroyed(this),
    );

    merge(this.paginator.page, debouncedQuery$)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.professorHttpService
            .searchChapter(this.paginator.pageIndex, this.paginator.pageSize, this.query$.value)
            .pipe(catchError(() => of(null)));
        }),
        map((data) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;

          if (data === null) {
            return [];
          }

          // Only refresh the result length if there is new data. In case of rate
          // limit errors, we do not want to reset the paginator to zero, as that
          // would prevent users from re-triggering requests.
          this.length = data.length;
          this.pageIndex = data.pageIndex;
          this.pageSize = data.pageSize;

          return data.elements;
        }),
        untilDestroyed(this),
      )
      .subscribe((data) => (this.data = data));
  }

  applyFilter(query: string) {
    this.query$.next(query);
    this.paginator.pageIndex = 0;
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
        tap(() => this.paginator.page.emit()),
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
        tap(() => this.paginator.page.emit()),
        tap(() =>
          this.snackBar.open(`Le chapître "${chapter.name}" a été supprimée`, 'Fermer', {
            duration: 2000,
          }),
        ),
        untilDestroyed(this),
      )
      .subscribe();
  }
}
