import { Component,OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl,FormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
	selector : 'reseller_revenuesharing',
	templateUrl: './reseller_revenuesharing.component.html',
  // styleUrls:['./custstyle.scss'],
})

export class ResellerRevenueSharingComponent implements OnInit{
	submit:boolean=false;RevenueSharingForm;
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
  	this.RevenueSharingForm=new FormGroup({
  		revenue_name:new FormControl(''),
      revenue_date :new FormControl(''),
      revend_date:new FormControl(''),
      rev_name:new FormControl(''),
      rev_type:new FormControl(''),
      
  	});
  }
}