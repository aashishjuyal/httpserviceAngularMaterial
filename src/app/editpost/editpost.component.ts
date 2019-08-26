import { Post } from './../models/post';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PostService } from 'src/app/services/post.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import * as _ from 'lodash';
import { HttpClient } from '@angular/common/http';
import { CustomFilePickerAdapter } from './../custom-file-picker.adapter';
import { ResponseFormat } from '../models/responseFormat';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';
import * as _moment from 'moment';
import {default as _rollupMoment} from 'moment';

const moment = _rollupMoment || _moment;


@Component({
  selector: 'app-editpost',
  templateUrl: './editpost.component.html',
  styleUrls: ['./editpost.component.scss']
})
export class EditpostComponent implements OnInit {
  confermationStr: string = "New post has been added.";

  isAdded: boolean = false;
  id: number;
  statusVal:number;
  RaisedByVal:number;

  post: ResponseFormat;
  StatusList: any = [];
  RaisedBy: any = [];

  editMode = false;
  posts: any = [];
  files: any = [];
  editPostForm: FormGroup;
  editData: any = [];

  adapter = new CustomFilePickerAdapter(this.http);



  constructor(private service: PostService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient) {
    this.post = new ResponseFormat();
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params["id"];
    this.editMode = this.id != null;
    this.service.getApprovedStatus().subscribe(responseData => {
      this.StatusList  = responseData.Content.Result;
    })
    this.service.getRaisedBy().subscribe(responseData => {
      for (let index = 0; index < responseData.Content.Result.length; index++) {
        const element = responseData.Content.Result[index];
        if(element.RaisedByName != ""){
          this.RaisedBy.push(element);
        }
      }
    })

    this.editPostForm = new FormGroup({
      'CrId': new FormControl(''),
      'CrEditId': new FormControl(''),
      'desc': new FormControl(''),
      'raisedby': new FormControl(''),
      'RaisedOn': new FormControl(''),
      'effort': new FormControl(''),
      'total': new FormControl(''),
      'status': new FormControl(''),
      'attachment': new FormControl(''),
      'Comments': new FormControl(''),
      'ProjectId': new FormControl(''),
      'SharedWithCustomerOn': new FormControl('')
    })
    this.editPostForm.get('ProjectId').setValue(localStorage.getItem("projectId"));
    this.editPostForm.get('CrEditId').setValue(0);
    this.editPostForm.get('CrId').disable();

    if (this.editMode == true) {
      this.service.getPost(this.id).subscribe(responseData => {
        this.post = responseData;
        this.editData = this.post.Content.Result;
        this.statusVal = this.post.Content.Result.ApprovalStatus;
        this.RaisedByVal = this.post.Content.Result.RaisedBy;
        for (let index = 0; index < this.post.Content.Result.Documents.length; index++) {
          const element = this.post.Content.Result.Documents[index];
          this.files.push(element.DocumentName)
        }
        this.editPostForm.setValue({
          'CrId': this.post.Content.Result.CrId,
          'CrEditId':this.post.Content.Result.CrId,
          'ProjectId': this.post.Content.Result.ProjectId,
          'desc':  this.post.Content.Result.ChangeDescription,
          'raisedby':  this.post.Content.Result.RaisedBy,
          'RaisedOn':  this.post.Content.Result.RaisedOn,
          'effort':  this.post.Content.Result.EffortHours,
          'total':  this.post.Content.Result.Total,
          'status':  this.post.Content.Result.ApprovalStatus,
          'SharedWithCustomerOn':  this.post.Content.Result.SharedWithCustomerOn,
          'attachment':  this.post.Content.Result.Documents,
          'Comments': this.post.Content.Result.Comments
        })

      })
    }
  }

  onSubmit() {
    let post: Post = {
      CrId:this.editPostForm.value.CrEditId,
      ProjectId:this.editPostForm.value.ProjectId,
      RaisedOn:this.formatDate(this.editPostForm.value.RaisedOn),
      RaisedBy:this.editPostForm.value.raisedby,
      ChangeDescription:this.editPostForm.value.desc,
      EffortHours:this.editPostForm.value.effort,
      Total:this.editPostForm.value.total,
      SharedWithCustomerOn:this.formatDate(this.editPostForm.value.SharedWithCustomerOn),
      ApprovalStatus:this.editPostForm.value.status,
      Comments:this.editPostForm.value.Comments
    }
    let formData: FormData = new FormData(); 
    formData.append('json', JSON.stringify(post)); 
    for (let index = 0; index < this.files.length; index++) {
      const element = this.files[index];
      formData.append('file', element); 
    }
    if (this.editMode) {
      console.log("edit");
      this.updatePost(post.CrId, formData)
    }
    else {
      console.log("Add"); 
      this.createPost(formData)

    }
    //this.editPostForm.reset();

  }
  formatDate(dateVal){
    return moment(dateVal).format('YYYY-MM-DDTHH:mm:ss')+"Z";
  }
  updatePost(postId, post) {
    this.service.updatePost(postId, post)
      .subscribe(response => {
        this.router.navigate(['/']);
      })
  }

  createPost(post) {
    this.service.createPost(post)
      .subscribe(response => {
        console.log(response);
        this.isAdded = true;
        setTimeout(() => { this.isAdded = false; }, 3000);
      })
  }

  uploadFile(event) {
    for (let index = 0; index < event.length; index++) {
      const element = event[index];
      this.files.push(element);
    }  
  }
  deleteAttachment(index) {
    this.files.splice(index, 1)
  }

  dateValue(val) {
    console.log(moment(val).format('YYYY/MM/DDTHH:mm:ss'));
  }
}
