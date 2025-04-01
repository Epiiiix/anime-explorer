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

  anime: any;
  characters: any = [];
  recommendations: any = [];

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id') ?? '';
      this.apiService
        .getAnimeById(id)
        .subscribe((anime) => (this.anime = anime));
      this.apiService
        .getAnimeRecommendations(id)
        .subscribe((animes) => (this.recommendations = animes));
      this.apiService
        .getCharactersByAnime(id)
        .subscribe((characters) => (this.characters = characters));
    });
  }
}
