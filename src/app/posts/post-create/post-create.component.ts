import { Component, OnInit} from '@angular/core';
import {Post} from '../post.model';
import {NgForm, FormGroup, FormControl, Validators} from '@angular/forms';
import { PostService } from '../post.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit{

    private mode = 'create';
    private postId = 'postId';
    private post : Post ;
    form : FormGroup;
    isLoading = false;
    constructor(public postService: PostService , public route:ActivatedRoute, public router: Router) {

    }

    ngOnInit() {
      this.form = new FormGroup({
          title:new FormControl(null,{validators:[Validators.required,Validators.minLength(3)]}),
          content:new FormControl(null,{validators:[Validators.required]})
      });
      this.route.paramMap.subscribe((paramMap:ParamMap)=>{
          if(paramMap.has('postId')){
              this.mode= 'edit';
              this.postId = paramMap.get('postId');
              this.isLoading = true;
              this.postService.getPost(this.postId).subscribe(postData=>{
                this.isLoading = false;
                this.post = {id :postData._id,title:postData.title,content:postData.content};
                this.form.setValue({title:this.post.title,content:this.post.content}); 
              });
          } else {
            this.mode = 'create';
            this.postId = null ;
          }
      });
    }

    onAddPost(form: NgForm) {
        if (form.invalid) {
          return;
        }
        this.isLoading = true;
        if (this.mode === 'create') {
          this.postService.addPost(form.value.title, form.value.content);
        } else {
          this.isLoading = false;
          this.postService.updatePost(
            this.postId,
            form.value.title,
            form.value.content
          );
          this.router.navigate(['/']);

        }


        form.resetForm();
      }

}
