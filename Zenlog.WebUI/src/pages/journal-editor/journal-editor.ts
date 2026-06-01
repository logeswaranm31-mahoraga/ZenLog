import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { JournalService } from '../../core/service/journal';
import { Emotion } from '../../model/JournalModel';
import { exhaustMap, map, Subject } from 'rxjs';
import { Authentication } from '../../core/service/auth';
import { FaceRatingIcons } from '../../shared/constants';

@Component({
  selector: 'app-journal-editor',
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, DatePipe, MatTimepickerModule, NgxMaterialTimepickerModule],
  templateUrl: './journal-editor.html',
  styleUrl: './journal-editor.scss',
})
export class JournalEditor implements OnInit {
  router: Router = inject(Router);
  activetedRoute: ActivatedRoute = inject(ActivatedRoute);
  journalService: JournalService = inject(JournalService);
  auth: Authentication = inject(Authentication);
  changeDetect: ChangeDetectorRef = inject(ChangeDetectorRef);
  jouranlData!: IJournalEntry;
  selectedTime: string = '';
  saveClick$ = new Subject<void>();

  moods = signal<Array<Emotion>>([])
  ngOnInit(): void {
    this.jouranlData = {} as IJournalEntry;
    this.jouranlData['entryDate'] = new Date();
    this.saveClick$.pipe(exhaustMap(()=>{
      const user = this.auth.currentUserSubject?.value
      let jouranlData: PostJournalEntry = {
      ...this.jouranlData,
      entryDate: this.jouranlData.entryDate.toISOString(),
      userId: user.id,
      id: this.jouranlData.id || 0
    }
      return this.journalService.addOrUpdateJournal(jouranlData);
    })).subscribe({
      next: (res: any) => {
        this.router.navigate(['journal-list']);
      },
      error: (err: any) => {

      }
    })
    this.getMoods();
    this.activetedRoute.queryParams.subscribe((param) => {
      if (param['value']) {
        let queryParams = JSON.parse(
          decodeURIComponent(
            escape(atob(param['value']))
          )
        );
        if (queryParams) {
          this.jouranlData = queryParams;
          this.jouranlData['entryDate'] = new Date(this.jouranlData['entryDate']);
        }
      }
    })

  }

  getMoods() {
    this.journalService.getMoods().subscribe({
      next: (res: any) => {
        this.moods.set(res)
      },
      error: (err: any) => {

      }
    })
  }

  selectMood(event: any) {
    this.jouranlData.moodId = event.id
  }

  save() {
    this.saveClick$.next();
  }

  openDatepicker(picker: any) {
    picker.open();
  }

  back() {
    this.router.navigate(['journal-list']);
  }

  checkToOpenTime(timePicker: any) {
    if (this.jouranlData.entryDate.getDate() != new Date().getDate()) {
      timePicker.open()
    }
  }

  setTime(event: any) {
    if (this.selectedTime) {
      const [time, modifier] = this.selectedTime.split(' ');
      let [hours, mins] = time.split(':').map(Number);

      if (modifier === 'AM' && hours === 12) {
        hours = 0;
      } else if (modifier === 'PM' && hours !== 12) {
        hours += 12;
      }
      this.jouranlData.entryDate.setHours(hours, mins);
      this.jouranlData.entryDate = new Date(this.jouranlData.entryDate);
    }
  }

  addorUpdateJournal(data: PostJournalEntry) {
    this.journalService.addOrUpdateJournal(data).subscribe({
      next: (res: any) => {
        this.router.navigate(['journal-list']);
      }
    });
  }

}

interface IJournalEntry {
  id: number;
  userId: number;
  title: string;
  moodId: number;
  entryDate: Date;
  content: string;
}

interface PostJournalEntry {
  id: number;
  userId: number;
  title: string;
  moodId: number;
  entryDate: string;
  content: string;
}
