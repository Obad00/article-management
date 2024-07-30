// src/app/app.routes.ts
import { Route } from '@angular/router';
import { ArticleListComponent } from './article-list/article-list.component';
import { ArticleDetailComponent } from './article-detail/article-detail.component';
import { ArticleFormComponent } from './article-form/article-form.component';

export const routes: Route[] = [
  { path: '', redirectTo: '/articles', pathMatch: 'full' },
  { path: 'articles', component: ArticleListComponent },
  { path: 'article/:id', component: ArticleDetailComponent },
  { path: 'add-article', component: ArticleFormComponent },
  { path: 'edit-article/:id', component: ArticleFormComponent },
];
