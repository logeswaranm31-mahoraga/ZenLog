import { Component, inject, OnInit, signal } from '@angular/core';
import { Route, Router } from '@angular/router';
import { JournalService } from '../../core/service/journal';
import { JournalBody, JournalEntry, JournalGroup } from '../../model/JournalModel';
import { DatePipe } from '@angular/common';
import { Authentication } from '../../core/service/auth';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-journal-list-page',
  imports: [DatePipe, FormsModule],
  templateUrl: './journal-list-page.html',
  styleUrl: './journal-list-page.scss',
})

export class JournalListPage implements OnInit {
  router: Router = inject(Router);
  journalService = inject(JournalService);
  journalGroups = signal<JournalGroup[]>([]);
  auth: Authentication = inject(Authentication);
  private observer!:IntersectionObserver;
  isLoading = signal(false);
  isInitialLoad = signal(true);
  body!: JournalBody;
  hasMoreRecords: Boolean = true;
  ngOnInit(): void {
    const user = this.auth.currentUserSubject.value;
    this.body = {
      id: user.id,
      offset: 0,
      limit: 20
    }
    this.getJournalList();
    this.setIntersectingObserver();
  }

  edit(item: JournalEntry) {
    let queryParams = { value: btoa(unescape(encodeURIComponent(JSON.stringify(item)))) };
    this.router.navigate(['journal-editor'], { queryParams })
  }

  add() {
    this.router.navigate(['journal-editor'])
  }

  getJournalList() {
     if (this.isLoading() || !this.hasMoreRecords) return;
    this.isLoading.set(true)
    this.journalService.getJournalList(this.body).subscribe({
      next: (res: any) => {
        const journalList: JournalEntry[] = res.data;
        this.hasMoreRecords = res.hasMore;
        this.body.offset = res.nextOffset;
        this.isInitialLoad.set(false);
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
        const journalData = Array.from(grouped.values()).sort((a, b) => a.date.localeCompare(b.date))
        this.journalGroups.set(
          [...this.journalGroups(), ...journalData]
        );
        this.isLoading.set(false)
      }
    })
  }

  setIntersectingObserver(): void {
    this.observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && this.hasMoreRecords && !this.isLoading()) {
        this.getJournalList();
      }
    }, { threshold: 0.1 })
    setTimeout(() => {
      const sentinel = document.getElementById('scroll-sentinel');
      if (sentinel) this.observer.observe(sentinel);
    }, 500);

  }

   applyFilter(): void {
    this.journalGroups.set([]);
    this.body.offset = 0;
    this.hasMoreRecords = true;
    this.isInitialLoad.set(true);
    this.getJournalList();
  }

ngOnDestroy(): void {
    if (this.observer) this.observer.disconnect();
  }
}

