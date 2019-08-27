import { MatTableDataSource } from '@angular/material';
import { Component, OnInit, ViewChild,Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { PostService } from '../services/post.service';



export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
  styleUrls: ['dialog-overview-example.css']
})
export class DialogBox {
  action:string;
  local_data:any;
 
  constructor(
    private service: PostService,
    public dialogRef: MatDialogRef<DialogBox>,
    @Inject(MAT_DIALOG_DATA) public data:any) {
    this.local_data = {...data};
    this.action = this.local_data.action;
  }
 
  doAction(actionVal){
    this.dialogRef.close({event:actionVal,data:this.local_data});
  }
 
  closeDialog(){
    this.dialogRef.close({event:'Cancel'});
  }
  downloadFile(DocumentNameWithGuid,Id){
    this.service.downloadFile(DocumentNameWithGuid,Id)
    .subscribe(response => {
      console.log(response);
    });
    //this.fileService.downloadFile().subscribe(response => {
			//let blob:any = new Blob([response.blob()], { type: 'text/json; charset=utf-8' });
			//const url= window.URL.createObjectURL(blob);
			//window.open(url);
		//	window.location.href = response.url;
			//fileSaver.saveAs(blob, 'employees.json');
		//});
  }

}