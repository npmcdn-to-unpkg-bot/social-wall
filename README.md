# social-wall
A JavaScript / PHP Social Wall

Version 1.2.1

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

Add these librairies to your HTML page **before** adding _social-wall.js_.

##Initialization
First, create an element in your HTML file. The id attribute _must_ be "social_wall":
```
<div id="social_wall"></div>
```

In your JavaScript file, add these lines :
```
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

Bravo ! You're now ready to configure your PHP file...

#APIs configuration
_If you have trouble creating any application, take a look at the **Annex** part below._

##Facebook
To configure your connection to Facebook all you need is two information :
* Your `App ID`
* Your `App Secret`

Open the "social-wall.php" file and add your `App ID` and `App Secret` into these variables :
```
$FB_app_id = "";
$FB_app_secret = "";
$FB_token = "";
```
You don't have to initialize `$FB_token`, social-wall plugin will retrieve automatically the Facebook access token to connect to your application. So let it empty !

##Twitter
Twitter needs 4 information to work :
* Your `App ID`
* Your `App Secret`
* Your `Token`
* Your `Token Secret`

Open the "social-wall.php" file and add your keys into these variables :
```
$TW_app_id = "";
$TW_app_secret = "";
$TW_token = "";
$TW_token_secret = "";
```

#Annex
##Facebook Application
###Create your own application
You must create an application on [Facebook for Developers](https://developers.facebook.com/) to display your data with authorization.
* On the top menu, go in "My Apps", then click on "Add a new app"
* Select "Website" as your application's platform
* Type the name of your new application, click "Create New Facebook App ID"
* You will arrive to the "Setup SDK" page, go down and complete the "Site URL" field (if you are developing in local, just type "http://localhost")

###Get your app informations
Just look at the `App ID` and `App Secret` fields. Now you can add them to your PHP file, look at the **APIs configuration** part.

##Twitter Application
###Create your own application
If you want to access Twitter content, you must create an application on [Twitter Apps](https://apps.twitter.com/).
* Click "Create a new app"
* Give it a name, description, website (it can be http://localhost if you are testing)
* Create your application

###Get your app informations
* Click on the "Keys and Access Tokens" tab

Your `App ID` is your "Consumer Key".

Your `App Secret` is your "Consumer Secret".

* Click "Generate Tokens"

Here are your `Token` and your `Token Secret`

#Bugs
* The PHP file is only accessible if it's in a WordPress theme (for now).

#Change log
####1.2.1
* Corrections

##1.2
* Everything is now working correctly online (especially Facebook !).
* All posts retrieved are now placed in cache. The cache duration is fixed to 2 days minimum (for now).
* Some other corrections

####1.1.1
* If no "loader element" is entered, hide correctly the loading label.
* No images for source part on elements, only svgs.
* Post content length limit is fixed to 450 characters.

##1.0
* It works offline, but it's not responsive and not customizable.
