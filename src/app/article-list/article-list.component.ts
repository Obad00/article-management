import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ArticleService } from '../article.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-article',
  standalone: true,
  templateUrl: './article-list.component.html', // Ensure this points to the correct file
  styleUrls: ['./article-list.component.css'],       // This should be the correct path for styles
  imports: [ReactiveFormsModule, RouterLink, CommonModule]
})
export class ArticleComponent implements OnInit {
  articles: any[] = [];
  articleForm: FormGroup;
  isEditing = false;
  currentArticleId: number | null = null;
  userId = 1; // Hardcoded user ID for demonstration

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private articleService: ArticleService
  ) {
    this.articleForm = this.fb.group({
      title: [
        '', 
        [
          Validators.required, 
          Validators.minLength(5), 
          Validators.maxLength(50)
        ]
      ],
      body: [
        '', 
        [
          Validators.required, 
          Validators.minLength(20), 
          Validators.maxLength(2000)
        ]
      ]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.currentArticleId = +id;
      this.articleService.getArticle(this.currentArticleId).subscribe(article => {
        this.articleForm.patchValue(article);
      });
    } else {
      this.isEditing = false;
      this.loadArticles();
    }
  }

  loadArticles(): void {
    this.articleService.getArticles().subscribe(data => {
      this.articles = data.filter(article => article.userId === this.userId);
    });
  }

  onSubmit(): void {
    if (this.articleForm.valid) {
      const formValue = this.articleForm.value;
      if (this.isEditing && this.currentArticleId !== null) {
        // Update existing article
        this.articleService.updateArticle(this.currentArticleId, formValue).subscribe(
          () => {
            // Optionally update the local list if needed
            const index = this.articles.findIndex(article => article.id === this.currentArticleId);
            if (index > -1) {
              this.articles[index] = { ...formValue, id: this.currentArticleId };  // Update locally
            }
            this.router.navigate(['/articles']); // Navigate after updating
          },
          error => {
            console.error('Error updating article:', error); // Handle update errors
          }
        );
      } else {
        // Create new article
        this.articleService.createArticle(formValue).subscribe(
          newArticle => {
            // Optionally update the local list
            this.articles.unshift(newArticle);  // Prepend locally
            this.router.navigate(['/articles']); // Navigate after creating
          },
          error => {
            console.error('Error creating article:', error); // Handle creation errors
          }
        );
      }
    }
  }
  
  

  deleteArticle(id: number): void {
    this.articleService.deleteArticle(id).subscribe(() => {
      // Remove the deleted article from the local list
      this.articles = this.articles.filter(article => article.id !== id);
    });
  }
  
  editArticle(article: any): void {
    console.log('Editing article with ID:', article.id); 
    this.isEditing = true;
    this.currentArticleId = article.id;
    this.articleForm.patchValue({
      title: article.title,
      body: article.body
    });
  }
  

}
