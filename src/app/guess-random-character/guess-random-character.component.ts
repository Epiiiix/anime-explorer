import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  from,
  concatMap,
  timer,
  toArray,
} from 'rxjs';

@Component({
  selector: 'app-guess-random-character',
  imports: [ReactiveFormsModule],
  templateUrl: './guess-random-character.component.html',
  styleUrl: './guess-random-character.component.css',
})
export class GuessRandomCharacterComponent implements OnInit {
  apiService = inject(ApiService);

  loading: boolean = true; // Variable pour indiquer le chargement.
  randomCharacter: any = null; // Personnage aléatoire à deviner.
  popularCharacters: any[] = []; // Liste des personnages populaires.
  filteredCharacters: any[] = []; // Liste filtrée des personnages pour l'autocomplétion.

  attempts: number = 0; // Nombre d'essais effectués.
  attemptedAnswers: string[] = []; // Liste des réponses déjà tentées.

  grayscaleActive: boolean = true; // Si l'image du personnage doit être en noir et blanc.
  blurLevel: number = 10; // Niveau de flou appliqué à l'image du personnage.

  showHint: boolean = false; // Contrôle de l'affichage d'un indice.
  error: boolean = false; // Indicateur d'erreur (réponse incorrecte).
  success: boolean = false; // Indicateur de succès (réponse correcte).

  userInput: FormControl = new FormControl(''); // Champ de saisie de l'utilisateur.

  ngOnInit(): void {
    this.getRandomCharacter(); // Appelle la fonction pour récupérer un personnage aléatoire.
    this.setupAutocomplete(); // Met en place la logique d'autocomplétion pour la saisie.
  }

  // Retourne le style de l'image avec le filtre de gris et de flou activé ou désactivé.
  imageFilter(): string {
    return `grayscale(${this.grayscaleActive ? '100%' : '0%'}) blur(${
      this.blurLevel
    }px)`;
  }

  // Récupère un personnage aléatoire depuis l'API en récupérant des personnages populaires à partir de plusieurs pages.
  getRandomCharacter() {
    const pages = [1, 2, 3, 4]; // 100 personnages
    const delayBetween = 350; // Délai entre les requêtes pour éviter d'être trop rapide. (3 requêtes/s max sur l'API)

    this.loading = true; // Indique que les données sont en train de se charger.

    from(pages)
      .pipe(
        concatMap((page, index) =>
          timer(index * delayBetween).pipe(
            concatMap(() => this.apiService.getPopularCharacters(page))
          )
        ),
        toArray() // Rassemble les résultats des différentes pages.
      )
      .subscribe({
        next: (results) => {
          this.popularCharacters = results.flat();

          if (this.popularCharacters.length > 0) {
            const randomIndex = Math.floor(
              Math.random() * this.popularCharacters.length
            );
            this.randomCharacter = this.popularCharacters[randomIndex]; // Sélectionne un personnage aléatoire.
          }
        },
        complete: () => {
          this.loading = false; // Les données ont été chargées.
        },
      });
  }

  // Met en place l'autocomplétion pour la recherche de personnages.
  setupAutocomplete() {
    this.userInput.valueChanges
      .pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged(), // Ignore les entrées identiques successives.
        map((value) => this.filterCharacters(value)) // Filtre les personnages en fonction de la saisie.
      )
      .subscribe((filtered) => {
        this.filteredCharacters = filtered;
      });
  }

  // Filtre la liste des personnages en fonction de la saisie de l'utilisateur.
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

  // Sélectionne la première suggestion d'autocomplétion et vérifie la réponse.
  selectFirstSuggestion() {
    if (this.filteredCharacters.length > 0) {
      const firstSuggestion = this.filteredCharacters[0];
      this.selectCharacter(firstSuggestion); // Sélectionne ce personnage comme réponse.
    }
  }

  // Sélectionne un personnage dans les suggestions et vérifie la réponse.
  selectCharacter(character: any) {
    this.userInput.setValue(character.name, { emitEvent: false }); // Définit la valeur du champ de saisie sur le nom du personnage.
    this.filteredCharacters = []; // Efface les suggestions filtrées.
    this.checkAnswer();
  }

  // Incrémente le nombre d'essais et ajuste le niveau de flou de l'image.
  incrementAttempts() {
    if (this.attempts < 3) {
      this.attempts++;
      this.blurLevel = Math.max(0, 10 - this.attempts * 3); // Réduit le flou à chaque tentative échouée.
    }
  }

  // Vérifie si la réponse donnée par l'utilisateur est correcte.
  checkAnswer() {
    const userAnswer = this.userInput.value?.trim().toLowerCase(); // Récupère la réponse de l'utilisateur en minuscule.

    // Ignore si la réponse est vide ou déjà tentée.
    if (!userAnswer || this.attemptedAnswers.includes(userAnswer)) {
      return;
    }

    this.attemptedAnswers.push(userAnswer);

    // Crée une liste des réponses valides (nom du personnage et surnoms).
    const validAnswers = [
      this.randomCharacter.name.toLowerCase(),
      ...this.randomCharacter.nicknames?.map((nickname: string) =>
        nickname.toLowerCase()
      ),
    ];

    // Vérifie si la réponse de l'utilisateur est correcte.
    if (validAnswers.includes(userAnswer)) {
      this.grayscaleActive = false;
      this.blurLevel = 0;
      this.error = false; // Réponse correcte, donc plus d'erreur.
      this.success = true;
    } else {
      this.error = true; // Réponse incorrecte.
      this.success = false;
      this.incrementAttempts();
    }

    this.userInput.setValue('');
  }

  // Réinitialise le jeu avec un nouveau personnage.
  resetGame() {
    this.getRandomCharacter();
    this.success = false;
    this.error = false;
    this.attempts = 0;
    this.blurLevel = 10;
    this.grayscaleActive = true;
    this.userInput.setValue('');
    this.attemptedAnswers = [];
    this.showHint = false;
  }
}
