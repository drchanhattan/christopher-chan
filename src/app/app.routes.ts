import { Routes } from '@angular/router';
import { AsiaComponent } from './pages/asia/asia.component';
import { EuropeComponent } from './pages/europe/europe.component';
import { GameComponent } from './pages/game/game.component';
import { HomeComponent } from './pages/home/home.component';
import { NorthAmericaComponent } from './pages/north-america/north-america.component';
import { OceaniaComponent } from './pages/oceania/oceania.component';
import { SouthAmericaComponent } from './pages/south-america/south-america.component';

export const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '', component: HomeComponent },
  { path: 'europe', component: EuropeComponent },
  { path: 'asia', component: AsiaComponent },
  { path: 'north-america', component: NorthAmericaComponent },
  { path: 'south-america', component: SouthAmericaComponent },
  { path: 'oceania', component: OceaniaComponent },
  { path: 'game', component: GameComponent },
];
