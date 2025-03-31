import { Component, Input } from '@angular/core';
import { Anime } from '../anime';
import { AnimeComponent } from '../anime/anime.component';

@Component({
  selector: 'app-anime-list',
  imports: [AnimeComponent],
  templateUrl: './anime-list.component.html',
  styleUrl: './anime-list.component.css',
})
export class AnimeListComponent {
  constructor() {}
  @Input() animeList: Anime[] = [];
  @Input() title: string = '';
}
