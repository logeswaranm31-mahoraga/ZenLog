import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JournalEntry } from '../model/JournalModel';
import { environment } from '../environment/env';

@Injectable({
  providedIn: 'root',
})
export class JournalService {
  http = inject(HttpClient);
  JournalApiURL = environment.apiurl;
  public journalList: JournalEntry[] = [
    {
      id: 1,
      title: 'Morning Walk',
      moodId: 2,
      entryDate: '2026-05-01',
      mood: '😊',
      content: 'Went for a refreshing morning walk and enjoyed the cool breeze.'
    },
    {
      id: 2,
      title: 'Work Stress',
      moodId: 4,
      entryDate: '2026-05-02',
      mood: '😰',
      content: 'Had a hectic day at work with tight deadlines and lots of pressure.'
    },
    {
      id: 3,
      title: 'Lunch with Friends',
      moodId: 1,
      entryDate: '2026-05-02',
      mood: '🤩',
      content: 'Met friends for lunch, lots of laughter and good food.'
    },
    {
      id: 4,
      title: 'Gym Session',
      moodId: 3,
      entryDate: '2026-05-03',
      mood: '💪',
      content: 'Completed an intense workout session, feeling strong and active.'
    },
    {
      id: 5,
      title: 'Rainy Evening',
      moodId: 5,
      entryDate: '2026-05-03',
      mood: '🌧️😌',
      content: 'Relaxed at home listening to rain and sipping hot tea.'
    },
    {
      id: 6,
      title: 'Project Deadline',
      moodId: 4,
      entryDate: '2026-05-04',
      mood: '😖',
      content: 'Worked late to finish the project, quite exhausting but managed to complete it.'
    },
    {
      id: 7,
      title: 'Movie Night',
      moodId: 2,
      entryDate: '2026-05-04',
      mood: '🍿😊',
      content: 'Watched a movie with snacks, a perfect way to unwind.'
    },
    {
      id: 8,
      title: 'Family Dinner',
      moodId: 1,
      entryDate: '2026-05-05',
      mood: '🥰',
      content: 'Had a lovely dinner with family, felt warm and happy.'
    }
  ];

  getMoods(): Observable<any> {
    return this.http.get(this.JournalApiURL + 'Journal/GetMoods');
  }

  getJournalList(id:number): Observable<any> {
    return this.http.get(this.JournalApiURL + 'Journal/GetAllJournals/'+id)
  }

  addOrUpdateJournal(body: any): Observable<any> {
    return this.http.post(this.JournalApiURL + 'Journal/AddOrUpdateJournal', body);
  }
}
