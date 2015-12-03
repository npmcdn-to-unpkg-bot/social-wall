<?php
/*
	social-wall V1.1
	Made by Jordan Thiervoz
	OKLM posey
*/

// Infos des applications
$FB_app_id = "";
$FB_app_secret = "";
$FB_token = "";

$TW_app_id = "";
$TW_app_secret = "";
$TW_token = "";
$TW_token_secret = "";

$INS_app_id = "";
$INS_app_secret = "";
$INS_app_redirect = "";
$INS_token = "";

$YT_app_id = "";

social_wall_launch();

function social_wall_launch(){
	if(isset($_POST["network"])){
		switch($_POST["network"]){
			case "fb" :
				facebook_launch();
				break;
			case "tw" :
				twitter_launch();
				break;
			case "ins" :
				instagram_launch();
				break;
			case "yt" :
				youtube_launch();
				break;
			default :
				echo "{\"error\":{\"message\":\"Wrong network parameter.\"}}";
		}
	}
	else
		echo "{\"error\":{\"message\":\"Missing network parameter.\"}}";
}

// Fetch l'url en GET et retourne la chaîne récupérée
function fetchUrl($url){
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_TIMEOUT, 20);
	// You may need to add the line below
	// curl_setopt($ch,CURLOPT_SSL_VERIFYPEER,false);

	$feedData = curl_exec($ch);
	curl_close($ch); 

	return $feedData;
}

// Lance la fonction liée à la méthode choisie pour FB
function facebook_launch(){
	if(isset($_POST["id"]) && isset($_POST["method"])){
		switch($_POST["method"]){
			case "getFeed" :
				$page_id = $_POST["id"];
				facebook_getToken();
				echo facebook_getFeed($page_id);
				break;
			case "getPost" :
				$post_id = $_POST["id"];
				echo facebook_getPost($post_id);
				break;
			case "getPicture" :
				$post_id = $_POST["id"];
				echo facebook_getPicture($post_id);
				break;
			default :
				echo "{\"error\":{\"message\":\"Wrong method parameter.\"}}";
		}
	}
	else{
		echo "{\"error\":{\"message\":\"Missing method parameter.\"}}";
		exit();
	}
}

// Génère le token lié à l'appli fb
function facebook_getToken(){
	global $FB_token, $FB_app_id, $FB_app_secret;

	$FB_token = fetchUrl("https://graph.facebook.com/oauth/access_token?client_id=" . $FB_app_id . "&client_secret=" . $FB_app_secret . "&grant_type=client_credentials");

	$FB_token = substr($FB_token, 13);
}

// Récupère les derniers posts de la page fb
function facebook_getFeed($pageID){
	global $FB_token;

	$json_object = fetchUrl("https://graph.facebook.com/" . $pageID . "/posts?access_token=" . $FB_token);

	return $json_object;
}

// Récupère les informations du post fb souhaité
function facebook_getPost($postID){
	$thePost = fetchUrl("https://graph.facebook.com/" . $postID);

	return $thePost;
}

// Récupère l'image du post fb en paramètre
function facebook_getPicture($postID){
	$thePicture = fetchUrl("https://graph.facebook.com/" . $postID . "?fields=full_picture");

	return $thePicture;
}

// Récupère le feed Twitter
function twitter_launch(){
	global $TW_token, $TW_token_secret, $TW_app_id, $TW_app_secret;

	if(isset($_POST["id"])){
		$host = 'api.twitter.com';
		$method = 'GET';
		$path = '/1.1/statuses/user_timeline.json'; // api call path

		$query = array( // query parameters
			'user_id' => $_POST["id"],
			'count' => '20',
			'include_rts' => 'false'
		);

		$oauth = array(
			'oauth_consumer_key' => $TW_app_id,
			'oauth_token' => $TW_token,
			'oauth_nonce' => (string)mt_rand(), // a stronger nonce is recommended
			'oauth_timestamp' => time(),
			'oauth_signature_method' => 'HMAC-SHA1',
			'oauth_version' => '1.0'
		);

		$oauth = array_map("rawurlencode", $oauth); // must be encoded before sorting
		$query = array_map("rawurlencode", $query);

		$arr = array_merge($oauth, $query); // combine the values THEN sort

		asort($arr); // secondary sort (value)
		ksort($arr); // primary sort (key)

		// http_build_query automatically encodes, but our parameters
		// are already encoded, and must be by this point, so we undo
		// the encoding step
		$querystring = urldecode(http_build_query($arr, '', '&'));

		$url = "https://$host$path";

		// mash everything together for the text to hash
		$base_string = $method."&".rawurlencode($url)."&".rawurlencode($querystring);

		// same with the key
		$key = rawurlencode($TW_app_secret)."&".rawurlencode($TW_token_secret);

		// generate the hash
		$signature = rawurlencode(base64_encode(hash_hmac('sha1', $base_string, $key, true)));

		// this time we're using a normal GET query, and we're only encoding the query params
		// (without the oauth params)
		$url .= "?".http_build_query($query);
		$url=str_replace("&amp;","&",$url); //Patch by @Frewuill

		$oauth['oauth_signature'] = $signature; // don't want to abandon all that work!
		ksort($oauth); // probably not necessary, but twitter's demo does it

		// also not necessary, but twitter's demo does this too
		function add_quotes($str){
			return '"'.$str.'"';
		}

		$oauth = array_map("add_quotes", $oauth);

		// this is the full value of the Authorization line
		$auth = "OAuth " . urldecode(http_build_query($oauth, '', ', '));

		// if you're doing post, you need to skip the GET building above
		// and instead supply query parameters to CURLOPT_POSTFIELDS
		$options = array(
			CURLOPT_HTTPHEADER => array("Authorization: $auth"),
	                  	//CURLOPT_POSTFIELDS => $postfields,
	                  	CURLOPT_HEADER => false,
	                  	CURLOPT_URL => $url,
	                  	CURLOPT_RETURNTRANSFER => true,
	                  	CURLOPT_SSL_VERIFYPEER => false
		);

		// do our business
		$feed = curl_init();
		curl_setopt_array($feed, $options);
		$json = curl_exec($feed);
		curl_close($feed);

		echo $json;
	}
	else
		echo "{\"error\":{\"message\":\"Missing user ID parameter.\"}}";
}

// Récupère le feed Instagram
/*
	TOKEN GÉNÉRÉ EN SUIVANT LA DOC INSTAGRAM
	APRÈS CRÉATION DE L'APPLI ET AUTORISATION PAR L'UTILISATEUR SOUHAITÉ
*/
function instagram_launch(){
	global $INS_app_id, $INS_app_secret, $INS_app_redirect, $INS_token;

	if(isset($_POST["id"])){
		$feed = fetchUrl("https://api.instagram.com/v1/users/" . $_POST['id'] . "/media/recent/?access_token=" . $INS_token);
		echo $feed;
	}
	else
		echo "{\"error\":{\"message\":\"Missing user ID parameter.\"}}";
}

// Launch la fonction de récupération YouTube correspondante
function youtube_launch(){
	global $YT_app_id;

	if(isset($_POST["id"])){
		$feed = fetchUrl("https://www.googleapis.com/youtube/v3/activities?part=contentDetails%2C+snippet&channelId=" . $_POST['id'] . "&maxResults=25&key=" . $YT_app_id);
		echo $feed;
	}
	else
		echo "{\"error\":{\"message\":\"Missing channel ID parameter.\"}}";
}
?>