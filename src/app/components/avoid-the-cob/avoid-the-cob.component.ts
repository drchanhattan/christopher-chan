import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, HostBinding, HostListener, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { GameSettingsComponent } from './components/game-settings/game-settings.component';
import { GameTextService } from './components/game-text/game-text-service';
import { GameTextComponent } from './components/game-text/game-text.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { MainMenuService } from './components/main-menu/main-menu-service';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { ModeSelectorComponent } from './components/mode-selector/mode-selector.component';
import { PlayerNameService } from './components/player-name/player-name-service';
import { PlayerNameComponent } from './components/player-name/player-name.component';
import { AudioService } from './services/audio-service';
import { AvoidTheCobService } from './services/avoid-the-cob-service';
import { CanvasService } from './services/canvas-service';
import { CheatService } from './services/cheat-service';
import { DeviceService } from './services/device-service';
import { DifficultyService } from './services/difficulty.service';
import { GameStateService } from './services/game-state-service';
import { OverlayService } from './services/overlay-service';
import { ParticleService } from './services/particle-service';
import { SvgLoaderService } from './services/svg-loader-service';

@Component({
  selector: 'app-avoid-the-cob',
  standalone: true,
  imports: [
    CommonModule,
    GameSettingsComponent,
    GameTextComponent,
    IconButtonComponent,
    LeaderboardComponent,
    MainMenuComponent,
    MatIconModule,
    ModeSelectorComponent,
    PlayerNameComponent,
    RouterLink,
  ],
  templateUrl: './avoid-the-cob.component.html',
  animations: [
    trigger('opacityAnimation', [
      transition(':enter', [style({ opacity: 0 }), animate('500ms', style({ opacity: 1 }))]),
      transition(':leave', [style({ opacity: 1 }), animate('500ms', style({ opacity: 0 }))]),
    ]),
  ],
})
export class AvoidTheCobComponent implements OnInit {
  @HostBinding('class') hostClasses =
    'flex size-full select-none items-center justify-center overflow-hidden bg-game-black bg-cover bg-center bg-blend-darken';
  @HostBinding('style') background = `background-image: url('background.svg');`;

  constructor(
    public audioService: AudioService,
    public avoidTheCob: AvoidTheCobService,
    public canvasService: CanvasService,
    public cheatService: CheatService,
    public deviceService: DeviceService,
    public difficultyService: DifficultyService,
    public gameStateService: GameStateService,
    public mainMenuService: MainMenuService,
    public nameService: PlayerNameService,
    public overlayService: OverlayService,
    public particleService: ParticleService,
    public svgLoader: SvgLoaderService,
    public textService: GameTextService,
  ) {}

  @HostListener('window:resize') onResize() {
    this.canvasService.setup();
    if (!this.deviceService.isTouchScreen) {
      this.gameStateService.browserResized = true;
    }
  }

  @HostListener('window:keydown.escape', ['$event']) onKeydownHandler() {
    location.reload();
  }

  ngOnInit() {
    this.displayMobileNotice().then(() => {
      this.canvasService.setup();
      this.mainMenuService.show();
      this.animate();
    });
  }

  animate() {
    const context = this.canvasService.context;
    const canvas = this.canvasService.canvasEle;

    const animateFrame = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      this.avoidTheCob.draw();
      requestAnimationFrame(animateFrame);
    };

    requestAnimationFrame(animateFrame);
  }

  private async displayMobileNotice() {
    const text = 'Avoid the Cob is best experienced on desktop';
    const subtext = 'Mobile Device Detected';
    return this.deviceService.isTouchScreen ? this.textService.show(subtext, text, 4000) : null;
  }
}
