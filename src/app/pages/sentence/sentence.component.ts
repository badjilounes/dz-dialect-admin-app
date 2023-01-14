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
import { ConfirmDialogModule } from 'src/app/shared/confirm-dialog/confirm-dialog.module';
import {
  ConfirmButtonColor,
  ConfirmDialogService,
} from 'src/app/shared/confirm-dialog/confirm-dialog.service';
import { SentenceHttpService, SentenceResponseDto } from 'src/clients/dz-dialect-api';
import { AddSentenceComponent } from './add-sentence/add-sentence.component';

@UntilDestroy()
@Component({
  selector: 'app-sentence',
  templateUrl: './sentence.component.html',
  styleUrls: ['./sentence.component.scss'],
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
export class SentenceComponent implements AfterViewInit {
  displayedColumns: string[] = ['fr', 'dz', 'dz_ar', 'actions'];
  data: SentenceResponseDto[] = [];

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
    private readonly sentenceHttpService: SentenceHttpService,
    private readonly title: Title,
    private readonly confirm: ConfirmDialogService,
    private readonly snackBar: MatSnackBar,
  ) {
    this.title.setTitle('Phrases');
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
          return this.sentenceHttpService
            .searchSentence(this.paginator.pageIndex, this.paginator.pageSize, this.query$.value)
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

  addSentence() {
    const isHandset: boolean = this.breakpointObserver.isMatched(Breakpoints.Handset);

    const dialogRef = this.dialog.open(AddSentenceComponent, {
      width: '100%',
      maxWidth: isHandset ? '100%' : '65vw',
      maxHeight: isHandset ? '100vh' : '85vh',
      panelClass: 'add-sentence-dialog',
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((result) => !!result),
        tap(() => this.snackBar.open('La phrase a bien été ajoutée', 'Fermer', { duration: 2000 })),
        tap(() => this.paginator.firstPage()),
        untilDestroyed(this),
      )
      .subscribe();
  }

  editSentence(data: SentenceResponseDto) {
    const isHandset: boolean = this.breakpointObserver.isMatched(Breakpoints.Handset);

    this.dialog.open(AddSentenceComponent, {
      data,
      width: '100%',
      maxWidth: isHandset ? '100%' : '65vw',
      maxHeight: isHandset ? '100vh' : '85vh',
    });
  }

  deleteSentence(sentence: SentenceResponseDto) {
    this.confirm
      .confirm({
        data: {
          title: 'Supprimer la phrase',
          content: `Êtes-vous sûr de vouloir supprimer la phrase "${sentence.fr}" ?`,
          cancelLabel: 'Annuler',
          acceptLabel: 'Supprimer',
          acceptButtonColor: ConfirmButtonColor.WARN,
        },
      })
      .pipe(
        filter((result) => !!result),
        switchMap(() => this.sentenceHttpService.deleteSentence(sentence.id)),
        tap(() => this.paginator.page.emit()),
        tap(() =>
          this.snackBar.open(`La phrase "${sentence.fr}" a été supprimée`, 'Fermer', {
            duration: 2000,
          }),
        ),
        untilDestroyed(this),
      )
      .subscribe();
  }
}
