import { Injectable,EventEmitter } from '@angular/core';
import  { Http } from '@angular/http';
import 'rxjs/add/operator/map';
@Injectable()
export class CategoryService {
  categoryEmiter:EventEmitter<any> = new EventEmitter();
  editToListEmiter:EventEmitter<any> = new EventEmitter();
  constructor(private _http:Http) { }
  link:string = 'http://localhost:8042/api/';
  list(){
    return this._http.get(this.link+'/categorys').map( res=>res.json());
  }
  add(cateogory){
    return this._http.post(this.link+'/category/create',cateogory).map(res=>res.json());
  }
  edit(category){
    return this._http.post(this.link+'/category/update',category).map(res=>res.json())
  }
  delete(category_id){
    return this._http.get(this.link+'/category/delete/'+category_id).map(res=>res.json())
  }

  emitData(category){
    this.categoryEmiter.emit(category)
  }

  editToList(category){
    this.editToListEmiter.emit(category);
  }
}
