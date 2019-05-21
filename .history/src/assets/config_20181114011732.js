var site_config = {
	server_base_url: "https://demo.odoohq.com",
	server_db: "demo",
	site_url: "https://meetvue.com",
	chat_server: "https://chat.brainpbx.com",
	show_logs: false
};
var site_config_local = {
	server_base_url: "http://172.16.21.170:8000",
	server_db: "foster",
	live: false,
	site_url: "",
	chat_server: "http://172.16.21.170:3000",
	show_logs: true
};
// if(window.location.origin.toString() != site_config.site_url)
// {
// site_config = site_config_local;
// site_config.site_url = window.location.origin.toString();
// }
// else
// site_config.live = true;

window["site_config"] = site_config;
