import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup , Validators} from '@angular/forms';
// import { CommentModule } from 'ng2-comment';
import Swal from 'sweetalert2';




@Component({
  selector: 'app-post-display',
  templateUrl: './post-display.component.html',
  styleUrls: ['./post-display.component.css']
})
export class PostDisplayComponent implements OnInit {
  requests: any = [];
  postid: any;
   numberOfLikes: any ;
   islike: any;
  userid: any;
  count: any;

  username: string;
  postId: string;
  allComment: any;
  commentcount: any;
  // tslint:disable-next-line: variable-name
  user_comment: FormGroup;
  key: string;
   dislike: any;
   numberOfDisLikes: any;


  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.user_comment = this.formBuilder.group({
      comments: ['', [Validators.required]],
    });
    // tslint:disable-next-line: radix
    this.postid = this.route.snapshot.paramMap.get('postid');
    this.userid = this.route.snapshot.paramMap.get('userid');
    this.username = this.route.snapshot.paramMap.get('username');
    console.log('postid ' + this.postid);
    console.log('userid ' + this.userid);
    this.key = localStorage.getItem('key');
    if (this.key === 'true' ) {  // if

      const httpOptions = {
        headers: new HttpHeaders({ Authorization: localStorage.getItem('jwtToken') })
      };
      this.http.post('/api/post/' + this.postid , '').subscribe((response: any) => {
      this.requests = response.message;

      console.log('work');
      console.log(response.message);

      });
      this.http.get('/api/getuserlike/' + this.postid + '/' + this.userid ).subscribe((res: any) => {
       // this.requests = response.message;

        console.log(res.totalLike);
        this.numberOfLikes = res.totalLike;
        this.islike = res.userstatus;
       // this.dislike = res.userstatus;
        });


      this.http.get('/api/getuserdislike/' + this.postid + '/' + this.userid ).subscribe((res: any) => {
          // this.requests = response.message;
          console.log('dis' + res.totaldisLike);
          console.log(res.totaldisLike);
          this.numberOfDisLikes = res.totaldisLike;
          // this.islike = res.userstatus;
          this.dislike = res.userstatus;
           });

      this.http.get('/api/getuserComment/' + this.postid).subscribe((response: any) => {
          console.log('comment api');

         //  this.allComment = response.allcomment;
          console.log('111111111111111111111111111111111', response.allComment);
          this.allComment = response.allComment;
          console.log(this.allComment);
          console.log('gdsdg', response.commentCount);
          this.commentcount = response.commentCount;
          console.log(this.commentcount);
        }); } else {
          Swal.fire('Invalid!', 'Please login again!', 'error');
          this.router.navigateByUrl('');
        }


  }
  likeButtonClick() {
    // this.numberOfLikes++;

    this.http.post('/api/userLike/' + this.userid + '/' + this.postid , '').subscribe((response: any) => {
      // this.requests = response.message;

       console.log(response);
     //  console.log(response.docs[0].like.length);
       this.dislike = response.userstatusdislike ;
       this.islike = response. userstatuslike;
       console.log(this.numberOfLikes);
       this.ngOnInit();
       });


  }

 logout() {
   // this.numberOfLikes--;
   localStorage.setItem('key', 'false');
   localStorage.removeItem('jwtToken');
   this.router.navigateByUrl('');
  }
  // tslint:disable-next-line: adjacent-overload-signatures
  dislikeButtonClick() {

   // this.numberOfLikes--;
    this.http.post('/api/userdislike/' + this.userid + '/' + this.postid , '').subscribe((response: any) => {


     //  console.log(response.docs[0].dislike.length);
     this.dislike = response.userstatusdislike ;
     this.islike = response. userstatuslike;

     console.log(this.numberOfLikes);
     //  console.log(this.numberOfDisLikes);
     this.ngOnInit();
       });


  }



  submit_comment() {
    this.count++;
    console.log(this.user_comment.value);
    console.log(this.postid);
   // const x = localStorage.getItem('user');


    // tslint:disable-next-line: max-line-length
    this.http.post('/api/usercomment/' + this.username + '/' + this.postid + '/' + this.user_comment.value.comments  , '').subscribe((response) => {
      console.log(response);
      });
    this.ngOnInit();
    console.log('hjjjjjjjjjjjjjjjjv');
    console.log('comment_count', this.count);
  }


}
