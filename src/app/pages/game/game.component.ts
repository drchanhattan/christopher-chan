import { CommonModule } from '@angular/common';
import { Component, HostBinding, HostListener } from '@angular/core';
import { AvoidTheCobComponent } from '../../components/avoid-the-cob/avoid-the-cob.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [AvoidTheCobComponent, CommonModule],
  templateUrl: './game.component.html',
})
export class GameComponent {
  @HostBinding('class') hostClasses = 'flex size-full';

  @HostListener('window:resize') onResize() {
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (!isTouchDevice) {
      location.reload();
    }
  }
}
