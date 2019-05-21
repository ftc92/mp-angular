import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
declare var $;

@Injectable()
export class SocketService {
    
    io: any;
    socket:any;
    user_data:any;
    chat_users = {};
    keys_chat_users = [];
    server_url = '';
    media_url = '';
    on_verified = [];
    verified = false;
    iframe_url = true;
    current_route = '';
    not_public_url = 0;
    server_events = {};
    unseen_messages = 0;
	notificationList = [];
    current_id = undefined;	    
    site_config = undefined;
    current_model = undefined;
    user_photo = '';
    active_call = false;
    active_parent_notification = undefined;

    constructor(private router: Router, route: ActivatedRoute) {                
        var obj_this = this;
        if(!window['socket_manager'])
        {
            window['socket_manager'] = obj_this;            
        }
        this.site_config = window['site_config'];
        this.server_url = this.site_config.server_base_url;
        this.media_url = this.server_url + '/media';
        this.user_photo = this.media_url + '/profile/ETjUSr1v2n.png';
        var url = window['pathname'];
        var res = window['public_routes'].indexOf(url);
        if(res == -1)
        {            
            try
            {
                var user_cookie = localStorage.getItem('user');                
                let cuser = undefined;
                if(user_cookie)
                {
                    cuser = JSON.parse(user_cookie);
                }
                else
                {                    
                    window['functions'].go_to_login();
                }
                if(cuser && cuser.token)
                {
                    obj_this.connect_socket(cuser);
                }
                else
                {
                    window['functions'].go_to_login();
                }
            }
            catch(er)
            {
                console.log('Failed socket exception ',er)
            }
        }
        else
        {
            $('#main-div').show();
        }
    }

    connect_socket(authorized_user){
        var obj_this = this;
        if(!authorized_user)
        {            
            console.log('Not authorized');
            return;
        }
        $('#main-div').show();
        obj_this.user_data = authorized_user;        

        let complete_server_url = obj_this.site_config.chat_server+'/sio';
        obj_this.socket = window['io'].connect(complete_server_url,{
            reconnection: false,
            transports: ['websocket'],
            reconnectionDelay: 2000,
            reconnectionDelayMax : 5000,
            reconnectionAttempts: 2,
        }).on('connect_error', function (err) {
            console.log('Socket connection failed '+complete_server_url+' please run socket server is up');
        });
                   
        obj_this.socket.on('connect',function(){
            obj_this.socket.off('server_event');            
            authorized_user.socket_id = obj_this.socket.id;
            var socket_error = socket_error = "Socket connection not established at "+ obj_this.site_config.chat_server + ' because ';            
            $.ajax({
                url: obj_this.site_config.chat_server+'/verify_socket',
                data: authorized_user,
                beforeSend:function(a, b){
                    // console.log(b.url);
                },
                success: function(data){
                    if(data && !data.error)
                    {
                        socket_error = '';
                        onAuthenticated(data.data);
                    }
                    else if(data.error)
                    {
                        // obj_this.user_data = undefined;
                        console.log(data.error+' for ', authorized_user);
                        socket_error += data.error;
                    }
                    else
                    {
                        socket_error += ' no response';
                    }
                },
                error:function(a, b){
                    socket_error += b.responseText;             
                },
                complete:function(){
                    if(socket_error)
                    {
                        console.log(socket_error);
                    }                    
                }
            })
            function onAuthenticated(data) {
                if(data.user && data.friends)
                {
                    
                }
                else{
                    console.log('invalid user data ', data);
                    return;
                }
                console.log("Authenticated\n\n");
                obj_this.user_data.photo = data.user.photo;
                obj_this.user_photo = obj_this.server_url + data.user.photo;
                obj_this.verified = true;
                if(!data.unseen && data.unseen != 0)
                {
                    data.unseen = 0;
                    console.log('Please ask to add unseen attribute from service developer of get_user_data');
                }
                obj_this.unseen_messages = data.unseen;
                var obj_firends = {};
                var chat_user_keys = [];
                var friend_id = undefined;
                for(var c in data.friends)
                {
                    var friend = obj_this.process_friend_object(data.friends[c]);
                    obj_firends[friend.id] = friend;
                    chat_user_keys.push(c);
                }
                obj_this.chat_users = obj_firends;                
                obj_this.keys_chat_users = chat_user_keys;
                // console.log(obj_firends, 13, new Date().getMilliseconds());

                obj_this.notificationList = [];
                // console.log(data.notifications);
                for(let i in data.notifications)
                {
                    obj_this.add_item_in_notification_list(data.notifications[i]);
                }
                // console.log(1111, obj_this.notificationList);
                obj_this.notificationList = obj_this.notificationList.reverse();
                obj_this.registerEventListeners();
                for(let i in obj_this.on_verified)
                {
                    obj_this.on_verified[i]();
                }
                obj_this.on_verified = [];
            };
            obj_this.socket.on('server_event', function(res){
                try{
                    // console.log(res.name);
                    if(!obj_this.server_events[res.name])
                    {
                        if(!obj_this.verified)
                        {
                            obj_this.execute_on_verified(function(){
                                obj_this.server_events[res.name](res.data);
                            });
                        }
                        else
                        {
                            console.log('Not handeled ', res.name);
                        }
                    }                                
                    else
                        obj_this.server_events[res.name](res.data);
                    
                }
                catch(er)
                {                            
                    console.log(er.message, ' in '+res.name+' with data ', res);
                }
            });
        });        
    }

    process_friend_object(friend_object){
        var friend_id = friend_object.id;        
        friend_object.photo = friend_object.photo;
        if(!friend_object.name)
        {
            friend_object.name = friend_object.username;                        
        }
        return friend_object;
    }

    execute_on_verified = function(method){        
        if(this.verified)
            method();
        else
        {
            this.on_verified.push(method);
        }
    }

    update_unseen_message_count(event, target_id, target) {        
        if(!target)
        {
            console.log('Selection failed for id='+target_id, target);
            return;
        }
        if(!target.unseen && target.unseen != 0)
        {
            target.unseen = 0;
            console.log('Please ask to add unseen attribute for each friend from service developer of get_user_data');
        }
		var inc = 0;
        var obj_this = this;        		
		try {			
            switch (event) {
                case "receive-new-message":                    
                    inc = 1;
                    break;
                case "read-new-message":
                    inc = -1;                                        
                    break;                
				case "user-selected":
					inc = target.unseen * -1;					
                    break;
            }
            
            target.unseen = target.unseen + inc;
			obj_this.unseen_messages = obj_this.unseen_messages + inc;

            if (obj_this.unseen_messages >= 1) {
				$('.un-read-msg.count').show();
			}
			else if (obj_this.unseen_messages <= 0) {
				$('.un-read-msg.count').hide();
			}
		} catch (er) {
			console.log("update message count err no ", er);
		}
    }
    

    start_video_call(call_link)
    {
        let obj_this = this;
        obj_this.active_call = true;        

        var call_modal = $('#call_modal');
        if(!call_modal.attr('is_draggable'))
        {
            call_modal.attr('is_draggable', 1);
            call_modal.draggable();
        }
        call_modal.find('.call_container:first').html('<iframe src="'+call_link+'&participant=1"></iframe>');        
        call_modal.find('.call_header button').unbind('click');
        call_modal.find('.call_header .quit').click(function(){
            call_modal.find('.call_container:first').html('');
            call_modal.hide();
            call_modal.find('.call_sound')[0].pause();
            obj_this.active_call = false;
        });
        call_modal.find('.call_sound')[0].play();
        setTimeout(function(){
            call_modal.find('.call_sound')[0].pause();
        }, 5000);
        call_modal.show();
    }

    make_video_call(uid){        
        let obj_this = this;
        var call_link = window['site_config'].site_url;        
        call_link += '/static/angular/assets/rtc/call.html';
        call_link += '?room='+obj_this.user_data.id+'-'+uid+'-call';
        var data = {
            message: 'Incoming call from '+obj_this.chat_users[uid].name,
            link: call_link
        }
        obj_this.start_video_call(call_link)
        obj_this.emit_rtc_event('call_friend', data, [uid]);              
    }

	registerEventListeners(){
        var obj_this = this;
        var bootbox = window["bootbox"];
        obj_this.server_events['meeting_started'] = function (res) {
            bootbox.alert(res);
        };
        obj_this.server_events['notification_received'] = function (res) { 
            obj_this.add_item_in_notification_list(res);
        };
        
        obj_this.server_events['notification_updated'] = function (res) {
            console.log('notifications updated')
        };

        obj_this.server_events['call_friend'] = function (res) {            
            var call_modal = $('#call_modal');
            call_modal.find('.call_sound')[0].play();
            var incoming_message = '<div class="incoming_call_message">';
            incoming_message +='<h3>Incoming Call</h3>';            
            incoming_message +='<button class="accept">Accept</button>';
            incoming_message +='<button class="reject">Reject</button>';
            incoming_message +='</div>';
            call_modal.find('.call_container').html(incoming_message);
            call_modal.find('button').unbind('click');
            call_modal.find('.accept').click(function(){                
                call_modal.find('.call_sound')[0].pause();
                obj_this.start_video_call(res.link+'&participant=2&message='+res.message);
            });
            call_modal.find('.reject,.quit').click(function(){                
                call_modal.find('.call_container:first').html('');
                call_modal.hide();                
                obj_this.active_call = false;
                call_modal.find('.call_sound')[0].pause();
            });            
            call_modal.show();
        };


        function updateUserStatus(user)
        {
            if(obj_this.user_data.id == user.id)
            {
                console.log(user , "Should never happen now");
                return;
            }
            if(!obj_this.chat_users[user.id])
            {
                console.log(user.id + ' not found in list -- ', obj_this.chat_users);
                return;
                //pending to add this user in list
            }
            else
            {
                obj_this.chat_users[user.id].online = user.online;
            }
        }

        obj_this.server_events['friend_joined'] = updateUserStatus;

        obj_this.server_events['user_left'] = updateUserStatus;

        obj_this.server_events['error'] = function (res) {
            if(res == 'Invalid Token')
            {
                obj_this.close_socket();
                window["current_user"].logout(1);
                console.log('Unauthorized due to invalid token');
            }
            else
                console.log("Error from chat ", res);
        };

        obj_this.server_events['force_log_out'] = function (res) {
            var href = window.location.toString();
            if(href.indexOf('172.16') == -1 || href.indexOf('localhost') == -1)
            {
                window["current_user"].logout(1);
            }
        };

        obj_this.server_events['chat_message_received'] = function (msg) {
            let sender = obj_this.chat_users[msg.sender];
            if(!sender)
            {
                console.log(obj_this.chat_users, ' Dev issue as '+msg.sender+' not found');
                return;
            }
            obj_this.update_unseen_message_count("receive-new-message", msg.sender, sender);

        };

        obj_this.server_events['comment_received'] = function (data) {

        };
        obj_this.server_events['point_comment_received'] = function (data) {
            window['on_annotation_comment_received'](data);
        };
    };

    emit_rtc_event(event_name, data, audience)
    {
        data = {
            name: event_name,
            audience: audience,
            data: data
        }
        this.socket.emit('client_event', data);
    }

	emit_server_event(input_data, args) {
        try{
            var options =
            { 
                data:{
                    params: input_data,
                    args : args
                }
            }             
            window['dn_rpc_object'](options);
        }
        catch(er)
        {
            console.log(er)
        }        
	}

    init_route(url){
        this.not_public_url = 0;
        this.current_route = url;
        this.current_id = undefined;
        this.current_model = undefined;        
        this.active_parent_notification = undefined;
        this.notificationList.forEach(function(el, i){
            el.active = undefined;
        });
    }

    activate_notification(){

    }

    find_notification_index(res_model, res_id) {
        let index = -1;
        for(let i in this.notificationList){
            let item_in_list = this.notificationList[i];
            if(item_in_list.res_model == res_model && item_in_list.res_id == res_id)
            {
                index = parseInt(i);
                break;
            }
        }
        return index;
    }

	removeNotification(res_app, res_model, res_id){        
		if(!this.verified)
			return;
		let index = -1;
		let active_item = undefined;
		for(let i in this.notificationList){
            let item = this.notificationList[i];
			item.active = false;
			if(item.res_model == res_model && item.res_id == res_id) {
				active_item = item;
                index = parseInt(i);                
			}
        }        
		if(!active_item)
			return;
    	
        let input_data = {
            no_notify:1,
            res_model: res_model,
            res_id:res_id,
            res_app: res_app
        }
        if(active_item.counter > 0)
        {
            let args = {
                app: 'chat',
                model: 'Notification',
                method: 'update_counter'
            };
            this.emit_server_event(input_data, args);
        }            
        this.remove_item_from_notification_list(index);
    }
    
    add_item_in_notification_list(item) {
        var obj_this = this;
        let route = obj_this.model_routes[item.res_app][item.res_model];
        item.client_route = route + item.res_id;
        item.counter = 1;
        obj_this.notificationList.splice(0, 0, item);
    }

    remove_item_from_notification_list(i) {
        this.notificationList.splice(i, 1);
    }

    get_param(name, url)
    {
        try{
            if (!url) url = location.href;
            name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
            var regexS = "[\\?&]"+name+"=([^&#]*)";
            var regex = new RegExp( regexS );
            var results = regex.exec( url );
            var result = results[1];
            return result;
        }
        catch(er){
            return '';
        }	
    }

    model_routes = {
        'meetings':{
            'Event':'/meeting/',
            'MeetingDocument':'/annotation/doc/',
            'AgendaDocument':'/annotation/doc/'
        },
        'voting':{
            'Voting':'/voting/'
        },
        'annotation':{
            'Point': '/annotation/doc/discussion'
        }
    }
    
    close_socket(){        
        var socket = window['socket_manager'].socket;
		if(socket && socket.connected){
			socket.disconnect();
			socket = false;
        }
        this.user_data = undefined;
    }
}
