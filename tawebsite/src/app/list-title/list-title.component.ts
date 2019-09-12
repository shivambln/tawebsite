import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Htt HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-title',
  templateUrl: './list-title.component.html',
  styleUrls: ['./list-title.component.css']
})
export class ListTitleComponent implements OnInit {
  userid: any;
  username: string;
  key: string;
  // httpOptions: any = {
  //   headers: new HttpHeaders({ Authorization: localStorage.getItem('jwtToken')  })
  // };

  page = 5;
  pagenumber = 1;
  pager = {} as any;
  nextPage: number;
  searchid = '';
  sid = '';


  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute) { }
  requests: any = [];
  ngOnInit() {
  console.log( localStorage.getItem('jwtToken') );
  this.key = localStorage.getItem('key');


  if (this.key === 'true' ) {

     // this.userid = this.route.snapshot.paramMap.get('userid');
     // this.username = this.route.snapshot.paramMap.get('username');
    // this.http.get('/api/user/allpost/' + no).subscribe((response: any) => {
    //  // this.requests = response.message;
    //  this.requests = response.pageOfItems;
    //  console.log(response.pageOfItems);
    //  console.log(this.requests);
    //  // console.log(response.message);

     // });
      this.loadPage(1);
     } else {
        Swal.fire('Invalid!', 'Please login again!', 'error');

      }

  }
  onselect(id) {
  //   this.router.navigate(['post-display', id]);
  const url: string = 'post-display/' + id + '/' + this.userid + '/' + this.username ;
  this.router.navigateByUrl(url);
  }

  loadPage(pagenumber) {
    console.log(' loadpage ');
    // this.sid = searchid;

  //  console.log(this.httpOptions);
    // pagenumber = 1 ;
   // if (this.sid === '') {
    this.http.get('/api/user/allpost/' + pagenumber).subscribe((res: any) => {
    console.log('response', res);
    this.requests = res.pageOfItems;
    this.pager = res.message;

    console.log(this.pager);
    // tslint:disable-next-line: radix
    this.nextPage = parseInt(this.pager.currentPage) + 1;

    });
    console.log('Entered');
  // } else {
  //     this.http.get('/api/searchitem/' + this.sid + '/' + pagenumber ).subscribe((res: any) => {
  //     console.log(res);
  //     this.requests = res.pageOfItems;
  //     this.pager = res.pager;

  //     console.log(this.pager);
  //     // tslint:disable-next-line: radix
  //     this.nextPage = parseInt(this.pager.currentPage) + 1;
  //   });
  // }
  }

  search(searchid) {
    // console.log(searchid);
    // if (searchid === '') {
    // console.log('inside if');
    // console.log(this.pagenumber);
    // this.ngOnInit();
    // } else {
    //   console.log('Inside else');
    //   console.log(this.pagenumber);
    //   console.log(searchid);
    //   console.log('search' , searchid);
    //   // const pagenumber = 1;
    //   this.http.get('/api/searchitem/' + searchid + '/' + this.pagenumber ).subscribe((res: any) => {
    //   console.log(res);
    //   this.pageOfItems = res.pageOfItems;
    //   this.pager = res.pager;
    //   console.log(this.pageOfItems);
    //   console.log(this.pager);
    //   // tslint:disable-next-line: radix
    //   this.nextPage = parseInt(this.pager.currentPage) + 1;
    // });
    // }
  //  this.sid = searchid;
    this.loadPage(this.pagenumber);

  }
}
