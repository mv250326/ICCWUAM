import { Component, OnInit, ViewChild,AfterViewInit } from '@angular/core';
import { user } from './users';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators'
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';





/**
 * @title Flex table where one column's cells has a greater height than others.
 */

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit{
  title = 'AngularHttpRequest';
  allusers: user[] = [];
  selection = new SelectionModel(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private http: HttpClient){

  }

  ngOnInit(){
    this.fetchusers();
    
  }

  ngAfterViewInit() {
    
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onUsersFetch(){
    this.fetchusers();
  }

  dataSource: any;

  private fetchusers (){
    this.http.get('https://table-c9401-default-rtdb.asia-southeast1.firebasedatabase.app/users.json')
    .pipe(map((res)=>{
      const users = [];
      for(const key in res){
        if(res.hasOwnProperty(key)){
        users.push({...res[key],id:key})
      }
    }
    return users;

    }))
    .subscribe((users)=>{
        
    console.log(users);
    this.allusers=users;
    this.dataSource= new MatTableDataSource(this.allusers)
    
    });
  }

  onDeleteUser(id:string){
    this.http.delete('https://table-c9401-default-rtdb.asia-southeast1.firebasedatabase.app/users/'+id+'.json')
    .subscribe((res)=>{
      this.ngOnInit();
    });
    
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: user): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }



  displayedColumns: string[] = ['select','id','name', 'number', 'company','actions'];
  
}