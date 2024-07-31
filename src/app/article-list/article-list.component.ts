import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ArticleService } from '../article.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-article',
  standalone: true,
  templateUrl: './article-list.component.html', 
  styleUrls: ['./article-list.component.css'],       
  imports: [ReactiveFormsModule, RouterLink, CommonModule]
})
export class ArticleComponent implements OnInit {
  articles: any[] = [];
  articleForm: FormGroup;
  isEditing = false;
  currentArticleId: number | null = null;
  userId = 1; // ID d'utilisateur codé en dur pour la démonstration

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
        // Mise à jour de l'article existant
        this.articleService.updateArticle(this.currentArticleId, formValue).subscribe(
          () => {
            // Mise à jour facultative de la liste locale si nécessaire
            const index = this.articles.findIndex(article => article.id === this.currentArticleId);
            if (index > -1) {
              this.articles[index] = { ...formValue, id: this.currentArticleId };  // Update locally
            }
  
            Swal.fire({
              icon: 'success',
              title: 'Article mis à jour',
              text: 'Votre article a été mis à jour avec succès.',
              confirmButtonText: 'OK'
            }).then(() => {
              this.router.navigate(['/articles']); // Navigate after updating
            });
          },
          error => {
            Swal.fire({
              icon: 'error',
              title: 'Échec de la mise à jour',
              text: "Une erreur s'est produite lors de la mise à jour de l'article. Veuillez réessayer.",
              confirmButtonText: 'OK'
            });
            console.error('Error updating article:', error); // Gérer les erreurs de mise à jour
          }
        );
      } else {
        // Créer un nouvel article
        this.articleService.createArticle(formValue).subscribe(
          newArticle => {
            // Mise à jour facultative de la liste locale
            this.articles.unshift(newArticle);  // Préparez localement
  
            Swal.fire({
              icon: 'success',
              title: 'Article créé',
              text: 'Votre nouvel article a été créé avec succès.',
              confirmButtonText: 'OK'
            }).then(() => {
              this.router.navigate(['/articles']); // Naviguer après la création
            });
          },
          error => {
            Swal.fire({
              icon: 'error',
              title: 'Échec de la création',
              text: "Une erreur s'est produite lors de la création de l'article. Veuillez réessayer.",
              confirmButtonText: 'OK'
            });
            console.error('Error creating article:', error); // Gérer les erreurs de création
          }
        );
      }
    }
  }
  
  
  

  deleteArticle(id: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: 'Voulez-vous vraiment supprimer cet article ??',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimez-la!',
      cancelButtonText: 'Non, annuler!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.articleService.deleteArticle(id).subscribe(
          () => {
            // Supprimer l'article supprimé de la liste locale
            this.articles = this.articles.filter(article => article.id !== id);
            Swal.fire(
              'Supprimé!',
              'Votre article a été supprimé.',
              'success'
            );
          },
          error => {
            Swal.fire(
              'Error!',
              "Il y a eu un problème lors de la suppression de l'article. Veuillez réessayer.",
              'error'
            );
            console.error('Error deleting article:', error); // Gérer les erreurs de suppression
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Annulé',
          'Votre article est sûr :)',
          'error'
        );
      }
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
