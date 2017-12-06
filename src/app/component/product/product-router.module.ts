import { ProductComponent } from './product/product.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

const router:Routes = [
  {
    path:'',
    component:ProductComponent
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(router)
  ],
  exports:[
    RouterModule
  ]
})
export class ProductRouterModule { }
