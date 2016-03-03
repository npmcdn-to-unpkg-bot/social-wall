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
