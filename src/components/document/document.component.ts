import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import {SocketService} from "../../app/socket.service";
import {HttpService} from "../../app/http.service";

declare var $: any;

@Component({
    selector: 'app-document',
    templateUrl: './document.component.html'
})
export class DocumentComponent implements OnInit {

    page_num = 1;
    doc_data: any;    
    total_pages = 0;
    annot_hidden = false;
    socketService : SocketService
    constructor(private route: ActivatedRoute,
				private ss:SocketService,
                private httpService: HttpService,
                private router: Router) {
		this.socketService = ss;
        this.route.params.subscribe(params => this.loadDoc());
    }

	changePage(pageToMove){
		this.total_pages = $('.page-count').html();
		if(pageToMove < 1 || pageToMove > this.total_pages)
			this.page_num = pageToMove = 1;

		if(pageToMove == 1)
			$('.page-prev-btn').attr("disabled", "disabled");
		else
			$('.page-prev-btn').removeAttr('disabled');

		if(pageToMove == this.total_pages)
			$('.page-next-btn').attr("disabled", "disabled");
		else
			$('.page-next-btn').removeAttr('disabled');
		$('#viewer-wrapper').scrollTop($('.pdfViewer .page:first').height()* (pageToMove - 1)+50)
	}

	hint() {
		$('.search-bar-container .search-hint-text').css("display", "none").fadeIn(700);
	}
	unhint() {
		$('.search-bar-container .search-hint-text').hide();
	}

	toggleAnnotations(){
		this.annot_hidden = !this.annot_hidden;
		window['show_annotation'] = !window['show_annotation']
		$('.annotation_button').toggle();
		$('.annotationLayer').toggle();
	}

    go_to_parent_url()
    {
        var obj_this = this;
        var parent_url = localStorage.getItem('previous_url');
        var curl = window['pathname'];
        if(parent_url.endsWith('login'))
        {
            parent_url = '/#/';
        }
        else if(parent_url)
        {
            obj_this.router.navigate([parent_url]);
        }
    }

    loadLibs(libs_container){
        var prefix = 'static/angular/assets/annotator';        
        var libs = '';
        libs += '<link href="' + prefix + '/shared/pdf.viewer.css" rel="stylesheet" type="text/css"  />';        

        libs += '<link href="' + prefix + '/css/toolbar.css" rel="stylesheet" type="text/css" />';
        libs += '<link href="' + prefix + '/css/custom.css" rel="stylesheet" type="text/css" />';

        libs += '<script src="' + prefix + '/shared/pdf.viewer.js"></script>';
        libs += '<script src="' + prefix + '/shared/rt_clipboard.js"></script>';
        libs += '<script src="' + prefix + '/shared/color.js"></script>';
        libs += '<script src="' + prefix + '/shared/jsonlib.js"></script>';
        
        libs += '<script src="' + prefix + '/modules/m0.js"></script>';
        libs += '<script src="' + prefix + '/modules/m1.js"></script>';
        libs += '<script src="' + prefix + '/modules/m2.js"></script>';
        libs += '<script src="' + prefix + '/modules/m3.js"></script>';
        libs += '<script src="' + prefix + '/modules/m4.js"></script>';

        libs += '<script src="static/angular/assets/libs/js/jquery.mark.min.js"></script>';
        libs += '<script src="static/angular/assets/libs/js/mark.min.js"></script>';
        
        
        libs += '<script src="' + prefix + '/js/main.js"></script>';
        libs += '<script src="' + prefix + '/js/annotator.js"></script>';

        $(libs_container).removeAttr('uninitialized');
        $(libs_container).append(libs);
    }

    loadDoc(){
        var obj_this = this;
		window['show_annotation'] = false;
        window['functions'].showLoader('loaddocwaiter');
        var back_btn = $('.topbar .icon.back');
        back_btn.unbind('click');
        back_btn.click(function() {
            obj_this.go_to_parent_url();
        });
        obj_this.onLibsLoaded();
    }

    doc_models = {

    }

    active_parent_notification = undefined;
    onLibsLoaded()
    {
        var obj_this = this;        
        var doc_type = obj_this.route.snapshot.params.doc_type;        
        let doc_id = obj_this.route.snapshot.params.res_id;
        let point_id = undefined;
        
        
        let args = {
            app: 'documents',
            model: 'File',
            method: 'get_binary'
        }
        var input_data = {            
            args: args,
            params: {id : doc_id}
        };  
        if(obj_this.route.toString().indexOf('discussion') > -1)
        {
            point_id = doc_id;
            input_data = {            
                args: args,
                params: {id : doc_id}
            }; 
        }      

        var renderDoc = function(data){
            obj_this.doc_data = data;
            var doc_data = {
                doc:data.doc, 
                id: doc_id, 
                first_time: 1, 
                // type : doc_type,
                type : data.type,
                attendees: data.attendees,
                mp_signature_status:data.mp_signature_status
            };
            if (data.excel){
                $('app-document .excel_doc').append(data.doc).show()
                $('.loadingoverlay').hide();
            }
            else{
                window['pdf_js_module'].render(doc_data);
            }
            
            var c_path = window['pathname'];
            $('.notification-list:first .list-group-item[ng-reflect-router-link="'+c_path+'"]').addClass('active');                
        };
        if(!doc_type){
            //console.log("No doc_type");
            return;
        }
        obj_this.httpService.get(input_data,renderDoc, function(){
            window['functions'].hideLoader('loaddocwaiter');
        });        
    }

    ngOnInit() {
        var obj_this = this;
		var content = $("#content-wrapper");
		var results;
		var currentClass = "current";
		var offsetTop = 50;
        var currentIndex = 0;
        
        var obj_this = this;
		$('#viewer-wrapper').scroll(function() {
			var scroll = $(this).scrollTop();
			if(scroll == 0 )
				scroll = 1;
			obj_this.page_num = Math.ceil(scroll / $('.pdfViewer .page:first').height());
			if(obj_this.page_num == 1)
				$('.page-prev-btn').attr("disabled", "disabled");
			else
				$('.page-prev-btn').removeAttr('disabled');

			if(obj_this.page_num == $('.page-count').html())
				$('.page-next-btn').attr("disabled", "disabled");
			else
				$('.page-next-btn').removeAttr('disabled');
		});
    }
}
