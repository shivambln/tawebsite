import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserSignupComponent } from './user-signup/user-signup.component';
import { UnknownrouteComponent } from './unknownroute/unknownroute.component';
import { ListTitleComponent } from './list-title/list-title.component';
import { PostDisplayComponent } from './post-display/post-display.component';
import { ClientLoginComponent } from './client-login/client-login.component';


const routes: Routes = [
  // { path: '', component: LoginComponent },
  // { path: 'home', component: HomeComponent },
  { path: 'signup', component: UserSignupComponent},
  { path: 'list', component: ListTitleComponent},
  { path: 'post-display/:postid/:userid/:username', component: PostDisplayComponent},
  { path: '', component: ClientLoginComponent},
  { path: '**', component: UnknownrouteComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
