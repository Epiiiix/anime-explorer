import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Anime } from './anime';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  httpClient = inject(HttpClient);

  constructor() {}

  // Mappe les données de l'anime pour correspondre à l'interface Anime.
  private mapAnimeData(animeData: any) {
    return {
      id: animeData.mal_id,
      title: animeData.title,
      title_english: animeData.title_english,
      title_japanese: animeData.title_japanese,
      synonyms: animeData.title_synonyms,
      image: animeData.images.webp.image_url,
      trailer: animeData.trailer ? animeData.trailer.embed_url : null,
      url: animeData.url,
      type: animeData.type,
      episodes: animeData.episodes,
      status: animeData.status,
      aired: animeData.aired?.string ?? 'Unknown',
      duration: animeData.duration,
      rating: animeData.rating,
      score: animeData.score,
      scored_by: animeData.scored_by,
      rank: animeData.rank,
      popularity: animeData.popularity,
      synopsis: animeData.synopsis,
      season: animeData.season,
      year: animeData.year,
      broadcast: animeData.broadcast ? animeData.broadcast.string : 'Unknown',
    };
  }

  // Récupère un anime depuis une URL.
  private fetchAnime(url: string): Observable<Anime> {
    return this.httpClient
      .get<any>(url)
      .pipe(map((data: any) => this.mapAnimeData(data.data)));
  }

  // Récupère une liste d'animes depuis une URL.
  private fetchAnimeList(url: string): Observable<any> {
    return this.httpClient.get<any>(url).pipe(
      map((response) => ({
        animeList: response.data.map(this.mapAnimeData),
        pagination: response.pagination,
      }))
    );
  }

  // Récupère un anime par son ID.
  getAnimeById(id: string): Observable<Anime> {
    const url = `https://api.jikan.moe/v4/anime/${id}/full`;
    return this.fetchAnime(url);
  }

  // Récupère une liste d'animes populaires.
  getPopularAnimeList(limit: number, page: number): Observable<any> {
    const url = `https://api.jikan.moe/v4/top/anime?limit=${limit}&page=${page}`;
    return this.fetchAnimeList(url);
  }

  // Récupère une liste d'animes en cours de diffusion.
  getCurrentAnimeList(limit: number, page: number): Observable<any> {
    const url = `https://api.jikan.moe/v4/seasons/now?limit=${limit}&page=${page}`;
    return this.fetchAnimeList(url);
  }

  // Récupère les recommandations d'animes basées sur un anime donné.
  getAnimeRecommendations(id: string): Observable<any> {
    const url = `https://api.jikan.moe/v4/anime/${id}/recommendations?limit=6`;
    return this.httpClient.get<any>(url).pipe(
      map((response) =>
        response.data.slice(0, 6).map((anime: any) => ({
          id: anime.entry.mal_id,
          title: anime.entry.title,
          image: anime.entry.images.webp.image_url,
        }))
      )
    );
  }

  // Recherche des animes par un terme de recherche.
  searchAnime(query: string): Observable<any> {
    const url = `https://api.jikan.moe/v4/anime?q=${query}`;
    return this.fetchAnimeList(url);
  }

  // Récupère une liste de personnages populaires.
  getPopularCharacters(page: number): Observable<any> {
    const url = `https://api.jikan.moe/v4/top/characters?page=${page}`;
    return this.httpClient.get<any>(url).pipe(
      map((response) =>
        response.data.map((character: any) => ({
          id: character.mal_id,
          name: character.name,
          img: character.images.jpg.image_url,
          about: character.about,
          nicknames: character.nicknames || [],
        }))
      )
    );
  }

  // Récupère les personnages d'un anime par son ID.
  getCharactersByAnime(id: string): Observable<any> {
    const url = `https://api.jikan.moe/v4/anime/${id}/characters`;
    return this.httpClient.get<any>(url).pipe(
      map((response) => response.data),
      map((characters: any[]) =>
        characters
          .map((character: any) => ({
            id: character.character.mal_id,
            name: character.character.name,
            img: character.character.images.webp.image_url,
            score: character.favorites,
          }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 6)
      )
    );
  }
}
