import { NgModule} from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { AdminRoutingModule, routedComponents } from './administration.routing';
import { ToasterModule } from 'angular2-toaster';
import { CompanyService } from './../_service/companyservice';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { AutoCompleteNModule } from '../auto-complete-module/auto-completen-module';
import {
  GroupService, BusinessService, ResellerService, RoleService, AdminuserService,
  UserLogService, ReportService, NasService
} from '../_service/indexService';
import { TreeModule } from 'angular-tree-component';
import { AddStaticIPComponent } from './add-staticip/addstaticip.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { EmailTemplatesComponent } from './email-templates/email-templates.component';
// import { CKEditorModule} from 'ckeditor4-angular';
import { CKEditorModule} from 'ng2-ckeditor';
import { SmstemplatesComponent } from './smstemplates/smstemplates.component';
import { Ng2SmartTableModule } from 'ngx-smart-table';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SmstemplateIspComponent } from './smstemplate-isp/smstemplate-isp.component';
import { EmailtemplateIspComponent } from './emailtemplate-isp/emailtemplate-isp.component';
import { AddOTTComponent } from './add-ott/add-ott.component';
import { NgxLoadingModule } from 'ngx-loading';
// import { OttcountComponent } from './ottcount/ottcount.component';
import { ShareModule } from '../sharemodule/share.module';
import { filterModule } from './../filter/filter-module';


  
@NgModule({
  imports: [
    ThemeModule,
    ToasterModule.forRoot(),
    AdminRoutingModule,
    AutoCompleteNModule,
    TreeModule,
    OwlDateTimeModule, OwlNativeDateTimeModule,
    Ng2SmartTableModule,
    CKEditorModule,
    NgxLoadingModule.forRoot({}),
    ShareModule,
    filterModule
    ],
  declarations: [
    routedComponents,
    ChangepasswordComponent,
    AddStaticIPComponent,
    EmailTemplatesComponent,
    SmstemplatesComponent,
    SmstemplateIspComponent,
    EmailtemplateIspComponent,
    AddOTTComponent,
    // OttcountComponent,
    //  ReadonlyDirective,

  ],
  entryComponents: [
    ChangepasswordComponent,
    AddStaticIPComponent,
    AddOTTComponent,
    // OttcountComponent
  ],
  providers: [CompanyService, GroupService, AdminuserService, NasService,
    RoleService, BusinessService, ResellerService, UserLogService, ReportService, NgbActiveModal],
})


export class AdminModule { }