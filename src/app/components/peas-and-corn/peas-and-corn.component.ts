import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  ViewChild,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Canvas } from './game/canvas';
import { Corn } from './game/corn';
import { Cursor } from './game/cursor';
import { GameObject } from './game/game-object';
import { GameObjectBehaviour } from './game/game-object-behaviour';
import { Peas } from './game/peas';

@Component({
  selector: 'app-peas-and-corn',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './peas-and-corn.component.html',
})
export class PeasAndCornComponent implements AfterViewInit {
  @HostBinding('class') hostClasses = 'fixed w-full h-full flex justify-center items-center bg-black';

  @ViewChild('canvas', { static: true })
  canvasEle!: ElementRef<HTMLCanvasElement>;
  screenW: any;
  screenH: any;
  canvas = new Canvas();

  // General
  lives = 0;
  idle = true;
  paused = false;
  level!: number;

  // Modifiers
  ghost = true;
  invincible = false;

  // Game Objects
  peas = new Peas();
  corn = new Corn();

  // Particles
  particleCount = 25;
  particleSpd = 0.8;

  cursor = new Cursor();
  context!: CanvasRenderingContext2D;
  message = { text: '', subText: '' };

  constructor(private change: ChangeDetectorRef) {}

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.setupCanvas();
  }

  @HostListener('document:keyup', ['$event'])
  onKeyupHandler(event: KeyboardEvent) {
    if (event.key === '1') {
      this.#toggleInvincibility();
    }

    if (event.key === '2') {
      this.peas.objects.forEach((pea) => pea.toggleBehaviour(GameObjectBehaviour.Follow));
    }

    if (event.key === '3') {
      this.corn.objects.forEach((corn) => corn.toggleBehaviour(GameObjectBehaviour.Repel));
    }
  }

  ngAfterViewInit() {
    this.setupCanvas();
    this.cursor.track(this.context, this.canvas);
    this.animate();
  }

  setupCanvas() {
    const canvas = this.canvasEle.nativeElement;
    const devicePixelRatio = 1;
    this.screenW = 500;
    this.screenH = 500;
    canvas.width = this.screenW * devicePixelRatio;
    canvas.height = this.screenH * devicePixelRatio;
    this.context = canvas.getContext('2d')!;
    this.context.scale(devicePixelRatio, devicePixelRatio);
    this.canvas.w = this.screenW;
    this.canvas.h = this.screenH;
  }

  animate() {
    const animateFrame = () => {
      this.context.clearRect(0, 0, this.canvas.w, this.canvas.h);
      if (!this.idle) {
        this.cursor.draw(this.context);
      }
      this.#drawPeas();
      this.#drawCorn();
      this.#drawParticles();
      requestAnimationFrame(animateFrame);
    };
    animateFrame();
  }

  play(newGame: boolean) {
    newGame ? this.#resetDifficulty() : this.#increaseDifficulty();
    this.change.detectChanges();

    this.peas.createNewPeas(this.canvas.w, this.canvas.h);
    this.corn.createNewCorn(this.canvas.w, this.canvas.h);

    this.paused = false;
    this.#temporaryImmunity(1500);
  }

  #pause(duration: number) {
    this.paused = true;
    this.change.detectChanges();
    this.#showMessage(duration);
  }

  #LevelUp() {
    this.ghost = true;
    this.level = this.level + 1;
    this.message.text = 'Level ' + this.level;
    this.message.subText = this.level % 2 ? '' : '+ 1 life';
    this.#pause(1000);

    setTimeout(() => {
      this.play(false);
    }, 3000);
  }

  #gameOver() {
    this.idle = true;
    this.message.text = 'Game Over';
    this.message.subText = 'You reached level ' + this.level;
    this.#pause(3000);

    setTimeout(() => {
      this.#toggleMenu(false);
    }, 4000);
  }

  #resetDifficulty() {
    // Reset params back to default
    this.peas.count = 10;
    this.peas.size = 20;
    this.peas.speed = 0.8;

    this.corn.count = 20;
    this.corn.size = 25;
    this.corn.speed = 0.5;

    this.cursor.size = 10;

    this.lives = 3;
    this.level = 1;
    this.idle = false;
    this.message = { text: '', subText: '' };

    this.#toggleMenu(true);
  }

  #increaseDifficulty() {
    // Increase difficulty settings
    this.peas.count = 10;
    this.corn.count = this.corn.count * 1.1;
    this.peas.speed = this.peas.speed * 1.03;
    this.corn.speed = this.corn.speed * 1.01;

    this.peas.size = this.peas.size * 0.99;
    this.corn.size = this.corn.size * 0.99;
    this.cursor.size = this.cursor.size * 0.99;

    // Add additional life every 2 levels
    this.lives = this.level % 2 ? this.lives : this.lives + 1;
  }

  #drawParticles() {
    this.canvas.drawParticles(this.context);
    this.canvas.particleDecay();
  }

  #drawCorn() {
    for (let i = 0; i < this.corn.objects.length; i++) {
      const object = this.corn.objects[i];
      if (!object.destroyed) {
        // Draw a single Corn
        Canvas.drawObject(this.context, object);

        // Check for collision
        if (!this.paused) {
          this.canvas.wallCollision(object);
          this.#detectCornCollision(object);
        } else {
          // Apply Gravity if objects are not alive
          object.applyForce(false, 2.5);
        }

        // Repel
        if (object.behaviourEquals(GameObjectBehaviour.Repel)) {
          object.follow(this.cursor, 10, this.canvas, 2, true);
        }

        object.move();
      }
    }
  }

  #drawPeas() {
    for (let i = 0; i < this.peas.objects.length; i++) {
      const object = this.peas.objects[i];
      if (!object.destroyed) {
        // Draw a single Pea
        Canvas.drawObject(this.context, object);

        // Check for collision
        if (!this.paused) {
          this.canvas.wallCollision(object);
          this.#detectPeaCollision(object);
        } else {
          // Apply Gravity if objects are not alive
          object.applyForce(false, 2.5);
        }

        // Follow
        if (object.behaviourEquals(GameObjectBehaviour.Follow)) {
          object.follow(this.cursor, 30, this.canvas, 1);
        }

        object.move();
      }
    }
  }

  #detectPeaCollision(pea: GameObject) {
    if (pea.detectCollision(this.cursor)) {
      pea.destroyed = true;
      this.canvas.createParticles(pea, this.particleCount, this.particleSpd);
      this.peas.count = this.peas.count - 1;
      this.change.detectChanges();

      if (this.peas.count === 0) {
        this.#LevelUp();
      }
    }
  }

  #detectCornCollision(corn: GameObject) {
    if (!this.ghost && corn.detectCollision(this.cursor)) {
      corn.destroyed = true;
      this.canvas.createParticles(corn, this.particleCount, this.particleSpd);

      if (!this.invincible) {
        this.lives = this.lives - 1;
        this.change.detectChanges();
        this.#flash('bg-red-900', 500);
        this.#temporaryImmunity(500);
      }

      if (this.lives === 0) {
        this.#gameOver();
      }
    }
  }

  #flash(color: string, duration: number) {
    const canvasClass = this.canvasEle.nativeElement.classList;

    // Flash Colour
    canvasClass.toggle(color);

    // Remove Colour
    setTimeout(() => {
      canvasClass.toggle(color);
    }, duration);
  }

  #toggleInvincibility() {
    this.cursor.history = [];
    this.cursor.trail = !this.cursor.trail;
    this.invincible = !this.invincible;
  }

  #temporaryImmunity(duration: number) {
    this.ghost = true;

    setTimeout(() => {
      this.ghost = false;
    }, duration);
  }

  #showMessage(duration: number) {
    const messageClass = document.getElementsByClassName('message')[0].classList;

    // Show Message
    messageClass.toggle('opacity-0');
    // Hide Message
    setTimeout(() => {
      messageClass.toggle('opacity-0');
    }, duration);
  }

  #toggleMenu(hide: boolean) {
    const canvasClass = this.canvasEle.nativeElement.classList;
    const menu = document.getElementsByClassName('menu')[0].classList;

    if (hide) {
      canvasClass.toggle('cursor-none');
      menu.toggle('opacity-0');
      menu.toggle('pointer-events-none');
    } else {
      canvasClass.toggle('cursor-none');
      menu.toggle('opacity-0');
      menu.toggle('pointer-events-none');
    }
  }
}
