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
  orders=[];
  product_name="";
  user={
    name:"",
    adress:"",
    code:"",
    phone:""
  }
  constructor(private fb:FormBuilder,private _userService:UserService,private _productService:ProductService,private _sanitizer:DomSanitizer,private _orderService:OrderService) {
    this._userService.users().subscribe(res => this.users=res)
    this._productService.products().subscribe(res=>this.products=res)
    this._orderService.orders().subscribe(res=>
      this.orders=this.orders.concat.apply(this.orders,res)
    )
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
      console.log("change");
      var total=0;
      var sub_total=0;
      res.forEach(element => {
        if(element.price!=''){
          total+= (element.price * element.qty);
        }
      });
      this.orderForm.patchValue({grand_total:total,subtotal:total})
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
  editOrder(order){
    this.user= order.user;
    this.orderForm.patchValue({
      _id:order._id,
      grand_total:order.grand_total,
      user:order.user._id,
    })
    this.items.controls=[]
    // const arr = <FormArray>this.orderForm.controls.items;
    // arr.controls = [];
    const items=[];
    order.items.forEach(element => {
      this.items.push(this.fb.group(element))
    });
   
    const itemsFAs = this.fb.array(items);
    if(items.length>0){
      this.orderForm.setControl('items',itemsFAs);
      
    }
  }

  onSubmit(){
      console.log(this.orderForm.value)
    this._orderService.create(this.orderForm.value).subscribe(res=>{
      this.orders.push(res);
    })
  }
  delete(order_id,index){         
    // console.log(this.orderForm.value)
    this._orderService.delete(order_id).subscribe((res:any)=>{
      for(let i=0;i<this.orders.length;i++){
        if(this.orders[i]._id==res){
               this.orders.splice(i,1);
          break;
        }
      }
    })
  }
}
