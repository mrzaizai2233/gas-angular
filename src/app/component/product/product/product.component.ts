import { ProductService } from './../../../service/product.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  products:any;
  status="create";
  constructor(private _productSV:ProductService) {
    this._productSV.products().subscribe(res=> {this.products=res} )
    this._productSV.productEmiter.subscribe(res=>{
      console.log(res)
      if(this.products.length>0){
        this.products.forEach((product,index) => {
          if(product._id==res._id){
            this.products[index]=res;
            this.status="update";
          }
        });
        if(this.status=="create"){
          this.products.push(res);
        }
        this.status="create";
      } else {
        this.products.push(res);
      }
     

    })
   }

  ngOnInit() {
  }
  edit(product){
    this._productSV.emitProduct(product)
  }
  delete(product_id){    
      this._productSV.delete(product_id).subscribe(res =>{
          this.products.forEach((element,index) => {
              if(element._id==res){
                this.products.splice(index,1)
                
              }            
          });
      })
  }
  getStatusText(status){
    if(status=='in_stock')
    return 'In Stock';
    else
    return 'Out Stock';
  }
}
