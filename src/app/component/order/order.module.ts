import { OrderService } from './../../service/order.service';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from './../../service/user.service';
import { ProductService } from './../../service/product.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderComponent } from './order.component';
import { OrderRouterModule } from './order-router.module';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';

@NgModule({
  imports: [
    CommonModule,
    OrderRouterModule,
    HttpClientModule,
    ReactiveFormsModule,
    Ng2AutoCompleteModule,
    FormsModule 
  ],
  declarations: [OrderComponent],
  providers:[
    ProductService,
    UserService,
    OrderService
  ]
})
export class OrderModule { }
