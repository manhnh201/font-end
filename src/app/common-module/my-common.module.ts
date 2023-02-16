import { ClipboardModule } from '@angular/cdk/clipboard';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { IconsProviderModule } from '../app-module/icons-provider.module';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';

import { NgxJsonViewerModule } from 'ngx-json-viewer';

import { EditorModule } from '@tinymce/tinymce-angular';

import { DomainDetailComponent } from './components/domain/domain-detail/domain-detail.component';
import { DomainListComponent } from './components/domain/domain-list/domain-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './interceptors/jwt/jwt.interceptor';
import { ErrorInterceptor } from './interceptors/error/error.interceptor';
import { CommonInterceptor } from './interceptors/common/common.interceptor';
import { TreeViewComponent } from './components/tree-view/tree-view.component';
import { RowExpandDirective } from './directives/row-expand/row-expand.directive';
import { TranslateModule } from '@ngx-translate/core';
import { ActionButtonComponent } from './components/action-button/action-button.component';
import { InputTextComponent } from './components/domain/domain-detail/input-text/input-text.component';
import { SelectComponent } from './components/domain/domain-detail/select/select.component';
import { UploadComponent } from './components/domain/domain-detail/upload/upload.component';
import { PreviewComponent } from './components/domain/domain-detail/preview/preview.component';
import { SignParamsInterceptor } from './interceptors/sign-params/sign-params.interceptor';
import { JsonComponent } from './components/domain/domain-detail/json/json.component';
import { RowComponent } from './components/domain/domain-list/row/row.component';
import { HeaderComponent } from './components/domain/domain-list/header/header.component';
import { FilterComponent } from './components/domain/domain-list/filter/filter.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { CellComponent } from './components/domain/domain-list/cell/cell.component';

@NgModule({
  declarations: [
    DomainDetailComponent,
    DomainListComponent,
    TreeViewComponent,
    RowExpandDirective,
    ActionButtonComponent,
    InputTextComponent,
    SelectComponent,
    UploadComponent,
    PreviewComponent,
    JsonComponent,
    RowComponent,
    HeaderComponent,
    FilterComponent,
    TimelineComponent,
    CellComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    DragDropModule,

    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    NzTabsModule,
    NzGridModule,
    NzFormModule,
    NzModalModule,
    NzInputModule,
    NzSelectModule,
    NzSpinModule,
    NzMessageModule,
    NzBreadCrumbModule,
    NzDatePickerModule,
    NzNotificationModule,
    NzTableModule,
    NzDividerModule,
    NzButtonModule,
    NzCardModule,
    NzSpaceModule,
    NzInputNumberModule,
    NzSwitchModule,
    NzTimePickerModule,
    NzUploadModule,
    NzCollapseModule,
    NzToolTipModule,
    NzTreeModule,
    NzDropDownModule,
    NzProgressModule,
    NzImageModule,
    NzResultModule,
    NzTagModule,
    NzCheckboxModule,
    NzPopconfirmModule,
    NzDrawerModule,
    NzTimelineModule,

    TranslateModule, NgxJsonViewerModule, EditorModule, ClipboardModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    DragDropModule,

    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    NzTabsModule,
    NzGridModule,
    NzFormModule,
    NzModalModule,
    NzInputModule,
    NzSelectModule,
    NzSpinModule,
    NzMessageModule,
    NzBreadCrumbModule,
    NzDatePickerModule,
    NzNotificationModule,
    NzTableModule,
    NzDividerModule,
    NzButtonModule,
    NzCardModule,
    NzSpaceModule,
    NzInputNumberModule,
    NzSwitchModule,
    NzTimePickerModule,
    NzUploadModule,
    NzCollapseModule,
    NzDropDownModule,
    NzProgressModule,
    NzImageModule,
    NzResultModule,
    NzTagModule,
    NzDrawerModule,
    NzTimelineModule,

    TranslateModule, NgxJsonViewerModule, EditorModule, ClipboardModule,

    DomainListComponent,
    DomainDetailComponent,
    TreeViewComponent,
    RowExpandDirective,
    ActionButtonComponent,
    InputTextComponent,
    SelectComponent,
    UploadComponent,
    PreviewComponent,
    JsonComponent,
    RowComponent,
    HeaderComponent,
    FilterComponent,
    TimelineComponent,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: SignParamsInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: CommonInterceptor, multi: true }
  ]
})
export class MyCommonModule { }
