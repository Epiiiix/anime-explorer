import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  imports: [ReactiveFormsModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css'],
})
export class SearchBarComponent {
  searchCtrl = new FormControl('');
  @Output() searchEvent = new EventEmitter<string>();

  constructor() {
    // Observe les changements de valeur dans le champ de recherche.
    this.searchCtrl.valueChanges
      .pipe(
        debounceTime(300), // Attendre 300ms après chaque frappe.
        switchMap((query) => (query ? this.searchAnime(query) : [])) // Effectue la recherche si une requête est présente.
      )
      .subscribe((suggestions) => (this.suggestions = suggestions)); // Met à jour les suggestions avec les résultats.
  }

  router = inject(Router);
  apiService = inject(ApiService);

  suggestions: any[] = []; // Liste des suggestions d'animes.

  // Effectue une recherche d'animes basée sur la requête.
  private searchAnime(query: string) {
    return this.apiService
      .searchAnime(query)
      .pipe(map((response) => (response.animeList ?? []).slice(0, 5))); // Limite les résultats à 5 anime pour pas surcharger l'UI.
  }

  // Appelée lorsqu'un utilisateur fait une recherche.
  onSearch(): void {
    const query = (this.searchCtrl.value ?? '').trim(); // Récupère et netttoie la valeur de la recherche.
    if (query && query.length >= 3) {
      // Si la requête a au moins 3 caractères pour ne pas faire des recherches "inutiles".
      this.router.navigate(['/search'], { queryParams: { q: query } });
      this.searchCtrl.setValue(''); // Réinitialise le champ de recherche.
      this.suggestions = []; // Vide les suggestions.
    }
  }

  // Appelée lorsqu'un utilisateur sélectionne un anime dans les suggestions.
  selectAnime(id: any) {
    this.router.navigate(['/anime-details', id]);
    this.searchCtrl.setValue(''); // Réinitialise le champ de recherche.
    this.suggestions = []; // Vide les suggestions.
  }

  // Appelée lorsqu'un utilisateur nettoie le champ d'entrée de la barre de recherche.
  clearSearch() {
    this.searchCtrl.setValue('');
    this.suggestions = [];
  }
}
