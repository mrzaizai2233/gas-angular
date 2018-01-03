import { UserComponent } from './user.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const router:Routes =[
    {
      path:'',
      component:UserComponent
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
export class UserRouterModule { }
