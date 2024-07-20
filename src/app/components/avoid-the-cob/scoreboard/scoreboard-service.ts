import { Injectable } from '@angular/core';
import { FirebaseService, Score } from './firebase.service';

@Injectable({
  providedIn: 'root',
})
export class ScoreboardService {
  scores: Score[] = [];

  constructor(private firebaseService: FirebaseService) {}

  hide() {
    const menuClassList = document.getElementsByTagName('app-scoreboard')[0].classList;
    menuClassList.add('opacity-0');
    menuClassList.add('pointer-events-none');
  }

  async show() {
    const menuClassList = document.getElementsByTagName('app-scoreboard')[0].classList;
    menuClassList.remove('opacity-0');
    menuClassList.remove('pointer-events-none');
    this.scores = await this.firebaseService.getAllScores();
  }
}