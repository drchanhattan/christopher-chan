import { Component, HostBinding } from '@angular/core';
import { GameService } from '../../services/game-service';
import { GameButtonComponent } from '../game-button/game-button.component';
import { LeaderboardService } from './leaderboard-service';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [GameButtonComponent],
  templateUrl: './leaderboard.component.html',
})
export class LeaderboardComponent {
  @HostBinding('class') hostClasses = 'absolute flex size-full flex-col items-center justify-center font-ink';

  constructor(
    public gameService: GameService,
    public leaderboardService: LeaderboardService,
  ) {}
}