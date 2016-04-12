# social-wall
A JavaScript / PHP Social Wall


# What is social-wall
social-wall is a JavaScript (and PHP) plugin which allows you to display the latest posts from differents social networks in a grid.
social-wall uses JavaScript and PHP to retrieve and analyze the different posts.

*Current version : __0.4.2__*
**[CHANGELOG](https://github.com/thiervoj/social-wall/blob/master/CHANGELOG.md)**


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
* **TweenLite**, to animate elements (deleted soon)
* **masonry**, to build a grid layout easily
* **Imagesloaded**, combined with masonry. It detects when images are loaded, then it launch the masonry grid.

Add these librairies to your HTML page **before** adding _social-wall.js_ :

``` HTML
<script src="http://code.jquery.com/jquery-1.12.3.min.js"></script>
<script src="http://imagesloaded.desandro.com/imagesloaded.pkgd.min.js"></script>
<script src="https://npmcdn.com/masonry-layout@4.0.0/dist/masonry.pkgd.min.js"></script>
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

Do not remove one of the networks parameters, they are all required for now.

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
		maxPages : 2, // Here, 12 elements will be shown in total
		cacheDuration : 2, // In days
		loaderElement : $("#myElement"), // For a loader animation
		phpURL : "http://localhost/myFolder/anotherFolder/" // URL of the social-wall PHP file
	}
});
```

#APIs configuration
_If you have trouble creating any application, take a look at the **[Annex](https://github.com/thiervoj/social-wall/blob/master/ANNEX.md)**._

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
* Add link to the account in the top title of every post.
* Add a parameter to change the date format.
* Don't use a PHP file anymore, or try to manage it better.
* Refactor the code to improve performance.
* Re organise the git repo.
* When the PHP file is not found, the 404 error is not managed every time, this error can stop all the JavaScript in your site...
