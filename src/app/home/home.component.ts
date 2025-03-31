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
  currentAnimeList: Anime[] = [];
  popularAnimeList: Anime[] = [];

  ngOnInit(): void {
    this.apiService
      .getPopularAnimeList(6, 1)
      .subscribe((data) => (this.popularAnimeList = data.animeList));

    this.apiService
      .getCurrentAnimeList(6, 1)
      .subscribe((data) => (this.currentAnimeList = data.animeList));
  }

  navigateToAnimePage(source: string) {
    this.router.navigate(['/anime-list', source]);
  }
}
