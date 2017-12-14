import { element } from 'protractor';
import { OrderService } from './../../service/order.service';
import { ProductService } from './../../service/product.service';
import { UserService } from './../../service/user.service';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { Component, OnInit, OnChanges, ElementRef,ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import {Observable} from 'rxjs/Observable'
import 'rxjs/add/observable/fromEvent';
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
    this.orderForm = this.fb.group({
      _id:[],
      user:this.fb.group({
        _id:[],
        name:[],
        adress:[],
        code:[],
        phone:[]
      }),
      grand_total:[],
      subtotal:[],
      items:this.fb.array([])
    })
    const inputEle = <HTMLInputElement>this.input.nativeElement;
    Observable.fromEvent<any>(inputEle, 'keyup')
      .subscribe(data => console.log(data.target.value));


    this.orderForm.get('items').valueChanges.subscribe(res=>{
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
    })
    console.log(this.items.controls[i].value)
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
      price:product?product.price:'',
      discout:'',
      discout_total:'',
      note:'',
    }))
  }
  removeItem(index){
          this.items.removeAt(index)
  }
  editOrder(order){
      console.log(order.user);
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
        discout:element.discout,
        discout_total:element.discout_total,
        note:element.note,
        order:element.order,
        price:element.price,
        product:this.fb.group({
          _id:element.product._id,
          name:element.product.name
        }),
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
