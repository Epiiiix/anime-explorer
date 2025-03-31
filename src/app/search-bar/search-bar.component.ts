import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  imports: [ReactiveFormsModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css'],
})
export class SearchBarComponent {
  searchCtrl = new FormControl('');
  @Output() searchEvent = new EventEmitter<string>();

  constructor(private router: Router) {}
  onSearch(): void {
    const query = (this.searchCtrl.value ?? '').trim();
    if (query && query.length >= 3) {
      this.router.navigate(['/search'], { queryParams: { q: query } });
    }
  }
}
