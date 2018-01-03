import { element } from 'protractor';
import { CategoryService } from './../../../service/category.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-category',
  templateUrl: './list-category.component.html',
  styleUrls: ['./list-category.component.css']
})
export class ListCategoryComponent implements OnInit {
  categorys:any=[];
  constructor(private _categoryService:CategoryService) { }

  ngOnInit() {
    this._categoryService.list().subscribe( res =>console.log(this.categorys=res));
    this._categoryService.editToListEmiter.subscribe(res=>{
      var isUpdate=false;
      this.categorys.forEach((element,index) => {
        if(element._id==res._id){
          this.categorys[index]=res;
          isUpdate=true;
        }
      });
      if(!isUpdate){
        this.categorys.push(res)
      }
    })
  }
  delete(category_id){
    this._categoryService.delete(category_id).subscribe(res =>{
      this.categorys.forEach((element,index) => {
        if(element._id==category_id){
          this.categorys.splice(index,1)
        }
      });
    })
  }
  edit(category){
    this._categoryService.emitData(category)
  }

}
