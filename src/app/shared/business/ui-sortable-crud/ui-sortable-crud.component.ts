import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ComponentType } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Input,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { LetModule } from '@ngrx/component';
import {
  BehaviorSubject,
  Observable,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  merge,
  of,
  shareReplay,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { ConfirmDialogModule } from '../../design-system/confirm-dialog/confirm-dialog.module';
import {
  ConfirmData,
  ConfirmDialogService,
} from '../../design-system/confirm-dialog/confirm-dialog.service';
import { SearchInputComponent } from '../../design-system/search-input/search-input.component';
import { filterUndefined } from '../../technical/operators/filter-undefined.operator';

type PaginatedResponse<T> = {
  elements: T[];
  pageIndex: number;
  pageSize: number;
  length: number;
};

export type UiSortableCrudConfiguration<T> = {
  title: string;

  emptyState: {
    withSearch(search: string): string;
  };

  search?: {
    label: string;
    placeholder: string;
  };

  create?: {
    buttonLabel: string;
    dialogComponent: ComponentType<any>;
    dialogData: () => any;
    onSuccess: () => void;
  };

  read: {
    service$: (
      pageIndex: number,
      pageSize: number,
      query?: string,
    ) => Observable<PaginatedResponse<T>>;
  };

  update?: {
    dialogComponent: ComponentType<any>;
    dialogData: (item: T) => any;
    onSuccess: (item: T) => void;
  };

  delete?: {
    confirmConfiguration: (item: T) => MatDialogConfig<ConfirmData>;
    onSuccess: (item: T) => void;
    service$: (item: T) => Observable<void>;
  };

  reorder?: {
    service$: (itemList: T[]) => Observable<void>;
    onSuccess: () => void;
  };
};

@UntilDestroy()
@Component({
  selector: 'app-ui-sortable-crud',
  templateUrl: './ui-sortable-crud.component.html',
  styleUrls: ['./ui-sortable-crud.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    LetModule,
    DragDropModule,
    MatButtonModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatIconModule,
    MatDialogModule,
    SearchInputComponent,
    ConfirmDialogModule,
  ],
})
export class UiSortableCrudComponent<T> implements OnChanges, AfterViewInit {
  @Input() configuration!: UiSortableCrudConfiguration<T>;

  itemList: T[] = [];
  pageIndex = 0;
  pageSize = 10;
  length = 0;

  query$: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);
  isLoadingResults$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map((result) => result.matches),
    shareReplay(),
  );

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ContentChild('itemTemplate') itemTemplate!: TemplateRef<T>;

  constructor(
    private readonly breakpointObserver: BreakpointObserver,
    private readonly confirm: ConfirmDialogService,
    private readonly dialog: MatDialog,
    private readonly paginatorIntl: MatPaginatorIntl,
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

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['configuration'].firstChange) {
      this.registerLoadDataTriggers();
    }
  }

  ngAfterViewInit(): void {
    this.registerLoadDataTriggers();
  }

  onCreate(): void {
    if (!this.configuration.create) {
      return;
    }

    const create = this.configuration.create;

    this.openDialog(
      undefined,
      create.dialogComponent,
      create.dialogData,
      create.onSuccess,
      this.loadData.bind(this),
    );
  }

  onUpdate(item: T): void {
    if (!this.configuration.update) {
      return;
    }

    const update = this.configuration.update;

    this.openDialog(
      item,
      update.dialogComponent,
      update.dialogData.bind(this, item),
      update.onSuccess.bind(this, item),
      this.loadData.bind(this),
    );
  }

  onDelete(item: T): void {
    if (!this.configuration.delete) {
      return;
    }

    const deleteConfiguration = this.configuration.delete;

    this.confirm
      .confirm(deleteConfiguration.confirmConfiguration(item))
      .pipe(
        filter((result) => !!result),
        switchMap(() => deleteConfiguration.service$(item)),
        tap(deleteConfiguration.onSuccess.bind(this, item)),
        tap(this.loadData.bind(this)),
        untilDestroyed(this),
      )
      .subscribe();
  }

  onReorder(event: CdkDragDrop<string[]>): void {
    if (!this.configuration.reorder) {
      return;
    }

    const { reorder } = this.configuration;

    moveItemInArray(this.itemList, event.previousIndex, event.currentIndex);

    of()
      .pipe(
        startWith(null),
        tap(() => this.isLoadingResults$.next(true)),
        switchMap(() => reorder.service$(this.itemList)),
        tap(() => this.isLoadingResults$.next(false)),
        tap(reorder.onSuccess),
        untilDestroyed(this),
      )
      .subscribe();
  }

  onSearch(query: string): void {
    this.query$.next(query);
  }

  private openDialog(
    item: T | undefined,
    dialogComponent: ComponentType<T>,
    dialogData: (item: T | undefined) => any,
    onSuccess: (item: T | undefined) => void,
    loadData: () => void,
  ): void {
    const isHandset: boolean = this.breakpointObserver.isMatched(Breakpoints.Handset);

    const dialogRef = this.dialog.open(dialogComponent, {
      data: dialogData(item),
      width: '100%',
      maxWidth: isHandset ? '100%' : '65vw',
      maxHeight: isHandset ? '100%' : '85vh',
      panelClass: isHandset ? 'mobile-full-screen-dialog' : '',
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((result) => !!result),
        tap(() => onSuccess(item)),
        tap(loadData),
        untilDestroyed(this),
      )
      .subscribe();
  }

  private registerLoadDataTriggers(): void {
    const debouncedQuery$ = this.query$.pipe(
      filterUndefined(),
      debounceTime(250),
      distinctUntilChanged(),
    );

    merge(this.paginator.page, debouncedQuery$)
      .pipe(startWith({}), tap(this.loadData.bind(this)), untilDestroyed(this))
      .subscribe();
  }

  private loadData(): void {
    this.isLoadingResults$.next(true);

    this.configuration.read
      .service$(this.paginator.pageIndex, this.paginator.pageSize, this.query$.value)
      .pipe(
        tap((data) => {
          this.itemList = data.elements;
          this.pageIndex = data.pageIndex;
          this.pageSize = data.pageSize;
          this.length = data.length;
        }),
        tap(() => this.isLoadingResults$.next(false)),
        untilDestroyed(this),
      )
      .subscribe();
  }
}
