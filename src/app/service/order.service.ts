import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class OrderService {

  private url = 'http://localhost:8042/api';
  constructor(private _http:HttpClient) { }
  orders (){
    return this._http.get(this.url+'/orders')
  }

  create(order){
    return this._http.post(this.url+'/order/create',order)
  }

  delete(order_id){
    return this._http.get(this.url+'/order/delete/'+order_id)
  }

  edit(order){
    return this._http.post(this.url+'/order/update',order)
  }
  
}
