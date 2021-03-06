import { Component, OnInit } from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {HttpService} from "../../app/http.service";
import {SocketService} from "../../app/socket.service";

declare var $: any;

@Component({
	selector: 'app-messenger',
	styleUrls:['./messenger.css'],
	templateUrl: './messenger.component.html'
})
export class MessengerComponent implements OnInit {
	socket;
    user_data: any;	
    socketService : any;
	active_chat_user = undefined;
	is_minimize = true;
	chat_initilized = 0;
	searchVal = '';
	is_request_sent = true;

	constructor(
		private sanitizer: DomSanitizer,
		private httpService: HttpService,
		private ss: SocketService) {
		var obj_this = this;
		obj_this.socketService = ss;
        var socketService = ss;
		function registerChatEventListeners()
		{           
            obj_this.user_data = socketService.user_data;
			socketService.server_events['chat_message_received'] = function (msg) {
                try{
                    //console.log('redifen chat_message_received');
                    obj_this.receiveMessage(obj_this, msg, msg.sender);
                }
                catch(er)
                {
                    console.log(er);
                }
			};
			

			if(!obj_this.user_data)
			{
				console.log("No user data is socket service yet");
				return;
			}
        }
        try{
            ss.execute_on_verified(registerChatEventListeners);
        }
        catch(er)
        {
            console.log(113, er);
        }        
    }

    call_friend(uid){        
        this.socketService.make_video_call(uid);
    }
    
	select_chat_user(target_id) {        
        var obj_this = this;     
        if(obj_this.active_chat_user &&  target_id == obj_this.active_chat_user.id)
        {
            return;
        }
        obj_this.attachments = [];
        var ww = $(window).width();
		if(ww <= 767){
            obj_this.is_mobile_device = true;
			$('.chat-container-wrppaer').attr("id","mobi-active-chat").show();
        }		
        else{
            obj_this.is_mobile_device = false;
        }
        
        obj_this.active_chat_user = obj_this.socketService.chat_users[target_id];
		//console.log(111, obj_this.active_chat_user.id, obj_this.user_data.id, 2);
        this.is_minimize = false;
        
        if(!obj_this.active_chat_user)
        {
            console.log("No user selected with "+target_id+' from ',obj_this.socketService.chat_users);
            return;
        }
        if(obj_this.active_chat_user.messages)
        {
            //obj_this.active_chat_user needed for $( ".msg_card_body") in dom
            // but will take some time to make above dom ready, so wait 10 ms please
            setTimeout(function(){
                obj_this.onUserSelected(obj_this.active_chat_user.messages, 1);
            },10)            
        }
        else{
            let args = {
                app: 'chat',
                model: 'message',
                method: 'get_friend_messages'
            }
            let input_data = {
                params: {target_id: target_id},
                args: args
            };
            var call_on_user_selected_event = function(data){
                if(!Array.isArray(data))
                {
                    data = [];
                }
                obj_this.is_request_sent = false;
                obj_this.active_chat_user.messages = [];                
                obj_this.onUserSelected(data);
            }
            input_data['no_loader'] = 1;
            obj_this.httpService.get(input_data, call_on_user_selected_event,call_on_user_selected_event);
        }		
	}

	hide_chat_box(){
		$('.chat-container-wrppaer').removeAttr("id");
    }

	onUserSelected(messages, already_fetched = 0) {
        var obj_this = this;
		$( ".msg_card_body").unbind( "scroll" );
		$(".msg_card_body").scroll(function(){
            let scroll_top = $(".msg_card_body").scrollTop();
            if(!obj_this.active_chat_user)
            {
                console.log('Invalid chat user');
                return;
            }
            if(!obj_this.active_chat_user.messages)
            {
                console.log('No chat user messages');
                obj_this.active_chat_user.messages = [];                
            }
			if(scroll_top < 2){
                get_old_messages();
			}
        });	

        function get_old_messages(){            
            obj_this.is_request_sent = false;
            if(obj_this.active_chat_user.read || obj_this.is_request_sent){                    
                return;
            }
            obj_this.is_request_sent = true;
            let params = {
                target_id: obj_this.active_chat_user.id, 
                offset: obj_this.active_chat_user.messages.length
            };

            let args = {
                app: 'chat',
                model: 'message',
                method: 'get_old_messages'
            }
            let input_data = {
                params: params,
                args: args
            };
            let on_success = function(data){
                // console.log(params.offset, data);
                if(data.length > 0) {
                    obj_this.is_request_sent = false;
                    obj_this.update_emjoi_urls(data);
                    obj_this.active_chat_user.messages = data.concat(obj_this.active_chat_user.messages);                            
                    setTimeout(function () {
                        var height = $($(".messenger-body")[data.length-1]).offset().top;
                        $(".msg_card_body").scrollTop(height);
                    }, 200);
                }
                else
                {
                    obj_this.active_chat_user.read = 1;
                }
            };
            input_data['no_loader'] = 1;
            obj_this.httpService.get(input_data, on_success, null);
        }
        //waiting because [data-emojiable=true] needs to render
        setTimeout(function(){
            var emoji_config = {
                emojiable_selector: "[data-emojiable=true]",
                assetsPath: "/static/angular/assets/emoji/images",
                popupButtonClasses: "far fa-smile"
            };            
            var emojiPicker = new window["EmojiPicker"](emoji_config);
            emojiPicker.discover();
            
            if(already_fetched != 1)
            {
                obj_this.update_emjoi_urls(messages);		     
                obj_this.active_chat_user.messages = messages;
            }
            
            obj_this.socketService.update_unseen_message_count(
                "user-selected",            
                obj_this.active_chat_user.id,
                obj_this.socketService.chat_users[obj_this.active_chat_user.id]
            );
            
            var emoji_editor = $('.emoji-wysiwyg-editor');            
            emoji_editor.unbind('keyup');            
            emoji_editor.keyup(function(e){                
				if(e.keyCode == 13 && !e.shiftKey)
				{
					obj_this.prepare_message();
				}
				$('.emoji-menu').hide();
            });

            $('#send_btn').unbind('click');
			$('#send_btn').click(function(){
				obj_this.prepare_message();
			});
            obj_this.scrollToEnd();	
        },20)                	
	}

	send_message(input_data, force_post= false){        
		try{
            let args = {
                app: 'chat',
                model: 'message',
                method: 'send'
            }
            if (force_post)
            {
                args['post'] = 1;
            }
            input_data = {
                params: input_data,
                args: args
            };
            input_data['no_loader'] = 1;
			this.httpService.post(input_data, function(data){
                //console.log(data);
                if(input_data.on_success)
                {
                    input_data.on_success(data);
                }
            }, null);
		}
		catch(er)
		{
			console.log(er, ' in sending message');
		}
    }
    
    file_change(event)
    {
        let obj_this = this;
        console.log('File Change');
        function setupReader(file) {
            var name = file.name;
            var reader = new FileReader();  
            reader.onload = function(e) {  
                let binary = e.target.result;
                obj_this.attachments.push({
                    name: name,
                    binary : binary
                });
            }
            reader.readAsText(file);
        }    
        var files = event.target.files;
        for (var i = 0; i < files.length; i++) {
            setupReader(files[i]);
        }    
    }
    
    attach_btn_click(ev)
    {
        if(!$(ev.target).is('input'))
        {
            $(ev.target).closest('.attach_btn').find('input').click();
        }        
    }
	prepare_message() {
        var obj_this = this;
        if(!obj_this.active_chat_user)
        {
            console.log('There must be some active user');
            return;
        }
        if(!obj_this.active_chat_user.messages)
        {
            console.log('Chat user must already have messages');
            obj_this.active_chat_user.messages = [];
        }
        
        var message_content = $('.emoji-wysiwyg-editor').html();
		if(message_content.endsWith('<div><br></div>'))
		{
            message_content = message_content.slice(0, -15);
            if(message_content.endsWith('<div><br></div>'))
			    message_content = message_content.slice(0, -15);
        }
        
        if (!message_content){
            $('.emoji-wysiwyg-editor').html('');
            return;
        }

        message_content = message_content.replace(/^(\s+<br( \/)?>)*|(<br( \/)?>\s)*$/gm, '');
		var input_data = {
			body: message_content,
            sender: obj_this.user_data.id,
            attachments: obj_this.attachments,
			to: obj_this.active_chat_user["id"],
            create_date: new Date(),
            no_loader: 1,
        }
        var force_post = false;
        if(obj_this.attachments.length > 0)
        {
            force_post = true;
            input_data['on_success'] = function(data){                
                let that_message = obj_this.active_chat_user.messages.filter(function(obj){
                    obj.id == data.id;
                });
                that_message.attachments = data.attachments;
            }
        }

		obj_this.send_message(input_data, force_post);
		input_data.body = obj_this.sanitizer.bypassSecurityTrustHtml(message_content);
        obj_this.active_chat_user.messages.push(input_data);        
        $('.emoji-wysiwyg-editor').html("");        
        obj_this.attachments = [];
		obj_this.scrollToEnd();
	}

	scrollToEnd() {
		setTimeout(function () {
            let message_body = $(".msg_card_body");
            if(message_body.length > 0)
            {
                message_body.scrollTop(message_body[0].scrollHeight);
            }
            else
            {
                console.log('.msg_card_body not present');
            }
		}, 10);
	}

	receiveMessage(obj_this, message, sender_id) {        
        let sender = obj_this.chat_users[sender_id];
        if(!sender)
        {
            console.log(obj_this.chat_users, ' Dev issue as '+sender_id+' not found');
            return;
        }
        message.body = obj_this.sanitizer.bypassSecurityTrustHtml(message.body);
		// var is_chat_open = obj_this.active_chat_user &&
		// 	obj_this.active_chat_user.id == sender_id &&
		// 	!this.is_minimize;
		var active_uid = parseInt($(".active_chat_user_id").html());
		var is_chat_open = $(".msg_card_body").length >0 &&
		active_uid == sender_id;
        
		if(!sender.messages)
		{
			sender.messages = [];
		}
        sender.messages.push(message);
        obj_this.socketService.update_unseen_message_count("receive-new-message", sender_id, sender);
		if (is_chat_open) {			
			
            let args = {
                app: 'chat',
                model: 'message',
                method: 'mark_read'
            }
            let input_data = {
                params: {message_id: message.id},
                args: args
            };
            input_data['no_loader'] = 1;
			obj_this.httpService.post(input_data, null, null);

            obj_this.socketService.update_unseen_message_count("read-new-message", sender_id, sender);            
            setTimeout(function(){
                obj_this.scrollToEnd();
            }, 200)
		}
    }    
    
    toggle_messenger(e)
    {
        var togglerelated = window['functions'].togglerelated;        
        togglerelated(e, $(e.target).closest('.showmouseawaybutton'), '.messenger-container'); 
    }
    update_emjoi_urls(messages)
    {
        var obj_this = this;
        
        {
            messages.forEach(element => {
                element.body = obj_this.sanitizer.bypassSecurityTrustHtml(element.body);
            });
        }
    }

    odoo_build = window['odoo'] ? 1 : undefined;
	is_mobile_device = false;
    ng_init = false;    

    remove_attachment(el){        
        let obj_this = this;                
        var i = $(el.target).closest('.doc-thumb').index();        
        obj_this.attachments.splice(i, 1);        
    }

    attachments = [];

	ngOnInit() {        
        var obj_this = this;
        $('#call_modal').keyup(function(){
            $(this).css({
                top: '6%',
                left: '10%'
            })
        });
        for(var key in obj_this.socketService.chat_users)
        {
            obj_this.socketService.chat_users[key].messages = undefined;
        }
		$(document).ready(function(){
			if($(window).width() <= 767){
                $('.chat-container-wrppaer').hide();
                obj_this.is_mobile_device = true;
            }
            else
            {
                obj_this.is_mobile_device = false;
            }            
        });
    }

    ngOnDestroy() {
        this.active_chat_user = undefined;
        // this.socketService.server_events['chat_message_received'] = function(){
        //     //alert(34233434);
        // };
    }
}