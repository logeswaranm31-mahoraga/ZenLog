import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../environment/env';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class Authentication {
  http:HttpClient = inject(HttpClient)
  apiURL = environment.apiurl;
  router : Router = inject(Router)
  currentUserSubject : BehaviorSubject<any> = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  constructor(){
    let stored = localStorage.getItem('user')
    if(stored) this.currentUserSubject.next(JSON.parse(stored));
  }

  login(body: any): Observable<any> {
    return this.http.post(this.apiURL + 'Auth/Login', body).pipe(
      tap((res: any) => {
        localStorage.setItem('user', JSON.stringify(res));
        this.currentUserSubject.next(res)
      })
    );
  }

  logout(): void {
    localStorage.clear();
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  get isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  reginster(body: any): Observable<any> {
    return this.http.post(this.apiURL + 'Auth/Register', body);
  }

}
