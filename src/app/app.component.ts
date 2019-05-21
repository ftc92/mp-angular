import { Component } from '@angular/core';
import {SocketService} from './socket.service';
declare var $:any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',    
})

export class AppComponent {        
    constructor(private ss: SocketService)
    {
        this.socketService = ss;        
    }
    socketService: SocketService;

	topFunction() {        
		document.body.scrollTop = 0;
		$("html, body").animate({ scrollTop: 0 }, 600);
	}

	scrollFunction() {
        if(window['odoo'])
            return;
		if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
			document.getElementById("backTop").style.display = "block";
		} else {
			document.getElementById("backTop").style.display = "none";
		}
    }
    
    odoo_build = window['odoo'] ? 1 : undefined;
    ngOnInit() {
        var obj_this = this;
        window.onscroll = function() {obj_this.scrollFunction()};        
    }
}
