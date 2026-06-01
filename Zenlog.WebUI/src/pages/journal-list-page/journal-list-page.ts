import { Component, inject, OnInit, signal } from '@angular/core';
import { Route, Router } from '@angular/router';
import { JournalService } from '../../core/service/journal';
import { JournalEntry, JournalGroup } from '../../model/JournalModel';
import { DatePipe } from '@angular/common';
import { Authentication } from '../../core/service/auth';

@Component({
  selector: 'app-journal-list-page',
  imports: [DatePipe],
  templateUrl: './journal-list-page.html',
  styleUrl: './journal-list-page.scss',
})

export class JournalListPage implements OnInit {
  router: Router = inject(Router);
  journalService = inject(JournalService);
  journalGroups = signal<JournalGroup[]>([]);
  auth: Authentication = inject(Authentication);
  isLoading = signal(false);

  ngOnInit(): void {
    this.getJournalList();
  }

  edit(item: JournalEntry) {
    let queryParams = { value: btoa(unescape(encodeURIComponent(JSON.stringify(item)))) };
    this.router.navigate(['journal-editor'], { queryParams })
  }

  add() {
    this.router.navigate(['journal-editor'])
  }

  getJournalList() {
    const user = this.auth.currentUserSubject.value;
    this.isLoading.set(true)
    this.journalService.getJournalList(user?.id).subscribe({
      next: (res: any) => {
        const journalList: JournalEntry[] = res;
        const grouped = new Map<string, JournalGroup>();
        journalList.forEach(entry => {
          const existing = grouped.get(entry.entryDate);
          if (existing) {
            existing.entries.push(entry);
          } else {
            const dateObj = new Date(entry.entryDate);
            grouped.set(entry.entryDate, {
              date: entry.entryDate,
              weekday: dateObj.toLocaleDateString('en-US', { weekday: 'long' }),
              prettyDate: dateObj.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              }),
              entries: [entry]
            });
          }
        });
        this.journalGroups.set(
          Array.from(grouped.values()).sort((a, b) => a.date.localeCompare(b.date))
        );
        this.isLoading.set(false)
      }
    })
  }
}

