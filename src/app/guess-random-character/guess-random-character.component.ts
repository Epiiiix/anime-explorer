import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  startWith,
  forkJoin,
} from 'rxjs';

@Component({
  selector: 'app-guess-random-character',
  imports: [ReactiveFormsModule],
  templateUrl: './guess-random-character.component.html',
  styleUrl: './guess-random-character.component.css',
})
export class GuessRandomCharacterComponent implements OnInit {
  apiService = inject(ApiService);

  randomCharacter: any = null;
  popularCharacters: any[] = [];
  filteredCharacters: any[] = [];

  attempts: number = 0;
  attemptedAnswers: string[] = [];

  grayscaleActive: boolean = true;
  blurLevel: number = 10;

  showHint: boolean = false;
  error: boolean = false;
  success: boolean = false;

  userInput: FormControl = new FormControl('');

  get imageFilter(): string {
    return `grayscale(${this.grayscaleActive ? '100%' : '0%'}) blur(${
      this.blurLevel
    }px)`;
  }

  ngOnInit(): void {
    this.getRandomCharacter();
    this.setupAutocomplete();
  }

  getRandomCharacter() {
    const requests: Observable<any>[] = [];

    for (let i = 1; i <= 3; i++) {
      requests.push(this.apiService.getPopularCharacters(i));
    }

    forkJoin(requests).subscribe((results) => {
      this.popularCharacters = results.flat();

      if (this.popularCharacters.length > 0) {
        const randomIndex = Math.floor(
          Math.random() * this.popularCharacters.length
        );
        this.randomCharacter = this.popularCharacters[randomIndex];
      }
    });
  }

  setupAutocomplete() {
    this.userInput.valueChanges
      .pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged(),
        map((value) => this.filterCharacters(value))
      )
      .subscribe((filtered) => {
        this.filteredCharacters = filtered;
      });
  }

  filterCharacters(value: string): any[] {
    const filterValue = value.toLowerCase();
    if (filterValue.length > 1) {
      return this.popularCharacters.filter(
        (character) =>
          !this.attemptedAnswers.includes(character.name.toLowerCase()) &&
          (character.name.toLowerCase().includes(filterValue) ||
            character.nicknames?.some((n: string) =>
              n.toLowerCase().includes(filterValue)
            ))
      );
    } else {
      return [];
    }
  }

  selectFirstSuggestion() {
    if (this.filteredCharacters.length > 0) {
      const firstSuggestion = this.filteredCharacters[0];
      this.selectCharacter(firstSuggestion);
    }
  }

  selectCharacter(character: any) {
    this.userInput.setValue(character.name, { emitEvent: false });
    this.filteredCharacters = [];
    this.checkAnswer();
  }

  incrementAttempts() {
    if (this.attempts < 3) {
      this.attempts++;
      this.blurLevel = Math.max(0, 10 - this.attempts * 3);
    }
  }

  checkAnswer() {
    const userAnswer = this.userInput.value?.trim().toLowerCase();

    if (!userAnswer || this.attemptedAnswers.includes(userAnswer)) {
      return;
    }

    this.attemptedAnswers.push(userAnswer);

    const validAnswers = [
      this.randomCharacter.name.toLowerCase(),
      ...this.randomCharacter.nicknames?.map((nickname: string) =>
        nickname.toLowerCase()
      ),
    ];

    if (validAnswers.includes(userAnswer)) {
      this.grayscaleActive = false;
      this.blurLevel = 0;
      this.error = false;
      this.success = true;
    } else {
      this.error = true;
      this.success = false;
      this.incrementAttempts();
    }

    this.userInput.setValue('');
  }

  resetGame() {
    this.getRandomCharacter();
    this.success = false;
    this.error = false;
    this.attempts = 0;
    this.blurLevel = 10;
    this.grayscaleActive = true;
    this.userInput.setValue('');
    this.attemptedAnswers = [];
  }
}
