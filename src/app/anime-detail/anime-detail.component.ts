import { Component, inject } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AnimeListComponent } from '../anime-list/anime-list.component';
import { CharacterListComponent } from '../character-list/character-list.component';

@Component({
  selector: 'app-anime-detail',
  imports: [AnimeListComponent, CharacterListComponent],
  templateUrl: './anime-detail.component.html',
  styleUrl: './anime-detail.component.css',
})
export class AnimeDetailComponent {
  apiService = inject(ApiService);
  route = inject(ActivatedRoute);

  anime: any; // Variable pour stocker les détails de l'anime.
  characters: any = []; // Liste des personnages de l'anime.
  recommendations: any = []; // Liste des recommandations d'anime similaires.

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id') ?? ''; // Récupère l'ID de l'anime depuis les paramètres de la route (paramMap).

      // Appel de l'API pour récupérer les détails de l'anime avec l'ID récupéré juste avant.
      this.apiService
        .getAnimeById(id)
        .subscribe((anime) => (this.anime = anime));

      // Appel de l'API pour récupérer les recommandations d'animes basées sur cet anime.
      this.apiService
        .getAnimeRecommendations(id)
        .subscribe((animes) => (this.recommendations = animes));

      // Appel de l'API pour récupérer les personnages de cet anime.
      this.apiService
        .getCharactersByAnime(id)
        .subscribe((characters) => (this.characters = characters));
    });
  }
}
