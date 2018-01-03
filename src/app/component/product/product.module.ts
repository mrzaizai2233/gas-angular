import { HttpClientModule } from '@angular/common/http';
import { CategoryService } from './../../service/category.service';
import { ProductService } from './../../service/product.service';
import { ProductFormComponent } from './product-form/product-form.component';
import { ProductRouterModule } from './product-router.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductComponent } from './product/product.component';
import { ReactiveFormsModule  }   from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    ProductRouterModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  declarations: [ProductComponent,ProductFormComponent],
  providers:[ProductService,CategoryService]
})
export class ProductModule { }
