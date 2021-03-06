<?php
/**
 * social-wall - 0.4.3
 * Made by Jordan Thiervoz
 * OKLM posey
**/

/*
**************************
********APP PARAMS********
**************************
*/
$FB_app_id = "";
$FB_app_secret = "";

$TW_app_id = "";
$TW_app_secret = "";
$TW_token = "";
$TW_token_secret = "";

$INS_app_id = "";
$INS_app_secret = "";
$INS_app_redirect = "";
$INS_token = "";

$YT_app_id = "";
/*
**************************
******END APP PARAMS******
**************************
*/

//-------------------------------------------------
//--------------------CODE--------------------
//-------------------------------------------------
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
		echo "{\"error\":{\"message\":\"Missing 'network' parameter.\"}}";
}

// Fetch l'url en GET et retourne la chaîne récupérée
function fetchUrl($url){
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_TIMEOUT, 20);
	// You may need to add the line below
	curl_setopt($ch,CURLOPT_SSL_VERIFYPEER,false);

	$feedData = curl_exec($ch);
	curl_close($ch); 

	return $feedData;
}

// Lance la fonction liée à la méthode choisie pour FB
function facebook_launch(){
	global $FB_app_id, $FB_app_secret;

	if (!isset($_POST["id"])){
		echo "{\"error\":{\"message\":\"Missing 'id' parameter (your FB id).\"}}";
		exit();
	}

	if ($FB_app_id == null || $FB_app_id == "") {
		echo "{\"error\":{\"message\":\"Missing 'FB_app_id' parameter in the PHP file (your FB Dev App ID).\"}}";
		exit();
	}

	if ($FB_app_secret == null || $FB_app_secret == "") {
		echo "{\"error\":{\"message\":\"Missing 'FB_app_secret' parameter in the PHP file (your FB Dev App secret).\"}}";
		exit();
	}

	$page_id = $_POST["id"];

	echo facebook_getFeed($page_id);
}

// Récupère les derniers posts de la page fb
function facebook_getFeed($pageID){
	global $FB_app_id, $FB_app_secret;
	$url = "https://graph.facebook.com/" . $pageID . "/posts?fields=id,message,link,created_time,from,full_picture&access_token=" . $FB_app_id . "|" . $FB_app_secret;

	$json_object = fetchUrl($url);
	
	$json_decoded = json_decode($json_object);
	
	if(array_key_exists("error", $json_decoded)){
		if($json_decoded->{'error'}->{'message'} == "Invalid OAuth access token signature."){
			return null;
		}
	}
	else{
		return $json_object;
	}
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
		$feed = fetchUrl("https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=" . $_POST['id'] . "&maxResults=25&type=video&key=" . $YT_app_id);
		echo $feed;
	}
	else
		echo "{\"error\":{\"message\":\"Missing channel ID parameter.\"}}";
}
?>
