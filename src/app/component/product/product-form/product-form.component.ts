import { CategoryService } from './../../../service/category.service';
import { ProductService } from './../../../service/product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  productGroup:FormGroup;
  categorys;
  status="create";
  constructor(private fb:FormBuilder,private _productSV:ProductService,private _categorySV:CategoryService) {
    this.productGroup = this.fb.group({
      _id:'',
      name:['',[Validators.required]],
      price:['',[Validators.required]],
      input_price:['',[Validators.required]],
      category:['',[Validators.required]],
      unit:['',[Validators.required]],
      status:['',[Validators.required]],
    })
   }

  ngOnInit() {
    this._categorySV.list().subscribe((res:any)=>this.categorys=res)
    this._productSV.productEmiter.subscribe(res=>{

      this.productGroup.patchValue(res);
      this.productGroup.patchValue({category:res.category?res.category._id:''});
      this.status="update";
    })
  }

  onSubmit(){
    let product = this.productGroup.value;
    if(this.status=="create"){
        this._productSV.create(product).subscribe((res:any)=>{
          this.categorys.forEach(element => {
            if(res.category == element._id){
              res.category = element;
            }
        });
          this._productSV.emitProduct(res)
          this.productGroup.reset();
        })

    } else {
        
      this._productSV.edit(product).subscribe((res:any)=>{
        this.categorys.forEach(element => {
            if(res.category == element._id){
              res.category = element;
            }
        });
        console.log(res);
        this._productSV.emitProduct(res);
        this.productGroup.reset();
        this.status="create";
      })
    
    }
  }

}
