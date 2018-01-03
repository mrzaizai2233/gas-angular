import { CategoryService } from './../../../service/category.service';
import { Component, OnInit } from '@angular/core';
import {FormGroup,FormControl,Validators ,FormBuilder}   from '@angular/forms';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.css']
})
export class CreateCategoryComponent implements OnInit {
  categoryGroup:FormGroup;
  status="create";
  constructor(private _categorySevice:CategoryService,private fb:FormBuilder) { 
    this.categoryGroup= this.fb.group({
      name:['',[Validators.required,Validators.minLength(4)]],
      status:['',[Validators.required]],
      _id: ''
    })
    this.categoryGroup.setValue({status:'1',name:'',_id:''});
  }

  ngOnInit() {
    this._categorySevice.categoryEmiter.subscribe(res=>{
      this.categoryGroup.setValue({status:res.status,name:res.name,_id:res._id})
      this.status = "update";
    })
  }
  onSubmit(){
   console.log(this.categoryGroup)
    if(this.status=="create"){
      this._categorySevice.add(this.categoryGroup.value).subscribe(res => {
        this._categorySevice.editToList(res)
      })
    } else {
        this._categorySevice.edit(this.categoryGroup.value).subscribe(res=>{
          this._categorySevice.editToList(res)
        })
    }


    this.categoryGroup.reset({status:1});
    this.status="create";
  }

}