import { Component, OnInit } from '@angular/core';

import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MustMatch } from '../mustmatch.validator';
import Swal from 'sweetalert2';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

@Component({
  selector: 'app-user-signup',
  templateUrl: './user-signup.component.html',
  styleUrls: ['./user-signup.component.css']
})
export class UserSignupComponent implements OnInit {

  userForm: FormGroup;
  submitted = false;
  id: string;
  name: string;
  selectedFile: File;
  error: string;

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router) {
    this.userForm = this.formBuilder.group({

      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rpassword: ['', [Validators.required]],
      myimage: ['', [Validators.required]],
      // cb: [false, Validators.requiredTrue]
      },
      {
        validator: MustMatch('password', 'rpassword')
      }
    );
  }
  get f() { return this.userForm.controls; }

  onFileChanged(event) {
    this.selectedFile  = event.target.files[0];

  }

  logFormValue() {
    this.submitted = true;
    if (this.userForm.invalid) {
      return;
  }

  //  this.id = localStorage.getItem('id');
    console.log(this.userForm.value);
    const reader = new FileReader(); // HTML5 FileReader API
    reader.readAsDataURL( this.selectedFile);
     // When file uploads set it to file formcontrol
    reader.onload = () => {
     // this.userForm.value.myimage = reader.result;
       this.userForm.value.myimage = reader.result;
     // tslint:disable-next-line: align
      console.log(reader.result);

    // tslint:disable-next-line: max-line-length
   // this.userForm.append('myFile', this.selectedFile, this.selectedFile.name);
       this.http.post('/api/signup', this.userForm.value).subscribe((response: any) => {
    console.log(response);

    this.error = response.message;
    console.log(this.error);
    if (this.error === 'email is already exist') {
      //  alert('Please enter correct password');

       Swal.fire({
         type: 'error',
         title: 'email already exit',
         text: 'Please try with different email id',
            });
          } else  {
        this.name = JSON.stringify(response.doc.username);
        console.log(this.name);

   //  console.log(this.name);
        Swal.fire (
      'signup successfull',
      this.name + ' ' + 'has been added',
      'success'
     );
        this.router.navigateByUrl('');
    }
    });
        };

  }
  resetform() {
    this.userForm.reset();

  }

  ngOnInit() {

  }


}
