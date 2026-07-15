export interface JournalEntry {
  id: number;
  title: string;
  moodId: number;
  entryDate: string;
  mood: string;
  content: string;
}

export interface JournalGroup {
  date: string;
  weekday: string;
  prettyDate: string;
  entries: JournalEntry[];
}

export interface Emotion {
  id: number;
  emoji: string;
  name: string;
  color: string;
}

export interface JournalBody {
  id: number,
  offset: number,
  limit: number,
  specificDate?: Date,
  year?: string,
  month?: string
}