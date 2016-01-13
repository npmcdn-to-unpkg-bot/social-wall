# social-wall
A JavaScript / PHP Social Wall

Version 0.3

# What is Social-Wall
social-wall is a... social wall plugin, which allows you to display your latest posts from differents social networks in a grid.
social-wall uses JavaScript and PHP to retrieve and analyze the different posts.
## Socials networks supported
* Facebook
* Twitter
* Instagram
* YouTube
* More will come...

#Get started
##Required
social-wall requires these librairies to work:
* **jQuery**
* **TweenLite**, to animate elements
* **masonry**, to build a grid layout easily
* **Imagesloaded**, combined with masonry. It detects when images are loaded, then it launch the masonry grid.

Add these librairies to your HTML page **before** adding _social-wall.js_ :

``` HTML
<script src="http://code.jquery.com/jquery-1.12.0.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.18.2/TweenMax.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.imagesloaded/4.0.0/imagesloaded.pkgd.min.js"></script>
<script src="http://cdnjs.cloudflare.com/ajax/libs/masonry/3.3.2/masonry.pkgd.min.js"></script>
<script src="/js/social-wall.js"></script>
```

##Initialization
First, create an element in your HTML file. The id attribute _must_ be "social_wall":
``` HTML
<div id="social_wall"></div>
```

In your JavaScript file, add these lines :

``` JavaScript
social.init({
	networks : {
		facebook : "", // Facebook page ID or page name (from your fb page url)
		twitter : "", // Twitter User ID
		instagram : "", // Instagram user ID
		youtube : "", // YouTube channel ID
		vimeo : "" // VIMEO DOES NOT WORK YET
	}
});
```

#Configurations
You can configure social-wall by adding the `params` array.

The following snippet shows every parameter available for now (they are all optional) :

``` JavaScript
social.init({
	networks : {
		facebook : "",
		twitter : "",
		instagram : "",
		youtube : "",
		vimeo : ""
	},
	params : {
		elemPerPage : 6,
		maxPages : 2,
		cacheDuration : 2,
		loaderElement : $("#myElement"),
		phpURL : "http://localhost/myFolder/anotherFolder/"
	}
});
```

#APIs configuration
_If you have trouble creating any application, take a look at the **[Annex](#annex)** part below._

##Facebook
To configure your connection to Facebook all you need is two information :
* Your `App ID`
* Your `App Secret`

Open the "social-wall.php" file and add your `App ID` and `App Secret` into these variables :
``` PHP
$FB_app_id = "";
$FB_app_secret = "";
```
You don't have to initialize `$FB_token`, social-wall plugin will retrieve automatically the Facebook access token to connect to your application. So let it empty !

##Twitter
Twitter needs 4 information to work :
* Your `App ID`
* Your `App Secret`
* Your `Token`
* Your `Token Secret`

Open the "social-wall.php" file and add your keys into these variables :
``` PHP
$TW_app_id = "";
$TW_app_secret = "";
$TW_token = "";
$TW_token_secret = "";
```

##Instagram
Instagram needs 4 information to work :
* Your `App ID`
* Your `App Secret`
* Your `App redirect`
* Your `Token`

Open the "social-wall.php" file and add your keys into these variables :
``` PHP
$INS_app_id = "";
$INS_app_secret = "";
$INS_app_redirect = "";
$INS_token = "";
```

#YouTube
All you need for YouTube is one thing : your `App ID`. Place it here `$YT_app_id`.

#Annex
##Facebook Application
###Create your application
You must create an application on [Facebook for Developers](https://developers.facebook.com/) to display your data with authorization.
* On the top menu, go in "My Apps", then click on "Add a new app"
* Select "Website" as your application's platform
* Type the name of your new application, click "Create New Facebook App ID"
* You will arrive to the "Setup SDK" page, go down and complete the "Site URL" field (if you are developing in local, just type "http://localhost")

###Get your app informations
Just look at the `App ID` and `App Secret` fields. Now you can add them to your PHP file, look at the **APIs configuration** part.

##Twitter Application
###Create your application
If you want to access Twitter content, you must create an application on [Twitter Apps](https://apps.twitter.com/).
* Click "Create a new app"
* Give it a name, description, website (it can be http://localhost if you are testing)
* Create your application
* Modify the access level to Read-Only (App permissions)
* Click "Settings" and uncheck "Allow this application to be used to Sign in with Twitter"

###Get your app informations
* Click on the "Keys and Access Tokens" tab

Your `App ID` is your "Consumer Key".

Your `App Secret` is your "Consumer Secret".

* Click "Create my Access Tokens"

Here are your `Token` and your `Token Secret`.

##Instagram Application
###Create your application
To connect to Instagram you must create an application on [Instagram Dev](https://www.instagram.com/developer/)
* Click "Register your application" then "Register a New Client"
* Fill in the form (URL field can be http://localhost)
* Click the "Security" tab and uncheck the "Disable implicit Oauth" field
* Create your application

###Get your app informations
Your app ID is the `Client ID`, your app secret is the `Client Secret` and your URL redirect is your `Website URL`
To get your token, go to [Instagram Authentication Doc](https://www.instagram.com/developer/authentication/).
Scroll down to the "Client side" part and follow the instructions to get your `App token`.

#YouTube
###Create your application
* Go to [Google Console](https://console.developers.google.com/) and create a project
* Click "Activate and Manage APIs"
* Activate "YouTube Data API"
* Go to "IDs"
* Create a browser ID

###Get your app informations
The browser ID key is your `App ID`.

#Bugs and changes to make
* CSS not implemented.
* Remove the usage of TweenLite & jQuery.
* Add link to the account in the top title of every post.
* Don't use a PHP file anymore.

#Change log
##0.3
* PHP URL can be modified with a new parameter : `phpURL`.
* Posts are now correctly created when the cache is old.
* Corrections.

####0.2.1
* Corrections.

##0.2
* Everything is now working correctly online (especially Facebook !).
* All posts retrieved are now placed in cache (local storage). The cache duration is fixed to 2 days minimum (for now).
* Some other corrections.

####0.1.1
* If no "loader element" is entered, hide correctly the loading label.
* No images for source part on elements, only svgs.
* Post content length limit is fixed to 450 characters.

##0.1
* It works only offline.
