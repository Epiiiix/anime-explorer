import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-character-list',
  imports: [],
  templateUrl: './character-list.component.html',
  styleUrl: './character-list.component.css',
})
export class CharacterListComponent {
  constructor() {}
  @Input() characters: any = [];
  @Input() title: string = '';
}
