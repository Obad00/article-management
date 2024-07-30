// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { ActivatedRoute, Router } from '@angular/router';
// import { ArticleService } from '../article.service';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-article-form',
//   standalone: true,
//   templateUrl: './article-form.component.html',
//   styleUrls: ['./article-form.component.css'],
//   imports: [ReactiveFormsModule, CommonModule]
// })
// export class ArticleFormComponent implements OnInit {
//   articleForm: FormGroup;
//   isEditing = false;

//   constructor(
//     private fb: FormBuilder,
//     private route: ActivatedRoute,
//     private router: Router,
//     private articleService: ArticleService
//   ) {
//     this.articleForm = this.fb.group({
//       title: [
//         '', 
//         [
//           Validators.required, 
//           Validators.minLength(5), 
//           Validators.maxLength(50)
//         ]
//       ],
//       body: [
//         '', 
//         [
//           Validators.required, 
//           Validators.minLength(20), 
//           Validators.maxLength(2000)
//         ]
//       ]
//     });
//   }

//   ngOnInit(): void {
//     const id = this.route.snapshot.paramMap.get('id');
//     if (id) {
//       this.isEditing = true;
//       this.articleService.getArticle(+id).subscribe(article => {
//         this.articleForm.patchValue(article);
//       });
//     }
//   }

//   onSubmit(): void {
//     if (this.articleForm.valid) {
//       const formValue = this.articleForm.value;
//       if (this.isEditing) {
//         const id = +this.route.snapshot.paramMap.get('id')!;
//         this.articleService.updateArticle(id, formValue).subscribe(() => {
//           this.router.navigate(['/articles']);
//         });
//       } else {
//         this.articleService.createArticle(formValue).subscribe(() => {
//           this.router.navigate(['/articles']);
//         });
//       }
//     }
//   }
// }
