import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-anime',
  imports: [],
  templateUrl: './anime.component.html',
  styleUrl: './anime.component.css',
})
export class AnimeComponent {
  constructor(private router: Router) {}

  @Input() anime: any;

  navigateToDetail(id: string) {
    this.router.navigate(['/anime-details', id]);
  }
}
