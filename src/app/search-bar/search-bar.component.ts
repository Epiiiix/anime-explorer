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
    this.searchCtrl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => (query ? this.searchAnime(query) : []))
      )
      .subscribe((suggestions) => (this.suggestions = suggestions));
  }

  router = inject(Router);
  apiService = inject(ApiService);

  suggestions: any[] = [];

  private searchAnime(query: string) {
    return this.apiService
      .searchAnime(query)
      .pipe(map((response) => (response.animeList ?? []).slice(0, 5)));
  }

  onSearch(): void {
    const query = (this.searchCtrl.value ?? '').trim();
    if (query && query.length >= 3) {
      this.router.navigate(['/search'], { queryParams: { q: query } });
      this.searchCtrl.setValue('');
      this.suggestions = [];
    }
  }

  selectAnime(id: any) {
    this.router.navigate(['/anime-details', id]);
    this.searchCtrl.setValue('');
    this.suggestions = [];
  }
}
