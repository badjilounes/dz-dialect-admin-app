import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { Observable, map, shareReplay } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
})
export class MenuComponent implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map((result) => result.matches),
    shareReplay(),
  );

  menuItems = [
    {
      link: '/users',
      icon: 'manage_accounts',
      label: 'Utilisateurs',
    },
    {
      link: '/sentences',
      icon: 'translate',
      label: 'Phrases',
    },
    {
      link: '/trainings',
      icon: 'school',
      label: 'Formations',
    },
  ];

  constructor(
    private readonly breakpointObserver: BreakpointObserver,
    public readonly title: Title,
    private readonly matIconRegistry: MatIconRegistry,
    private readonly domSanitizer: DomSanitizer,
  ) {
    const images = ['home'];

    images.forEach((image) => {
      this.matIconRegistry.addSvgIcon(
        image,
        this.domSanitizer.bypassSecurityTrustResourceUrl(`assets/svg/${image}.svg`),
      );
    });
  }

  ngOnInit(): void {}
}
