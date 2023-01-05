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
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
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
  ],
})
export class SentenceComponent implements AfterViewInit {
  displayedColumns: string[] = ['fr', 'dz', 'dz_ar', 'actions'];
  data: SentenceResponseDto[] = [];

  query = '';
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
  ) {
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
    this.paginator.page
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.sentenceHttpService
            .searchSentence(this.paginator.pageIndex, this.paginator.pageSize, this.query)
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

  applyFilter(event: Event) {
    this.query = (event.target as HTMLInputElement).value;
    if (this.paginator.pageIndex !== 0) {
      this.paginator.firstPage();
    } else {
      this.paginator.page.emit();
    }
  }

  addPost() {
    const isHandset: boolean = this.breakpointObserver.isMatched(Breakpoints.Handset);

    this.dialog.open(AddSentenceComponent, {
      maxWidth: '500px',
      width: '100%',
      height: isHandset ? '100%' : undefined,
    });
  }

  editSentence(data: SentenceResponseDto) {
    const isHandset: boolean = this.breakpointObserver.isMatched(Breakpoints.Handset);

    this.dialog.open(AddSentenceComponent, {
      data,
      maxWidth: '500px',
      width: '100%',
      height: isHandset ? '100%' : undefined,
    });
  }
}
