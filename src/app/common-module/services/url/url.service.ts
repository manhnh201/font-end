import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class UrlService {
	static IMG_EXT = ['png', 'jpg', 'jpeg', 'svg'];
	static OFFICE_EXT = ['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'];

  constructor(private sanitizer: DomSanitizer) { }

  tryParseVideoLink(link: any, bypassSecurity: boolean = true) {
		if (link === undefined) return link;
		let _link;
		if (link.includes('youtube.com')) {
			_link = link;
			if (!link.includes('embed')) {
				let queryString = this.parseQueryString(link)
				_link = `https://www.youtube.com/embed/${queryString['v']}`
			}
		} else {
			_link = link;
		}
		if (bypassSecurity) {
			_link = this.sanitizer.bypassSecurityTrustResourceUrl(_link);
		}
		return _link;
	}

	tryParseLinkURL(link: any) {
		if (link === undefined) return link;
		let _link
		let isImg: boolean = false;
		UrlService.IMG_EXT.forEach((ext: string) => {
			isImg = isImg || link.endsWith(ext)
		})
		_link = link;
		if (!isImg)
			_link = this.sanitizer.bypassSecurityTrustResourceUrl(_link)
		return _link
	}

	parseQueryString(query: string) {
		var vars = query.split("?");
		if (vars.length == 1) return {};
		vars = vars[1].split("&");
		var query_string: any = {};
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split("=");
			var key = decodeURIComponent(pair[0]);
			var value = decodeURIComponent(pair[1]);
			// If first entry with this name
			if (query_string[key] === undefined) {
				query_string[key] = decodeURIComponent(value);
				// If second entry with this name
			} else if (typeof query_string[key] === "string") {
				var arr = [query_string[key], decodeURIComponent(value)];
				query_string[key] = arr;
				// If third or later entry with this name
			} else {
				query_string[key].push(decodeURIComponent(value));
			}
		}
		return query_string;
	}
}
