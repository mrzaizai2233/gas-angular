import { ErrorComponent } from './error/error.component';
import { NgModule } from '@angular/core';
import { RouterModule,Routes } from '@angular/router';

const routerConfig:Routes = [

    {
        path:'category',
        loadChildren:'app/component/category/category.module#CategoryModule'
    },
    {
        path:'product',
        loadChildren:'app/component/product/product.module#ProductModule'
    },
    {
        path:'',
        loadChildren:'app/component/order/order.module#OrderModule'
    }
    ,
    {
        path:'user',
        loadChildren:'app/component/user/user.module#UserModule'
    }
]

@NgModule({
    imports:[RouterModule.forRoot(routerConfig)],
    exports:[RouterModule],
})
export class AppRouter {}