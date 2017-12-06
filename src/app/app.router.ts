import { ErrorComponent } from './error/error.component';
import { NgModule } from '@angular/core';
import { RouterModule,Routes } from '@angular/router';

const routerConfig:Routes = [
    {
        path:'',component:ErrorComponent,
    },
    {
        path:'category',
        loadChildren:'app/component/category/category.module#CategoryModule'
    },
    {
        path:'product',
        loadChildren:'app/component/product/product.module#ProductModule'
    }
]

@NgModule({
    imports:[RouterModule.forRoot(routerConfig)],
    exports:[RouterModule],
})
export class AppRouter {}