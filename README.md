# social-wall
A JavaScript / PHP Social Wall


# What is social-wall
social-wall is a JavaScript (and PHP) plugin which allows you to display the latest posts from differents social networks in a grid.
social-wall uses JavaScript and PHP to retrieve and analyze the different posts.

*Current version : __0.3.4__*


## Social networks supported
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

#Configuration
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

#Bugs and changes to make
* CSS not yet implemented in the repo.
* Add link to the account in the top title of every post.
* Add a parameter to change the date format.
* Don't use a PHP file anymore.
* Refactor the code to improve performance.

#Change log

####0.3.4
* Responsive corrections.

####0.3.2
* Fixed a problem with the YouTube API.

####0.3.1
* Responsive layout.
* Bug fix for broken images.

##0.3
* PHP URL can be modified with a new parameter : `phpURL`.
* Posts are now correctly created when the cache is old.
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
