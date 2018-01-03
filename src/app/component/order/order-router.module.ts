import { OrderComponent } from './order.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
const router:Routes=[
    {
        path:'',
        component:OrderComponent
    }
]
@NgModule({
  imports: [
    RouterModule.forChild(router)
  ],
  exports:[
      RouterModule
  ],
  declarations: []
})
export class OrderRouterModule { }
