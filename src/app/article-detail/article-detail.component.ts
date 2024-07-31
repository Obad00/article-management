// src/app/article-detail/article-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ArticleService } from '../article.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-article-detail',
  imports: [RouterLink, CommonModule],
  standalone : true,
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css']
})
export class ArticleDetailComponent implements OnInit {
  article: any;
  comments: any[] = []; // Array to hold comments

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService
  ) { }

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    
    // Récupérer les détails de l'article
    this.articleService.getArticle(id).subscribe(data => {
      this.article = data;
    }, error => {
      console.error('Erreur lors de la récupération de l\'article', error);
    });

    // Récupérer les commentaires de l'article
    this.articleService.getCommentsForArticle(id).subscribe(data => {
      this.comments = data;
    }, error => {
      console.error('Erreur lors de la récupération des commentaires', error);
    });
  }
}
