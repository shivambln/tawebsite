import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AuthService } from 'angularx-social-login';
import { SocialUser } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider, LinkedInLoginProvider } from 'angularx-social-login';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-client-login',
  templateUrl: './client-login.component.html',
  styleUrls: ['./client-login.component.scss']
})
export class ClientLoginComponent implements OnInit {
  loginForm: FormGroup;
  data: any;
  Swal: any;
  // tslint:disable-next-line: ban-types
  baseUrl: String;
  userid: any;
  username: any;
  token: any;
  user: SocialUser;
  message: any;

  constructor(private formBuilder: FormBuilder, private router: Router, private http: HttpClient, private authService: AuthService) {
    // tslint:disable-next-line: no-unused-expression
    // this.baseUrl: 'http://10.11.4.54:3000';
  }

  ngOnInit() {
    // const useridentify = localStorage.getItem('user');
    // if (useridentify === '1') {
    // this.router.navigateByUrl('home');
    // } else {
    // this.router.navigateByUrl('');
   


    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
      });
      }




  onclick(data) {
    console.log('<<<<<<<>>>>>>>>', data);
    this.http.post('/api/login', this.loginForm.value).subscribe((response: any) => {
        localStorage.setItem('key', 'true');
        localStorage.setItem('objectid', response.object );
        console.log('objectid'+ ' '+ response.object)
        this.token = response.token;
        localStorage.setItem('jwtToken', this.token);
  //     // start
      // tslint:disable-next-line: prefer-const
      // let message = response;
        if (response === 'password missmatch') {
        // alert('Please enter correct password');
        Swal.fire('Wrong Password!', 'Please Enter correct password!', 'error');
        console.log('response', response);
        return;
      } else if ( response === 'email does not exist') {
  //       // alert('User not Found');
        Swal.fire('User Not Found', 'Please Enter Correct Username And Password!', 'error');
        console.log('response', response);
        return;
      }
        // this.userid = response.doc._id;
        // this.username = response.doc.username;
        console.log(this.userid);
        // const url: string = 'list/' + this.username + '/' + this.userid ;
        const url = 'list' ;
        this.router.navigateByUrl(url);
      });

  }
  ongoogle() {
    this.http.get('/api/auth/google').subscribe((response: any) => {
      console.log(response);
      this.userid = response.doc._id;
      this.username = response.doc.username;
      console.log(this.userid);
      const url: string = 'list/' + this.username + '/' + this.userid ;
    //  this.router.navigateByUrl(url);
      });

  }


  signInWithGoogle(): void {

     this.authService.authState.subscribe((user) => {
      this.user = user;
      console.log(user);
    });
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(x => { console.log(x);
      // tslint:disable-next-line: align
      this.http.post('/api/sociallogin', x).subscribe((response: any) => {
        localStorage.setItem('key', 'true');
        console.log(response);
        localStorage.setItem('jwtToken', response.token);
       // this.message = response.message;

        console.log(response.token);
        const url = 'list' ;
        this.router.navigateByUrl(url);
     //   const url: string = 'list/' + this.username + '/' + this.userid ;
      //  this.router.navigateByUrl(url);
        });


    } );
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(x => console.log(x));
  }

  signInWithLinkedIn(): void {
    this.authService.signIn(LinkedInLoginProvider.PROVIDER_ID).then(x => console.log(x));
  }

  signOut(): void {
    this.authService.signOut();
  }
}
