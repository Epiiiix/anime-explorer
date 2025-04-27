import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { Anime } from '../anime';
import { AnimeListComponent } from '../anime-list/anime-list.component';

@Component({
  selector: 'app-search-page',
  imports: [AnimeListComponent],
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css'],
})
export class SearchPageComponent implements OnInit {
  query: string = '';
  animeList: Anime[] = [];

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      // Récupère la valeur de la requête 'q' dans l'URL.
      this.query = params['q'];
      if (this.query) {
        // Si une requête est présente, appelle l'API pour rechercher les animes.
        this.apiService.searchAnime(this.query).subscribe((response) => {
          this.animeList = response.animeList ?? [];
        });
      }
    });
  }
}
