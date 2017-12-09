import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  orderForm:FormGroup;
  constructor(private fb:FormBuilder) { }

  ngOnInit() {
    this.orderForm = this.fb.group({
      _id:[],
      user:this.fb.group({
        name:'',
        code:'',
        adress:'',
        phone:''
      }),
      grand_total:[],
      subtotal:[],
      items:this.fb.array([])
    })
  }
  get items(){
    return this.orderForm.get('items') as FormArray;
  }
  addItem(){
   
    this.items.push(this.fb.group({
      product:'',
      qty:'',
      price:'',
      discout:'',
      discout_total:'',
      note:'',
    }))
  }
  removeItem(index){
    console.log(index)
    for(let i=0;i<this.items.controls.length;i++){
      // console.log(this.items.controls[i])
      if(i==index){
          this.items.removeAt(index)
      }
    }
  }

  onSubmit(){

  }

}
