import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgZone, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavContainer, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { LetModule } from '@ngrx/component';
import { Observable, map, shareReplay } from 'rxjs';

export type SubnavItem = { label: string; link: string };

@Component({
  selector: 'app-subnav',
  templateUrl: './subnav.component.html',
  styleUrls: ['./subnav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LetModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
  ],
})
export class SubnavComponent {
  @Input() title = '';
  @Input() itemList: SubnavItem[] = [];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map((result) => result.matches),
    shareReplay(),
  );

  expanded = true;
  width = 250;

  @ViewChild(MatSidenavContainer) container!: MatSidenavContainer;

  constructor(
    private readonly breakpointObserver: BreakpointObserver,
    private readonly zone: NgZone,
  ) {}

  toggleSidenav(): void {
    this.expanded = !this.expanded;
    this.width = this.expanded ? 250 : 64;

    this.zone.runOutsideAngular(() => setTimeout(() => this.container.updateContentMargins(), 250));
  }
}
