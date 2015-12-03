# social-wall
A JavaScript / PHP Social Wall
Version 1.11

# What is Social-Wall
social-wall is a... social wall plugin, which allows you to display your latest posts from differents social networks in a grid.
social-wall uses JavaScript and PHP to retreive and analyze the different posts.
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
If you have trouble creating any application, take a look at the **Annex** part below.

##Facebook
To configure your connection to Facebook all you need is two informations :
* Your `App ID`
* Your `App Secret`

Open the "social-wall.php" file and add your `App ID` and `App Secret` into these variables :
```
$FB_app_id = "";
$FB_app_secret = "";
$FB_token = "";
```
You don't have to initialize `$FB_token`, social-wall plugin will retreive automatically the Facebook token to connect to your application. So let it empty !

##Twitter
To be continued...



#Annex
##Facebook Application
###Create your own application
You must create an application on [Facebook for Developpers](https://developers.facebook.com/) to display your data with authorization.
* On the top menu, go in "My Apps", then click on "Add a new app"
* Select "Website" as your application's platform
* Type the name of your new application, click "Create New Facebook App ID"
* You will arrive to the "Setup SDK" page, go down and complete the "Site URL" field (if you are developing in local, just type "http://localhost")

###Get your app informations
Just look at the `App ID` and `App Secret` fields. Now you can add them to your PHP file, look at the **APIs configuration** part.


#Change log
##V1.11
--> If no "loader element" is entered, hide correctly the loading label.

--> No images for source part on elements, only svgs.

--> Post content length limit is fixed to 450 characters.

##V1.0
It works but it's not responsive and not very customizable
