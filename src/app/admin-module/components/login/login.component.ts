import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/common-module/services/auth/auth.service';
import { CommonService } from 'src/app/common-module/services/common/common.service';
import { MessageService } from 'src/app/common-module/services/message/message.service';
import { RouteService } from 'src/app/common-module/services/route/route.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  environment: any = environment;

  validateForm!: FormGroup;

  constructor(private fb: FormBuilder,
    private authService: AuthService, private routeService: RouteService, private commonService: CommonService, private message: MessageService) {
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      this.commonService.addTotalRequest();
      this.authService.login(this.validateForm.value['username'], this.validateForm.value['password']).subscribe({
        next: (resp) => {
          this.commonService.addCompletedRequest();
          location.reload();
        }, error: (reason: any) => {
          this.commonService.addCompletedRequest();
          this.message.create('error', 'Tài khoản hoặc mật khẩu không đúng');
        }, complete: () => {
        }
      })
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });
    if (!this.authService.needLogin()) {
      this.routeService.routerNavigate(['']);
      return;
    }
  }
}
