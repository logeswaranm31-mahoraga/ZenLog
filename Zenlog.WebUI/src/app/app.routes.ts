import { Routes } from '@angular/router';
import { JournalEditor } from '../pages/journal-editor/journal-editor';
import { JournalListPage } from '../pages/journal-list-page/journal-list-page';
import { Auth } from '../pages/auth/auth';
import { authGuard } from '../service/auth-guard';

export const routes: Routes = [
     {
        path:"",
        redirectTo:"journal-list",
        pathMatch: 'full'
    },
    {
        path:"journal-editor",
        component:JournalEditor,
        canActivate:[authGuard]
    },
    {
        path:"journal-list",
        component:JournalListPage,
        canActivate:[authGuard]
    },
    {
        path:'auth',
        component: Auth
    }
];
