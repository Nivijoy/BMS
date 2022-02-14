import 'style-loader!angular2-toaster/toaster.css';
import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminuserService, DashboardService } from '../../../pages/_service/indexService';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Md5 } from 'ts-md5/dist/md5';

@Component({
  selector: 'ngx-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss']
})

export class searchbarcomponent implements OnInit {
  submit: boolean = false; AddNasForm; datas; id; sflag = '1';
  search = ''; limit: number = 10;

  constructor(

    public activeModal: NgbActiveModal,
    private alert: ToasterService,
    private ser: AdminuserService,
    private router: Router,
    private dash: DashboardService
  ) { this.id = JSON.parse(localStorage.getItem('details')); }

  closeModal() {
    this.activeModal.close();
  }

  async ngOnInit() {
    await this.searchresult('');
  }

  async searchresult($event='') {
    // console.log(this.sflag)
    // console.log($event)
    let result = await this.dash.search({ sflag: this.sflag, like: $event })
    this.datas = result;
    // console.log(result)
  }

  searchclick() {
    if (this.search) {
      localStorage.setItem('details', JSON.stringify(this.search));
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
        this.router.navigate(['/pages/cust/viewcust']));
      this.closeModal();

    }
  }
}