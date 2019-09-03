import { Post } from './../models/post';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PostService } from 'src/app/services/post.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { HttpClient } from '@angular/common/http';
import { CustomFilePickerAdapter } from './../custom-file-picker.adapter';
import { ResponseFormat } from '../models/responseFormat';
import * as _moment from 'moment';
import {default as _rollupMoment} from 'moment';
import {MatDialog} from '@angular/material/dialog';
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import { DialogBox } from '../dialogbox/dialogbox.component';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
//run npm i @angular/material-moment-adapter
const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-editpost',
  templateUrl: './editpost.component.html',
  styleUrls: ['./editpost.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class EditpostComponent implements OnInit {
  crLabel: string;
  id: number;
  statusVal:number;
  RaisedByVal:number;
  post: ResponseFormat;
  StatusList: any = [];
  RaisedBy: any = [];
  editMode = false;
  files: any = [];
  todaydate = new Date();
  minDate = moment(this.todaydate).subtract(1,"month").toDate();
  editPostForm: FormGroup;
  adapter = new CustomFilePickerAdapter(this.http);

  constructor(private service: PostService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private dialog: MatDialog) {
    this.post = new ResponseFormat();
  }
  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
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
    });

    this.editPostForm = new FormGroup({
      'CrId': new FormControl(''),
      'CrEditId': new FormControl(''),
      'desc': new FormControl('', [Validators.required,Validators.maxLength(250), this.noWhitespaceValidator]),
      'raisedby': new FormControl('', [Validators.required]),
      'RaisedOn': new FormControl('', [Validators.required]),
      'effort': new FormControl('',[Validators.required,Validators.min(0)]),
      'total': new FormControl('',[Validators.required,Validators.min(0)]),
      'status': new FormControl(''),
      'attachment': new FormControl(''),
      'Comments': new FormControl(''),
      'ProjectId': new FormControl(''),
      'SharedWithCustomerOn': new FormControl('',[Validators.required])
    })
    let projectIdFromStorage = localStorage.getItem("projectId");
    this.setFormDefaultValues(projectIdFromStorage);

    if (this.editMode == true) {
      this.crLabel = projectIdFromStorage;
      this.crLabel = this.crLabel+'-'+ this.id;


      this.service.getPost(this.id).subscribe(responseData => {
        this.post = responseData;
        this.statusVal = this.post.Content.Result.ApprovalStatus;
        this.RaisedByVal = this.post.Content.Result.RaisedBy;
        for (let index = 0; index < this.post.Content.Result.Documents.length; index++) {
          const element = this.post.Content.Result.Documents[index];
          element.name = element.DocumentName;
          this.files.push(element)
        }
        //this.minDate = moment(this.post.Content.Result.RaisedOn).toDate();
        this.editPostForm.get("RaisedOn").clearValidators();
        this.editPostForm.setValue({
          'CrId': this.post.Content.Result.ProjectId+'-'+this.post.Content.Result.CrId,
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
  setFormDefaultValues(projectIdFromStorage){
    this.editPostForm.get('ProjectId').setValue(projectIdFromStorage);
    this.editPostForm.get('status').setValue(1001);
    this.editPostForm.get('raisedby').setValue(2002);
    this.editPostForm.get('CrEditId').setValue(0);
    this.editPostForm.get('effort').setValue(0);
    this.editPostForm.get('total').setValue(0);
    this.editPostForm.get('CrId').setValue(projectIdFromStorage);
    this.editPostForm.get('CrId').disable();
  }
  onSubmit() {
    if(this.editPostForm.status == "INVALID"){
      return true;
    }
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
      this.updatePost(post.CrId, formData)
    }
    else {
      this.createPost(formData)

    }
  }
  formatDate(dateVal){
    if(dateVal){
      return moment(dateVal).format('YYYY-MM-DDTHH:mm:ss')+"Z";
    }else{
      return "";
    }
  }
  updatePost(postId, post) {
    this.service.updatePost(postId, post)
      .subscribe(response => {
        if(response.Success == true){
            const dialogRef = this.dialog.open(DialogBox, {
              width: '32em !important',
              data: {isSuccess: true,action:"successCR",actionMessage:"updated"}
            });
            dialogRef.afterClosed().subscribe(result => {
              this.router.navigate(['/']);
            });
        }else{
          const dialogRef = this.dialog.open(DialogBox, {
            width: '32em !important',
            data: {isError: true,action:"errorCR",actionMessage:"added"}
          });
          dialogRef.afterClosed().subscribe(result => {
          });
        }
      })
  }

  cancelPost() {
    this.router.navigate(['/']);
  }
  createPost(post) {
    this.service.createPost(post)
      .subscribe(response => {
        if(response.Success == true){
          const dialogRef = this.dialog.open(DialogBox, {
            width: '32em !important',
            data: {isSuccess: true,action:"successCR",actionMessage:"added"}
          });
          dialogRef.afterClosed().subscribe(result => {
            this.router.navigate(['/']);
          });
        }else{
          const dialogRef = this.dialog.open(DialogBox, {
            width: '32em !important',
            data: {isError: true,action:"errorCR",actionMessage:"added"}
          });
          dialogRef.afterClosed().subscribe(result => {
          });
        }
      })
  }

  uploadFile(event) {
    for (let index = 0; index < event.length; index++) {
      const element = event[index];
      this.files.push(element);
    }
  }
  deleteAttachment(data) {
    const dialogRef = this.dialog.open(DialogBox, {
      width: '500px !important',
      data: {isConfirm: true,action:"deleteCR",crid:data.crId}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result != undefined){
        if(result.event == "yes"){
          this.deleteOk(data);
        }else{
          if(result.event == "no"){
            this.deleteCancelled();
          }
        }
      }
    });
  }
  deleteOk(data){
    if(data.docId != undefined){
        this.service.deleteFile(data.fileName,data.docId).subscribe(response => {
          //response.Success = true;
          if(response.Success == true){
            this.showDeleteSuccess(data);
          }else{
            const dialogRef = this.dialog.open(DialogBox, {
              width: '32em !important',
              data: {isError: true,action:"errorCR",actionMessage:"added"}
            });
            dialogRef.afterClosed().subscribe(result => {
            });
          }
        });
    }else{
      this.showDeleteSuccess(data);
    }
  }
  showDeleteSuccess(data){
    const dialogRef = this.dialog.open(DialogBox, {
      width: '32em !important',
      data: {isSuccess: true,action:"successCR",actionMessage:"added"}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.files.splice(data.index, 1);
    });
  }
  deleteCancelled(): void {
    const dialogRef = this.dialog.open(DialogBox, {
      width: '500px !important',
      data: {isCancelled: true,action:"cancelledCR"}
    });
    dialogRef.afterClosed().subscribe(result => {
    });
}

  hasError = (controlName: string, errorName: string) =>{
    return this.editPostForm.controls[controlName].hasError(errorName);
  }

  dateValue(val) {
    console.log(moment(val).format('YYYY/MM/DDTHH:mm:ss'));
  }
}
