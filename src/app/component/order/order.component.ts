import { element } from 'protractor';
import { OrderService } from './../../service/order.service';
import { ProductService } from './../../service/product.service';
import { UserService } from './../../service/user.service';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { Component, OnInit, OnChanges, ElementRef,ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import {Observable} from 'rxjs/Observable'
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/scan';

import { myEvent,product } from './order';
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  @ViewChild('user') input: ElementRef;
  orderForm:FormGroup;
  users;
  products;
  orders=[];
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
  testchange(test:myEvent){
    console.log(test.target.value)
  }
  ngOnInit() {


    const inputEle = <HTMLInputElement>this.input.nativeElement;
    Observable.fromEvent<any>(inputEle, 'keyup')
      .subscribe(data => console.log(data.target.value));



      
    this.orderForm = this.fb.group({
      _id:[],
      user:this.fb.group({
        _id:[],
        name:[],
        adress:[],
        code:[],
        phone:[]
      }),
      status:[],
      grand_total:[],
      subtotal:[],
      items:this.fb.array([])
    })



    this.orderForm.get('items').valueChanges.scan(function(old,value){
      let items = [];
      value.forEach(function (item,index) {

          if(old[index]){
            if(item.discout_fixed!= old[index].discout_fixed){
              item.discout_percent = 0;            
            } else if(item.discout_percent!= old[index].discout_percent) {
              item.discout_fixed = 0;
            }
          }
          console.log(item.discout_percent)
          console.log(item.discout_fixed)
          // console.log(item);
          items.push(item);
        });
        return items;
    }).subscribe(res=>{

      // console.log("change");
      
      // console.log(res);

              var totals=0;
      var sub_total=0;
      res.forEach((element,index) => {
        // this.validatorFrom(element);
          if(element.qty>0 && element.price>=0 && typeof element.price == 'number' && typeof element.qty == 'number' ){
            element.total =0;
            let total = element.price *element.qty;
            if(element.discout_percent==0){
              element.discout_percent = (parseInt(element.discout_fixed)/total)*100;            
            } else {
              element.discout_fixed =  (total*parseInt(element.discout_percent,10))/100;
            }        
            total = total - element.discout_fixed;
            this.items.controls[index].patchValue({total:total,discout_fixed:element.discout_fixed,discout_percent:element.discout_percent}, {emitEvent: false});
              totals+= total;
          } else {
            totals+=0;
            
          }

      });
      this.orderForm.patchValue({
        grand_total:totals,
        subtotal:totals
      }, {emitEvent: false})
    })
  }
  validatorFrom(element){
      if(element.qty ||element.price <= 0  ){
        alert("số lượng phải lớn hơn 0");
        return false;        
      }
      if(typeof element.qty || typeof element.price !== 'number'){
        alert("kiểu nhập vào phải là kiểu số")
        return false;
      }

      return true;
  }
  valueUserChanged(value){
        this.orderForm.get('user').patchValue({
          _id:value._id,
          name:value.name,
          adress:value.adress,
          code:value.code,
          phone:value.phone
        })
  }
  valueProductChanged(value:product,i){
   value && this.items.controls[i].patchValue({
      product:{
        _id:value._id,
        name:value.name
      },
      price:value.price,
      total:value.price
    })
  }
  get items(){
    return this.orderForm.get('items') as FormArray;
  }

  addItem(product){
   
    this.items.push(this.fb.group({
      _id:[],
      product:this.fb.group({
        _id:product?product._id:'',
        name:product?product.name:''
      }),
      qty:1,
      status:0,
      price:product?product.price:0,
      discout_percent:0,
      discout_fixed:0,
      note:'',    
      total:product?product.price*1:0,
      
    }))
  }
  removeItem(index){
          this.items.removeAt(index)
  }
  editOrder(order){
    this.orderForm.patchValue({
      _id:order._id,
      grand_total:order.grand_total,
      user:{
        _id:order.user._id,
        name:order.user.name,
        code:order.user.code,
        address:order.user.address,
        phone:order.user.phone
      },
    })
    this.items.controls=[]
    // const arr = <FormArray>this.orderForm.controls.items;
    // arr.controls = [];
    const items=[];
    order.items.forEach(element => {
      const item = this.fb.group({
        discout_percent:element.discout_percent,
        discout_fixed:element.discout_fixed,
        note:element.note,
        order:element.order,
        price:element.price,
        product:this.fb.group({
          _id:element.product._id,
          name:element.product.name
        }),
        total:(element.price*element.qty) - element.discout_fixed,
        status:element.status?element.status:0,
        qty:element.qty,
        _id:element._id,
      })
      this.items.push(item)
    });
  //  console.log(items)
  //   const itemsFAs = this.fb.array(items);
  //   if(items.length>0){
  //     this.orderForm.setControl('items',itemsFAs);
      
  //   }
  }
  onSubmit(){
    console.log(this.orderForm.value)
    const order = this.preSave();
      // console.log(this.preSave());
    this._orderService.create(order).subscribe(res=>{
      this.orders.push(res);
    })
  }
  preSave(){
    const order=this.orderForm.value;
    order.user = order.user._id;
    order.status = order.status?order.status:0;
    const items=[];
    for(let i=0;i<this.items.length;i++){
      let item =this.items.controls[i].value;
      item.product =  this.items.controls[i].value.product._id;
      items.push(item)
    }
    order.items = items;
    return order;
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
  ngAfterViewInit() {
    // Component views are initialized
  }
}
