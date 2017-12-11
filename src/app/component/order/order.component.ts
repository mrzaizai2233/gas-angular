import { OrderService } from './../../service/order.service';
import { ProductService } from './../../service/product.service';
import { UserService } from './../../service/user.service';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { Component, OnInit, OnChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import {Observable} from 'rxjs/Observable'
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  orderForm:FormGroup;
  users;
  products;
  orders;
  user={
    name:"",
    adress:"",
    code:"",
    phone:""
  }
  constructor(private fb:FormBuilder,private _userService:UserService,private _productService:ProductService,private _sanitizer:DomSanitizer,private _orderService:OrderService) {
    this._userService.users().subscribe(res => this.users=res)
    this._productService.products().subscribe(res=>this.products=res)
    this._orderService.orders().subscribe(res=>this.orders=res)
   }
   autocompleListFormatter = (data: any) : SafeHtml => {
    let html = `<span>${data.name}</span>`;
    return this._sanitizer.bypassSecurityTrustHtml(html);
  }
  ngOnInit() {
    this.orderForm = this.fb.group({
      _id:[],
      user:[],
      grand_total:[],
      subtotal:[],
      items:this.fb.array([])
    })
    this.orderForm.get('items').valueChanges.subscribe(res=>{
      var total=0;
      var sub_total=0;
      res.forEach(element => {
        if(element.price!=''){
          total+= (element.price * element.qty);
        }
      });
      this.orderForm.patchValue({grand_total:total,sub_total:total})
    })
  }
  valueUserChanged(newVal) {
    this.user.name = newVal.name;
    this.user.adress = newVal.adress;
    this.user.code = newVal.code;
    this.user.phone = newVal.phone;
    this.orderForm.patchValue({user:newVal._id})
  }
  valueProductChanged(newVal,i){
    this.items.controls[i].patchValue({price:newVal.price,product:newVal._id})
    this.items.controls[i].value.product=newVal._id;
    // this.sum(newVal.price)
  }
  sum(price){
      var total = this.orderForm.get('grand_total').value;
      this.orderForm.patchValue({grand_total:total})
  }
  get items(){
    return this.orderForm.get('items') as FormArray;
  }

  addItem(){
   
    this.items.push(this.fb.group({
      product:'',
      qty:1,
      price:'',
      discout:'',
      discout_total:'',
      note:'',
    }))
  }
  removeItem(index){
          this.items.removeAt(index)
  }

  onSubmit(){
    this._orderService.create(this.orderForm.value).subscribe(res=>console.log(res))
  }

}
