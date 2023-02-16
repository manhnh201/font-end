import { Injectable } from '@angular/core';

import { saveAs } from 'file-saver';

@Injectable({
	providedIn: 'root'
})
export class FileService {

	constructor() { }

	saveFileAs(response: any) {
		var contentDisposition = response.headers.get("Content-Disposition");
		let fileName: string = 'export.pdf'
		if (contentDisposition) {
			fileName = contentDisposition.substr(contentDisposition.indexOf("filename=") + 9);
			fileName = fileName.replace(/\"/g, "");
		}
		var contentType = response.headers.get("content-type");
		var blob = new Blob([response.body], { type: contentType });
		saveAs(blob, fileName);
	}

	getFileExtension(fileName: string) {
		let fileTypeRegex: RegExp = /\.([\w]+)$/g;
		let match = fileTypeRegex.exec(fileName);
		let fileType: string = 'unknown'
		if (match != null && match.length >= 2) {
			fileType = match[1];
		}
		return fileType;
	}

	base64StringToFile(fileData: string, fileName: string, mimeType: string) {
		let bstr = atob(fileData);
		let n = bstr.length;
		let u8arr = new Uint8Array(n);

		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}

		var blob = new Blob([u8arr], { type: mimeType });
		saveAs(blob, fileName);
	}

	fileToBase64String(file: any, resolve: (data: any) => void) {
		let reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
	}

	fileToBase64StringV2(file: File): Promise<string | ArrayBuffer | null> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = error => reject(error);
		});
	}
}
