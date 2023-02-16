import { Injectable } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MD5 } from 'crypto-js';
import { CommonService } from '../common/common.service';

@Injectable({
	providedIn: 'root'
})
export class RouteService {

	public static readonly signAlias: string = '__s';
	public static readonly transactionTimeAlias: string = '__t';
	public static readonly fromStateAlias: string = '__f';
	/**
	 * Thời gian hiệu lực của đường link theo milliseconds
	 */
	public static readonly transactionTimeExpire: number = 60000;

	constructor(private router: Router, private commonService: CommonService,
		private route: ActivatedRoute) {
	}

	get queryParams(): Params {
		return this.route.snapshot.queryParams;
	}

	calSign(queryParams: any = {}, key: string = "") {
		let queryParamsWithoutSign: string[] = [];
		Object.keys(queryParams).forEach(function (_key) {
			if (_key !== RouteService.signAlias)
				queryParamsWithoutSign.push(`${_key}=${queryParams[_key]}`);
		})
		// queryParamsWithoutSign.push['key'] = key;
		let _queryParamsWithoutSign = queryParamsWithoutSign.join('&');
		let sign = MD5(_queryParamsWithoutSign).toString();
		return sign;
	}

	checkSign(queryParams: any = {}, key: string = "") {
		let currentTime: number = Date.now();
		if (!queryParams[RouteService.transactionTimeAlias] || parseInt(queryParams[RouteService.transactionTimeAlias]) + RouteService.transactionTimeExpire < currentTime) {
			return false;
		}
		let sign = this.calSign(queryParams, key);
		return sign === queryParams[RouteService.signAlias];
	}

	routerNavigate(commands: any[], queryParams: any = {}, blank: boolean = false) {
		if (!queryParams[RouteService.fromStateAlias]) {
			queryParams[RouteService.fromStateAlias] = this.router.routerState.snapshot.url.split('?')[0];
		}
		if (!queryParams[RouteService.transactionTimeAlias]) {
			queryParams[RouteService.transactionTimeAlias] = Date.now();
		}
		queryParams[RouteService.signAlias] = this.calSign(queryParams);
		if (blank) {
			let url = this.router.serializeUrl(this.router.createUrlTree(commands, { queryParams: queryParams }));
			let baseUrl = window.location.href.replace(this.router.url, '');
			window.open(baseUrl + url, '_blank');
		} else {
			this.router.navigateByUrl('', { skipLocationChange: true }).then(() => this.router.navigate(commands, { queryParams: queryParams }));
		}
	}

	routeToPreviousPage(queryParams: any = {}) {
		let previousPage = this.route.snapshot.queryParamMap.get(RouteService.fromStateAlias)
		previousPage = previousPage ? previousPage : '/'
		this.router.navigateByUrl('', { skipLocationChange: true }).then(() => this.routerNavigate([previousPage], { queryParams: queryParams }));
	}

	navigateToLogin() {
		this.commonService.closeAllDetailFormModal();
		this.router.navigate(['login']);
	}
}
