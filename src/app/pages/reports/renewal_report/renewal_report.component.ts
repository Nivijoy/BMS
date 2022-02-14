import { Component,OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl,FormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
	selector : 'renewal_report',
	templateUrl: './renewal_report.component.html',
  // styleUrls:['./custstyle.scss'],
})

export class RenewalReportComponent implements OnInit{
	submit:boolean=false;RenewalForm;
	constructor(
	 	private alert: ToasterService,
    private router: Router
	) {}

  addNas(){
    // console.log(this.RenewalForm.value["checkbox2"])
  }
  
  ngOnInit(){
	  this.createForm();
  }
  

  createForm(){
  	this.RenewalForm=new FormGroup({
  		reseller_name:new FormControl(''),
      renewal_mang :new FormControl(''),
      start_date:new FormControl(''),
      end_date:new FormControl(''),
      user_name:new FormControl(''),
      renew_type:new FormControl(''),
      renew_state:new FormControl(''),
      renew_city:new FormControl(''),
      renew_by:new FormControl(''),

  	});
  }
}