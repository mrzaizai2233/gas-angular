import { CreateCategoryComponent } from './create-category/create-category.component';
import { ListCategoryComponent } from './list-category/list-category.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const router:Routes = [
    {
        path:'',
        component:ListCategoryComponent,
        
    },{
        path:'create',
        component:CreateCategoryComponent
    }
    
]

@NgModule({
  imports: [
    RouterModule.forChild(router)
  ],
  exports:[RouterModule]
})
export class CategoryRouterModule { }
