import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-icon-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule],
  templateUrl: './icon-button.component.html',
})
export class IconButtonComponent {
  @Input() matIcon!: string;
  @Input() svgIcon!: string;
  @Input() disabled: boolean = false;
  @Input() color: string = '';
  @Input() tooltip: string = '';
  @Input() scale: string = 'scale-125';
  @Input() hoverScale: string = '';
}
