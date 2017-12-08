import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderComponent } from './order.component';
import { OrderRouterModule } from './order-router.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    OrderRouterModule
  ],
  declarations: [OrderComponent]
})
export class OrderModule { }
