# social-wall
A JavaScript / PHP Social Wall

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
First, create an element in your HTML file. The id _must_ be "social_wall":
```
<div id="social_wall"></div>
```

In your JavaScript file, add these lines :
```
social.init({
	networks : {
		facebook : "", // Facebook page ID
		twitter : "", // Twitter User ID
		instagram : "", // Instagram user ID
		youtube : "", // YouTube channel ID
		vimeo : "" // VIMEO DOES NOT WORK YET
	}
});
```

Bravo ! You're now ready to configure your PHP file...

#Networks configuration
##Facebook
###Create your own application
You must create an application on [Facebook](https://developers.facebook.com/) to display your data with authorization.
* On the top menu, go in "My Apps", then click on "Add a new app"
* Select "Website" as your application's platform
* Type the name of your new application, click "Create New Facebook App ID"
* You will arrive to the "Setup SDK" page, go down and complete the "Site URL" field (if you are developing in local, just type "http://localhost")

###Get your app informations
Je continuerai plus tard
