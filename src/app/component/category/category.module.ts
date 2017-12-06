import { CategoryService } from './../../service/category.service';
import { CreateCategoryComponent } from './create-category/create-category.component';
import { ListCategoryComponent } from './list-category/list-category.component';
import { CategoryRouterModule } from './category-router.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule  }   from '@angular/forms';

@NgModule({
  imports: [
    CategoryRouterModule,
    CommonModule,
    ReactiveFormsModule 
  ],
  declarations: [ 
    ListCategoryComponent,
    CreateCategoryComponent
  ],
  providers:[CategoryService]
})
export class CategoryModule { }
