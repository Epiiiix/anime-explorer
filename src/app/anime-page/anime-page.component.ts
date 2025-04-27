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

  animeList: Anime[] = []; // Liste des animes à afficher sur la page.
  pagination: any; // Données de pagination pour gérer les pages suivantes/précédentes.

  currentPage: number = 1; // Page actuelle de la liste des animes, par défaut 1.
  limit: number = 24; // Limite d'animes à afficher par page.

  category: string = ''; // Catégorie de l'anime ('now' ou 'popular' ici).
  title: string = ''; // Titre qui sera affiché en fonction de la catégorie sélectionnée.

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const category = params.get('category'); // Récupère la catégorie de la liste d'anime depuis les paramètres de la route (paramMap).

      // Si la catégorie est valide (soit 'now' soit 'popular'), on met à jour la catégorie et le titre.
      if (category === 'now' || category === 'popular') {
        this.category = category;
        this.category === 'now'
          ? (this.title = 'Anime en cours')
          : (this.title = 'Anime populaires');

        // Chargement de la liste d'animes en fonction de la catégorie choisie.
        this.loadAnimeList();
      } else {
        // Si la catégorie n'est pas valide, on redirige vers la page d'accueil.
        this.router.navigate(['']);
      }
    });
  }

  // Charge la liste des anime en fonction de la catégorie et de la pagination.
  loadAnimeList(): void {
    const apiCall =
      this.category === 'now'
        ? this.apiService.getCurrentAnimeList(this.limit, this.currentPage)
        : this.apiService.getPopularAnimeList(this.limit, this.currentPage);

    // Mise à jour de la liste des animes et des données de pagination.
    apiCall.subscribe((response) => {
      this.animeList = response.animeList; // Liste des animes récupérés.
      this.pagination = response.pagination; // Données de pagination récupérées.
    });
  }

  // Cchanger de page (page suivante ou précédente) dans la pagination.
  changePage(next: boolean): void {
    if (next && this.pagination.has_next_page) {
      this.currentPage++;
    } else if (!next && this.currentPage > 1) {
      this.currentPage--;
    }
    this.loadAnimeList();
  }
}
