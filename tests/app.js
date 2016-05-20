var $ = require('jquery');
var social = require('./social-wall.js');

$(document).ready(function() {
	social.init({
		networks : {
			facebook : "",
			twitter : "",
			instagram : "",
			youtube : "",
			vimeo : ""
		}
	});
});