import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable()
export class ProductService {
  public productEmiter:EventEmitter<any> = new EventEmitter();
  
  private url = 'http://localhost:8042/api/';
  constructor(private _http:HttpClient) { }
  products (){
    return this._http.get(this.url+'/products')
  }

  create(product){
    return this._http.post(this.url+'/product/create',product)
  }

  delete(product_id){
    return this._http.get(this.url+'/product/delete/'+product_id)
  }

  edit(product){
    return this._http.post(this.url+'/product/update',product)
  }

  emitProduct(product){
    this.productEmiter.emit(product)
  }
}
