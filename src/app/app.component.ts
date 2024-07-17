import { CommonModule } from '@angular/common';
import { Component, HostBinding, HostListener, OnInit } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import * as AOS from 'aos';
import { GameComponent } from './components/game/game.component';
import { CanvasService } from './components/game/services/canvas-service';
import { CursorService } from './components/game/services/cursor.service';
import { GameService } from './components/game/services/game-service';
import { TextService } from './components/game/services/text-service';
import { NavComponent } from './components/nav/nav.component';
import { ThemeSelectorService } from './components/theme-selector/theme-selector-service';
import { ThemeSelectorComponent } from './components/theme-selector/theme-selector.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [
    CommonModule,
    RouterOutlet,
    GameComponent,
    NavComponent,
    MatIconModule,
    MatSidenavModule,
    ThemeSelectorComponent,
  ],
  providers: [CanvasService, CursorService, GameService, TextService, ThemeSelectorService],
})
export class AppComponent implements OnInit {
  @HostBinding('class') hostClasses = '!size-full';

  currentRoute: string;
  svgIcons = ['corn'];

  constructor(
    private router: Router,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
  ) {
    this.currentRoute = this.router.url;
    this.registerIcons();
    this.animateOnScroll();
  }

  @HostListener('window:popstate', ['$event'])
  onPopState() {
    location.reload();
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
        window.scrollTo(0, 0);
      }
    });
  }

  private registerIcons() {
    this.svgIcons.forEach((icon) => {
      this.matIconRegistry.addSvgIcon(icon, this.domSanitizer.bypassSecurityTrustResourceUrl(`/${icon}.svg`));
    });
  }

  private animateOnScroll() {
    document.onreadystatechange = () => {
      if (document.readyState === 'complete') {
        AOS.init({ duration: 2000 });
      }
    };
  }
}
