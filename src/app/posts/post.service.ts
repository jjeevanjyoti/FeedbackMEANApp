import {Post} from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class PostService {
private posts: Post[] = [];
private postsUpdated = new Subject<Post []>();

constructor(public http:HttpClient){

}

getPosts(){
   
    this.http.get<{message:string,posts:any}>('http://localhost:5000/api/posts')
    .pipe(map((postData)=>{
        return postData.posts.map(post =>{
            return {
                title:post.title,
                content:post.content,
                id:post._id
            }
        });
    }))
    .subscribe((posts)=> {
        this.posts = posts;
        this.postsUpdated.next([...this.posts]);
    });
}
getPostUpdateListner(){
    return this.postsUpdated.asObservable();
}

addPost(title: string, content: string){
   const post: Post = {id:null,title: title, content: content};
   this.http.post<{message:string,postId:string}>('http://localhost:5000/api/posts',post)
   .subscribe((responseData)=>{
       console.log(responseData.message);
       console.log(responseData)
       const id=responseData.postId
       post.id=id;
       this.posts.push(post);
       this.postsUpdated.next([...this.posts]);

   })
   
}

deletePost(postId:string){
    console.log(postId)
    this.http.delete('http://localhost:5000/api/posts/'+postId)
    .subscribe(()=>{
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);

    })
}

}