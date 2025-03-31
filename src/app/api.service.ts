import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { Anime } from './anime';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  httpClient = inject(HttpClient);

  constructor() {}

  private fetchAnime(url: string): Observable<any> {
    return this.httpClient.get<any>(url).pipe(
      map((data: any) => {
        const anime = data.data;
        return {
          id: anime.mal_id,
          title: anime.title,
          title_english: anime.title_english,
          title_japanese: anime.title_japanese,
          synonyms: anime.title_synonyms,
          image: anime.images.webp.image_url,
          trailer: anime.trailer ? anime.trailer.embed_url : null,
          url: anime.url,
          type: anime.type,
          episodes: anime.episodes,
          status: anime.status,
          aired: anime.aired.string,
          duration: anime.duration,
          rating: anime.rating,
          score: anime.score,
          scored_by: anime.scored_by,
          rank: anime.rank,
          popularity: anime.popularity,
          synopsis: anime.synopsis,
          season: anime.season,
          year: anime.year,
          broadcast: anime.broadcast ? anime.broadcast.string : 'Unknown',
        };
      })
    );
  }

  private fetchAnimeList(url: string): Observable<any> {
    return this.httpClient.get<any>(url).pipe(
      map((response) => ({
        animeList: response.data.map((anime: any) => ({
          id: anime.mal_id,
          title: anime.title,
          title_english: anime.title_english,
          title_japanese: anime.title_japanese,
          synonyms: anime.title_synonyms,
          image: anime.images.webp.image_url,
          trailer: anime.trailer ? anime.trailer.embed_url : null,
          url: anime.url,
          type: anime.type,
          episodes: anime.episodes,
          status: anime.status,
          aired: anime.aired.string,
          duration: anime.duration,
          rating: anime.rating,
          score: anime.score,
          scored_by: anime.scored_by,
          rank: anime.rank,
          popularity: anime.popularity,
          synopsis: anime.synopsis,
          season: anime.season,
          year: anime.year,
          broadcast: anime.broadcast ? anime.broadcast.string : 'Unknown',
        })),
        pagination: response.pagination,
      }))
    );
  }

  getAnimeById(id: string): Observable<Anime> {
    return this.fetchAnime('https://api.jikan.moe/v4/anime/' + id + '/full');
  }

  getPopularAnimeList(limit: number, page: number): Observable<any> {
    const url: string =
      'https://api.jikan.moe/v4/top/anime?limit=' + limit + '&page=' + page;
    return this.fetchAnimeList(url);
  }

  getCurrentAnimeList(limit: number, page: number): Observable<any> {
    const url: string =
      'https://api.jikan.moe/v4/seasons/now?limit=' + limit + '&page=' + page;
    return this.fetchAnimeList(url);
  }

  getAnimeRecommendations(id: string): Observable<any> {
    const url: string =
      'https://api.jikan.moe/v4/anime/' + id + '/recommendations?limit=6';
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

  searchAnime(query: string): Observable<any> {
    const url: string = 'https://api.jikan.moe/v4/anime?q=' + query;
    return this.fetchAnimeList(url);
  }
}
