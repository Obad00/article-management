// src/app/article-list/article-list.component.ts
import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../article.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  imports : [RouterLink, CommonModule],
  standalone : true,
  styleUrls: ['./article-list.component.css']
})
export class ArticleListComponent implements OnInit {
  articles: any[] = [];

  constructor(private articleService: ArticleService) { }

  ngOnInit(): void {
    this.articleService.getArticles().subscribe(data => {
      this.articles = data;
    });
  }

  deleteArticle(id: number): void {
    this.articleService.deleteArticle(id).subscribe(() => {
      this.articles = this.articles.filter(article => article.id !== id);
    });
  }
}
