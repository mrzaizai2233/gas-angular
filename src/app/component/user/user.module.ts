import { HttpClientModule } from '@angular/common/http';
import { UserService } from './../../service/user.service';
import { UserRouterModule } from './user-router.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { ReactiveFormsModule  }   from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UserRouterModule,
    HttpClientModule
  ],
  declarations: [UserComponent],
  providers:[
    UserService
  ]
})
export class UserModule { }
