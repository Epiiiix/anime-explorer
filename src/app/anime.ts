export interface Anime {
  id: number;
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  synonyms: string[];
  image: string;
  trailer: string | null;
  url: string;
  type: string;
  episodes: number | null;
  status: string;
  aired: string;
  duration: string;
  rating: string;
  score: number | null;
  scored_by: number | null;
  rank: number | null;
  popularity: number | null;
  synopsis: string;
  season: string | null;
  year: number | null;
  broadcast: string | null;
}
