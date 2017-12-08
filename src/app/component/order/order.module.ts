import { OrderService } from './../../service/order.service';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from './../../service/user.service';
import { ProductService } from './../../service/product.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderComponent } from './order.component';
import { OrderRouterModule } from './order-router.module';

@NgModule({
  imports: [
    CommonModule,
    OrderRouterModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  declarations: [OrderComponent],
  providers:[
    ProductService,
    UserService,
    OrderService
  ]
})
export class OrderModule { }
