import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Post } from './../../models/post';
import { Component, OnInit, ViewChild,Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogBox } from '../../dialogbox/dialogbox.component';



export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss']
})
export class ListingComponent implements OnInit {
  animal: string;
  isConfirm: boolean = true;
  name: string;
  dataSource: any;
  displayedColumns: string[] = ['select', 'crno', 'desc', 'raisedby', 'raisedon', 'effort', 'total', 'status','attachments', 'action'];
  selection = new SelectionModel<Post>(true, []);
  StatusList: any = [];
  RaisedBy: any = [];
  loading: boolean = true;
  showmodel: boolean = false;

  constructor(private service: PostService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog) {
    this.dataSource = [];
   
  }

  ngOnInit() {
    localStorage.setItem("projectId","2003");
    this.getAllPosts();
    this.service.getApprovedStatus().subscribe(responseData => {
      this.StatusList  = responseData.Content.Result;
    })
    this.service.getRaisedBy().subscribe(responseData => {
      this.RaisedBy  = responseData.Content.Result;
    })
    
  }

  getAllPosts() {
    this.service.getPostsList()
      .subscribe(response => {
        this.dataSource = new MatTableDataSource<Post>(response.Content.Result);

        this.loading = false;
      })

  }
  getType(typeId){
    var approvedData = this.StatusList.find(t=>t.ApprovedStatusId == typeId);
    if(approvedData){
      return approvedData.ApprovedStatusName;
    }
    return "-";
  }
  raisedByVal(raisedById){
    var ty = this.RaisedBy.find(t=>t.RaisedById == raisedById);
    if(ty){
      return ty.RaisedByName;
    }
    return "-";
  }
  deletePost(CrId) {
    this.service.deletePost(CrId)
        .subscribe(response => {
          const dialogRef = this.dialog.open(DialogBox, {
           
            data: {isSuccess: true,action:"successCR",actionMessage:"deleted"}
          });
          dialogRef.afterClosed().subscribe(result => {
            this.getAllPosts();
          });
    })
  }
  
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    let numRows = 0;
    if(this.dataSource.data != undefined){
      numRows = this.dataSource.data.length;
    }
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
  openDialog(crId): void {
    const dialogRef = this.dialog.open(DialogBox, {
      width: '500px !important',
      data: {isConfirm: this.isConfirm,action:"deleteCR",crid:crId}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result != undefined){
        if(result.event == "yes"){
          this.deletePost(result.data.crid);
        }else{
          if(result.event == "no"){
           
            this.deleteCancelled();
          }
        }
      }
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

}