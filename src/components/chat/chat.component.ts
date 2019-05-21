import { Component, OnInit } from "@angular/core";
import { SocketService } from "../../app/socket.service";
import { DomSanitizer } from '@angular/platform-browser';
import { HttpService } from "../../app/http.service";
declare var $: any;

@Component({
    selector: "app-chat",
    styleUrls:['./notification.css'],
	templateUrl: "./chat.component.html",	
})
export class ChatComponent implements OnInit {
	// socket;
	// user_data: any;
	socketService : any;
    constructor(
        private sanitizer: DomSanitizer,
        private httpService: HttpService,
		private ss: SocketService) {
		var obj_this = this;
        obj_this.socketService = ss;        
    }
    odoo_build = window['odoo'] ? 1 : undefined;

	close_right_panel() {
		$(".right-panel").hide();
    }

    toggle_notifications(e)
    {
        var togglerelated = window['functions'].togglerelated;        
        togglerelated(e, $(e.target).closest('.showmouseawaybutton'), '.container.notification-list'); 
    }
    
	ngOnInit() {                
        var obj_this = this;
        var route = window['pathname'];
        if(route == '/chat')
        {            
            //console.log("Loaded as route");
            $('body').css('background-color','transparent');
            $('.main-user-navbar').css({'padding-top': '8px'});
        }
        else
        {
            //console.log("Loaded in app");
        }
    }
}