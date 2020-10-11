import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  id: number = 0;
  listForm: FormGroup;  

  constructor(private router: Router, private route: ActivatedRoute, private api: ApiService, private formBuilder: FormBuilder, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {    
    this.listForm = this.formBuilder.group({
      'title' : ['', Validators.required]
    });

    this.id = this.route.snapshot.params['id'];
    if(this.id > 0){
      this.getList(this.id);          
    }
  }

  ngDoCheck(){
    //-- para caso clique no botão de nova lista (gambiarra pois não sei como fazer isso no angular 2)
    if(this.id != this.route.snapshot.params['id'] && this.route.snapshot.params['id'] == 0){
      this.id = this.route.snapshot.params['id'];
      this.listForm.reset();      
    }
  }

  getList(id) {
    this.loadingEvent(true);
    this.api.getList(id).subscribe(data => {
      this.listForm.setValue({
        title: data.title
      });
      this.loadingEvent(false);
    });
  }

  save(form: NgForm) {
    this.loadingEvent(true);
    if(this.id > 0){
      this.api.updateList(this.id, form).subscribe(res => {
        this.loadingEvent(false);
        this.router.navigate(['/']);
      }, (err) => {
        console.log(err);
      });
    }else{
      this.api.addList(form).subscribe(res => {
        this.loadingEvent(false);
        this.router.navigate([`/tasks/${res.id}`]);
      }, (err) => {
        console.log(err);        
      });
    }
  }

  loadingEvent(loading){
    if(loading){
      this.spinner.show();
    }else{
      this.spinner.hide();
    }
  }
}
