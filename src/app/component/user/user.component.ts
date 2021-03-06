import { UserService } from './../../service/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  userForm:FormGroup;
  users=[];
  status="create";
  constructor(private fb:FormBuilder,private userService:UserService) { }

  ngOnInit() {
    this.userService.users().subscribe(res=>{
      this.users = this.users.concat.apply(this.users,res)
    })
    this.userForm = this.fb.group({
      _id:[],
      code:[],
      name:[],
      adress:[],
      phone:[],
      status:[],
    })
  }
  onSubmit(){
    let user = this.userForm.value;
    
    if(this.status=="create"){
      this.userService.create(user).subscribe(res=>{
        this.users.push(user)
      })
    } 
    else {
      this.userService.edit(user).subscribe((res:any)=>{
        for(let i=0;i<this.users.length;i++){
          if(this.users[i]._id==res._id){
            this.users[i]=res;
            break;
          }
        }
        this.status="create";              })
    }
    this.userForm.reset()
  }
  edit(user){
    this.status="update";
      this.userForm.patchValue(user);
  }
  delete(user_id){
    this.userForm.reset();
    this.status="create";
    this.userService.delete(user_id).subscribe((res:any) =>{
      for(let i=0;i<this.users.length;i++){
        if(this.users[i]._id==res._id){
          this.users.splice(i,1)
          break;
        }
      }
    })
  }
  getStatusText(status){
    if(status=='1')
    return 'Bật';
    else
    return 'Tắt';
  }
}
