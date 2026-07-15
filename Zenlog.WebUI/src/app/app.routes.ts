import { Routes } from '@angular/router';
import { Auth } from '../pages/auth/auth';
import { authGuard } from '../core/service/auth-guard';

export const routes: Routes = [
     {
        path:"",
        redirectTo:"journal-list",
        pathMatch: 'full'
    },
    {
        path:"journal-editor",
        loadComponent: ()=> import('../pages/journal-editor/journal-editor').then(m=>m.JournalEditor),
        canActivate:[authGuard]
    },
    {
        path:"journal-list",
        loadComponent: ()=> import('../pages/journal-list-page/journal-list-page').then(m=>m.JournalListPage),
        canActivate:[authGuard]
    },
    {
        path:'auth',
        component: Auth
    }
];
