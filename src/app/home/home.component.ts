import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Anime } from '../anime';
import { AnimeListComponent } from '../anime-list/anime-list.component';
import { IntroComponent } from '../intro/intro.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [AnimeListComponent, IntroComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  constructor(private router: Router) {}
  apiService = inject(ApiService);
  currentAnimeList: Anime[] = []; // Liste des animes en cours.
  popularAnimeList: Anime[] = []; // Liste des animes populaires.

  // Appelée au chargement du composant pour récupérer les animes populaires et en cours.
  ngOnInit(): void {
    // Récupère la liste des animes populaires (6 premiers en tant que "preview").
    this.apiService
      .getPopularAnimeList(6, 1)
      .subscribe((data) => (this.popularAnimeList = data.animeList));

    // Récupère la liste des animes en cours (6 premiers en tant que "preview").
    this.apiService
      .getCurrentAnimeList(6, 1)
      .subscribe((data) => (this.currentAnimeList = data.animeList));
  }

  // Navigue vers une page de liste d'animes en fonction de la source (popular ou en cours).
  navigateToAnimePage(source: string) {
    this.router.navigate(['/anime-list', source]);
  }
}
