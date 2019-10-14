import { Component, OnInit, OnDestroy  } from '@angular/core';
import {Post} from '../post.model';
import { PostService } from '../post.service';
import {Subscription} from 'rxjs';
@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit , OnDestroy{
    // posts = [
    //     {title: 'first post', content: 'first  post information'},
    //     {title: 'second post', content: 'second  post information'},
    //     {title: 'third post', content: 'third  post information'}
    // ];
     posts: Post[]  = [];
     private postSub: Subscription;
     isLoading = false;

     constructor(public postService: PostService){

     }

     ngOnInit(){
        this.isLoading = true;
        this.postService.getPosts();
        this.postSub = this.postService.getPostUpdateListner().subscribe((posts: Post[])=>{
            this.isLoading = false;
            this.posts = posts;
        });
     }
     
     onDelete(id :string){
     this.postService.deletePost(id);
     }

     ngOnDestroy(){
         this.postSub.unsubscribe();
     }


}