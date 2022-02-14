import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CustService } from '../../_service/indexService';

@Component({
	selector: 'success',
	templateUrl: './add-success.component.html'
})

export class AddSuccessComponent implements OnInit {
	submit: boolean = false; item; modalHeader; add_res; edit_res;voice_res;limit_flag
	constructor(
		private alert: ToasterService,
		private ser: CustService,
		private router: Router,
		public activeModal: NgbActiveModal,

	) { }

	closeModal() {
		//   console.log(this.edit_res)
		this.activeModal.close(true);
		if (this.item[0]['error_msg'] == 0) {
			if (this.add_res == true) {
				this.router.navigate(['/pages/cust/custList']);
			}
			if (this.edit_res == true) {
				this.router.navigate(['/pages/cust/custList']);
			}
			if (this.limit_flag == true){
			   this.router.navigate(['/pages/cust/custList']);
			}
			if (this.edit_res == false) {
				this.router.navigate(['/pages/cust/viewcust']);
			}
		}
	}

	ngOnInit() {


	}
}

