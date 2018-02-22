import { element } from 'protractor';
import { OrderService } from './../../service/order.service';
import { ProductService } from './../../service/product.service';
import { UserService } from './../../service/user.service';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
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
  state="create";
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


    const inputEle = <HTMLInputElement>this.input.nativeElement;
    Observable.fromEvent<any>(inputEle, 'keyup')
      .subscribe(data => console.log(data.target.value));



      
    this.orderForm = this.fb.group({
      _id:[],
      user:this.fb.group({
        _id:['',[Validators.required]],
        name:['',[Validators.required]],
        adress:['',[Validators.required]],
        code:['',[Validators.required]],
        phone:['',[Validators.required]]
      }),
      status:[],
      grand_total:['',Validators.min(0)],
      subtotal:['',Validators.min(0)],
      items:this.fb.array([],Validators.required)
    })
      
  }

  changeDiscout($event,index,element){
    const item = this.items.controls[index];
    let total = 0;
    item.get('total').patchValue (
      item.get('qty').value?item.get('price').value *  item.get('qty').value:0
    )
    if (element === "qty") {
        item.get('discout_percent').patchValue(0)
        item.get('discout_fixed').patchValue(0)
      
  }
    if (element === "fixed") {
      if (item.get('discout_fixed').value <= item.get('price').value) {
        item.get('discout_percent').patchValue(
          item.get('discout_fixed').value * 100 / item.get('total').value
        )
        item.get('discout_fixed').patchValue(
          item.get('discout_fixed').value ? item.get('discout_fixed').value : 0
        )
      }
  }
  if (element === "percent") {
      if (item.get('discout_percent').value <= 100) {
        item.get('discout_fixed').patchValue (
          item.get('total').value * item.get('discout_percent').value / 100
          )
      }
      item.get('discout_percent').patchValue(
        item.get('discout_percent').value ? item.get('discout_percent').value : 0
      )
  }
    item.get('total').patchValue(
      item.get('total').value -item.get('discout_fixed').value
    )
    console.log(item)
  }
  isset(value){
    if(value==='' || value===null || value === undefined || value !== value)
      return false
      return true
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
  blur(item:myEvent,index){
    if(this.isset(item.target.value)==false){
      this.items.controls[index].patchValue({qty:1})
    }
      // console.log(item.target.value);
      // console.log(index);
  }
  addItem(product){
   
    this.items.push(this.fb.group({
      _id:[],
      product:this.fb.group({
        _id:[product?product._id:'',[Validators.required]],
        name:product?product.name:''
      }),
      qty:[1,[Validators.required,Validators.min(0)]],
      status:0,
      price:[product?product.price:0,[Validators.min(0)]],
      discout_percent:[0,[Validators.min(0)]],
      discout_fixed:[0,[Validators.min(0)]],
      note:'',    
      total:[product?product.price*1:0,[Validators.min(0)]],
      
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
      status:order.status==1?true:false
    })
    this.items.controls=[]
    // const arr = <FormArray>this.orderForm.controls.items;
    // arr.controls = [];
    const items=[];
    
    if(order.items.length > 0) order.items.forEach(element => {
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
        status:element.status?element.status:false,
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
    const order = this.preSave();
      console.log(this.preSave());
    this._orderService.create(order).subscribe(res=>{
      this.orders.push(res);
    })
  }
  preSave(){
    const order=this.orderForm.value;
    order.user = order.user._id;
    order.status = order.status==1?true:false;
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
  changeStatus(){
    // console.log('change');
    
    let _id = this.orderForm.get('_id').value ;
    // console.log(_id);
    if(_id!=null){
      this._orderService.changeStatus(_id).subscribe()
    }    
  }
  ngAfterViewInit() {
    // Component views are initialized
  }
}
