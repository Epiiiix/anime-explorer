import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { AnimeDetailComponent } from './anime-detail/anime-detail.component';
import { AnimePageComponent } from './anime-page/anime-page.component';
import { SearchPageComponent } from './search-page/search-page.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/home' },
  { path: 'home', component: HomeComponent },
  { path: 'search', component: SearchPageComponent },
  { path: 'anime-list/:category', component: AnimePageComponent },
  { path: 'anime-details/:id', component: AnimeDetailComponent },
  { path: 'about', component: AboutComponent },
];
