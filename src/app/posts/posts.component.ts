import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostService } from '../services/post.service';
import { ListingComponent } from '../component/listing/listing.component';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {
  //@ViewChild('form', { static: true }) inputPostForm: NgForm;
  posts: any;
  StatusList: any = [];
  constructor(private service: PostService,
    private router: Router,
    private route: ActivatedRoute,
    private listing: ListingComponent) {
    this.posts = [];
  }

  getAllPosts() {
    this.service.getPostsList()
      .subscribe(response => {
        this.posts = response;
        //console.log(this.posts);
      })

  }
  public doFilter(value): void {
    this.listing.doFilter(value);
  }
  // deletePost(post) {
  //   //console.log(post);
  //   if (confirm('Are you sure?')) {
  //     this.service.deletePost(post.id)
  //       .subscribe(response => {
  //         this.getAllPosts();
  //       })
  //   }
  // }

  nvaigateToAdd() {
    this.router.navigate(['addPost'], { relativeTo: this.route });
  }

  trackPost(index, post) {
    return post ? post.id : undefined;
  }

  ngOnInit() {
    this.getAllPosts();

    //compunnal  example
    this.service.getApprovedStatus().subscribe(responseData => {
      this.StatusList  = responseData.Content.Result;
      //console.log(responseData.Content.Result);
      //console.log(responseData);
    })
  }
}
