import { Component, Input, OnInit } from '@angular/core';
import { RouteService } from 'src/app/common-module/services/route/route.service';

@Component({
  selector: 'app-login-sso',
  templateUrl: './login-sso.component.html',
  styleUrls: ['./login-sso.component.css']
})
export class LoginSsoComponent implements OnInit {
  accessToken!: string;
  @Input() url!: string;

  constructor(private route: RouteService) {
  }

  ngOnInit(): void {
    console.log(this.accessToken);
  }

}
