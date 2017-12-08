import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class UserService {

  private url = 'http://localhost:8042/api';
  constructor(private _http:HttpClient) { }
  users (){
    return this._http.get(this.url+'/users')
  }

  create(user){
    return this._http.post(this.url+'/user/create',user)
  }

  delete(user_id){
    return this._http.get(this.url+'/user/delete/'+user_id)
  }

  edit(user){
    return this._http.post(this.url+'/user/update',user)
  }
  
}
