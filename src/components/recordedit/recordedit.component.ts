import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

declare var $: any;

@Component({
	styleUrls:['./recordedit.css'],
	templateUrl: 'recordedit.component.html'
})

export class RecordEditComponent implements OnInit {
	id: any;
	url: any;
	constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer) {
		window['functions'].showLoader('jangoiframe');
    }
    
	ngOnInit() {
		this.id= this.route.snapshot.params.id;
		let temp = window.location.hash.split("edit")[1]
		this.url = window['site_config'].server_base_url+"/admin"+temp+"?_popup"
		this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.url)
		$('html').css('overflow', 'hidden');
		$('#record_edit_iframe').load(function(){
			window['functions'].hideLoader('jangoiframe')
		});
	}
	ngOnDestroy() {
		$('html').css('overflow', 'auto');
	}
}
