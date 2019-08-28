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
      downloadFile1(response);
    });
  }
  downloadFile1(t) {
    var e = t.headers.get("content-disposition").split("=")[1]
      , n = (e = e.substring(1, e.length)).split(".")[1].toLowerCase()
      , r = new Blob([t.body],{
        type: this.createFileType(n)
    });
    if (window.navigator && window.navigator.msSaveOrOpenBlob)
        window.navigator.msSaveOrOpenBlob(r);
    else {
        var i = window.URL.createObjectURL(r)
          , o = document.createElement("a");
        document.body.appendChild(o),
        o.href = i,
        o.download = e,
        o.click(),
        window.URL.revokeObjectURL(i)
    }
}
createFileType(t) {
    var e = "";
    return "pdf" == t || "csv" == t ? e = "application/" + t : "jpeg" == t || "jpg" == t || "png" == t ? e = "image/" + t : "txt" == t ? e = "text/plain" : "ppt" == t || "pot" == t || "pps" == t || "ppa" == t ? e = "application/vnd.ms-powerpoint" : "pptx" == t ? e = "application/vnd.openxmlformats-officedocument.presentationml.presentation" : "doc" == t || "dot" == t ? e = "application/msword" : "docx" == t ? e = "application/vnd.openxmlformats-officedocument.wordprocessingml.document" : "xls" == t || "xlt" == t || "xla" == t ? e = "application/vnd.ms-excel" : "xlsx" == t && (e = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"),
    e
}

}
