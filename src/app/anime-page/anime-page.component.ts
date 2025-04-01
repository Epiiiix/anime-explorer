import { Component, inject } from '@angular/core';
import { ApiService } from '../api.service';
import { Anime } from '../anime';
import { AnimeListComponent } from '../anime-list/anime-list.component';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-anime-page',
  imports: [AnimeListComponent],
  templateUrl: './anime-page.component.html',
  styleUrl: './anime-page.component.css',
})
export class AnimePageComponent {
  apiService = inject(ApiService);
  route = inject(ActivatedRoute);

  animeList: Anime[] = [];
  pagination: any;

  currentPage: number = 1;
  limit: number = 24;

  category: string = '';
  title: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const category = params.get('category');
      if (category === 'now' || category === 'popular') {
        this.category = category;
        this.category === 'now'
          ? (this.title = 'Anime en cours')
          : (this.title = 'Anime populaire');
        this.loadAnimeList();
      } else {
        this.router.navigate(['']);
      }
    });
  }

  loadAnimeList(): void {
    const apiCall =
      this.category === 'now'
        ? this.apiService.getCurrentAnimeList(this.limit, this.currentPage)
        : this.apiService.getPopularAnimeList(this.limit, this.currentPage);

    apiCall.subscribe((response) => {
      this.animeList = response.animeList;
      this.pagination = response.pagination;
    });
  }

  changePage(next: boolean): void {
    if (next && this.pagination.has_next_page) {
      this.currentPage++;
    } else if (!next && this.currentPage > 1) {
      this.currentPage--;
    }
    this.loadAnimeList();
  }
}
