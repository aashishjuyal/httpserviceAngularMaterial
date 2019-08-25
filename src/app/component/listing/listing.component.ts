import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Post } from './../../models/post';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss']
})
export class ListingComponent implements OnInit {
  dataSource: any;
  displayedColumns: string[] = ['select', 'crno', 'desc', 'raisedby', 'raisedon', 'effort', 'total', 'status','attachments', 'action'];
  selection = new SelectionModel<Post>(true, []);
  StatusList: any = [];
  RaisedBy: any = [];

  constructor(private service: PostService,
    private router: Router,
    private route: ActivatedRoute) {
    this.dataSource = [];
   
  }

  ngOnInit() {
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
    //console.log(post);
    
    if (confirm('Are you sure?')) { // proper popup
      this.service.deletePost(CrId)
        .subscribe(response => {
          if(response.Success == true){
            //show success message
             this.getAllPosts();
          }
          else{
            // show error message
          }
         
        })
    }
  }
  
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected;
    const numRows = this.dataSource.data;
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


}
