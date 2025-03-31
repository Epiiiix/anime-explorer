import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SearchBarComponent } from '../search-bar/search-bar.component';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, SearchBarComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {}
