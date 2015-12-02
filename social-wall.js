/*
	social-wall V1.0
	Made by Jordan Thiervoz
	OKLM posey
*/

/* START VARIABLE INITIALIZATION */
// Social wall width
var tailleContainer;

// Array containing all the dates, used to sort them
var allDates = [];

// Network states (completed or not)
var isFbOk;
var isTwOk;
var isInsOk;
var isYtOk;
var isVmOk;

// Load progress
var loadingState = 0;

// Currently displayed page
var currentPage = 1;

// Elements per page
var elemPerPage = 8;

// Maximum pages
var maxPages = 3;

// jQuery element where the loader animation will be done
var $loaderElement;

// Number of elements per network
var nbPostsFb;
var nbPostsTw;
var nbPostsIns;
var nbPostsYt;

// Masonry variable
var $masonGrid;

/* END VARIABLE INITIALIZATION */


/* --------------------------------------------------*/
/* --------------------------------------------------*/
/* --------------------------------------------------*/


// General functions are in the social variable
// Social wall Initialization, Sorting, Loading, Creating elements, Show articles, Progress verification and Error verification
var social = {
	init:function(config){
		// Network variable initialization
		var fb, tw, ins, yt, vm;

		console.log("Analyse des paramètres envoyés...");

		// Retreive network parameters
		for(var n in config.networks){
			if(config.networks[n] == ""){
				switch(n){
					case "facebook" :
						fb = false;
						isFbOk = true;
						break;
					case "twitter" :
						tw = false;
						isTwOk = true;
						break;
					case "instagram" :
						ins = false;
						isInsOk = true;
						break;
					case "youtube" :
						yt = false;
						isYtOk = true;
						break;
					case "vimeo" :
						vm = false;
						isVmOk = true;
						break;
				}
			}
			else{
				switch(n){
					case "facebook" :
						fb = config.networks[n];
						isFbOk = false;
						break;
					case "twitter" :
						tw = config.networks[n];
						isTwOk = false;
						break;
					case "instagram" :
						ins = config.networks[n];
						isInsOk = false;
						break;
					case "youtube" :
						yt = config.networks[n];
						isYtOk = false;
						break;
					case "vimeo" :
						vm = config.networks[n];
						isVmOk = false;
						break;
				}
			}
		}

		// Initialize the width of every article depending on the #social_wall width
		tailleContainer = $("#social_wall").width();
		tailleContainer = Math.floor((tailleContainer / 4) - 35);

		// Search if other parameters are set
		if(config.hasOwnProperty("params")){
			if(config.params.hasOwnProperty("elemPerPage")){
				elemPerPage = config.params.elemPerPage;
			}

			if(config.params.hasOwnProperty("maxPages")){
				maxPages = config.params.maxPages;
			}

			if(config.params.hasOwnProperty("loaderElement")){
				var loaderElementIsChanged = true;
				$loaderElement = config.params.loaderElement;
			}
			else{
				loaderElementIsChanged = false;
			}
		}

		// Launch the first loading animation and progression
		social.loading(loaderElementIsChanged);

		// Launch every network if the parameter is not false
		if(fb != false){
			social_fb.launchFb(fb);
		}
		else{
			loadingState++;
			social.progressLoading();
		}

		if(tw != false){
			social_tw.launchTw(tw);
		}
		else{
			loadingState++;
			social.progressLoading();
		}

		if(ins != false){
			social_ins.launchIns(ins);
		}
		else{
			loadingState++;
			social.progressLoading();
		}

		if(yt != false){
			social_yt.launchYt(yt);
		}
		else{
			loadingState++;
			social.progressLoading();
		}

		// If every network is empty, launch the loading
		// It will detect that there is no element, and stop.
		if(!fb && !tw && !ins && !yt){
			loadingState++;
			social.progressLoading();
		}


		// Click listener on "load more" button (which is not created yet)
		var isClicked = false;
		$("#social_wall").on("click", "#social_load_more", function(){
			if(!isClicked){
				isClicked = true;
				currentPage++;
				social.showPosts(currentPage, "loadMore");
				isClicked = false;
			}
		});
	},
	loading:function(isChanged){
		if(!isChanged){
			var divLoading = $("<div></div>");

			divLoading.text("Chargement en cours");
			divLoading.attr({
				"id" : "social_loading",
				"data-content" : divLoading.text()
			});

			$("#social_wall").append(divLoading);

			$loaderElement = $("#social_loading");
		}

		loadingState = 0;
		social.progressLoading();
	},
	progressLoading:function(){
		$loaderElement.addClass("social_state_" + loadingState);

		if(loadingState == 5){
			loadingState++;
			$loaderElement.addClass("social_state_" + loadingState);

			social.showPosts(currentPage, "loadInit");
		}
	},
	showPosts:function(page, state){
		function showThePostsInit(){
			// $("#social_loading").hide();
			$loaderElement.removeClass("social_state_0 social_state_1 social_state_2 social_state_3 social_state_4 social_state_5 social_state_6");

			if($(".social_page_1").length == 0){
				var divAlert = $("<div></div>");
				divAlert.text("Pas d'articles");
				divAlert.attr("id", "social_alert");

				$("#social_wall").append(divAlert);

				$("#social_alert").fadeIn();
			}
			else{
				$(".social_post").each(function(i){
					if($(this).hasClass("social_page_1")){
						$(this).show();

						// Lance l'affichage de la grid qu'une fois que les images sont toutes chargées
						$masonGrid = $("#social_wall").imagesLoaded(function(){
							$masonGrid.masonry({
								itemSelector: ".social_post",
								columnWidth: (tailleContainer + 25),
								isFitWidth: true,
								percentPosition: true,
								gutter: 10
							});
						});

						TweenLite.to($(this), 0, { scale : 0.8 });
						TweenLite.to($(this), 0.2, { alpha : 1, scale : 1, delay : i * 0.2 });
					}
				});

				var buttonLoadMore = $("<div></div>");
				buttonLoadMore.attr("id", "social_load_more");

				var divBar = $("<div></div>");
				divBar.addClass("bar");

				var divBar2 = $("<div></div>");
				divBar2.addClass("bar");

				var buttonLoadMoreText = $("<p></p>");
				buttonLoadMoreText.text("Charger plus");

				buttonLoadMore.append(divBar);
				buttonLoadMore.append(buttonLoadMoreText);
				buttonLoadMore.append(divBar2);

				$("#social_wall").append(buttonLoadMore);
			}
		}

		if(state == "loadInit"){
			console.log("Chargement terminé");
			TweenLite.to($loaderElement, 0.5, { delay : 1.5, onComplete : showThePostsInit});
		}
		else if(state == "loadMore"){
			if($(".social_page_" + page).length != 0){
				$(".social_post").each(function(i){
					if($(this).hasClass("social_page_" + page)){
						$(this).show();

						// Lance l'affichage de la grid qu'une fois que les images sont toutes chargées
						$masonGrid = $("#social_wall").imagesLoaded(function(){
							$masonGrid.masonry({
								itemSelector: ".social_post",
								columnWidth: (tailleContainer + 25),
								isFitWidth: true,
								percentPosition: true,
								gutter: 10
							});
						});

						TweenLite.to($(this), 0, { scale : 0.8 });
						TweenLite.to($(this), 0.2, { alpha : 1, scale : 1, delay : i * 0.2 });
					}
				});

				$masonGrid = $("#social_wall").imagesLoaded(function(){
					$masonGrid.masonry({
						itemSelector: ".social_post",
						columnWidth: (tailleContainer + 25),
						isFitWidth: true,
						percentPosition: true,
						gutter: 10
					});
				});
			}

			if(currentPage == maxPages){
				$("#social_load_more").hide();
			}
		}
	},
	createArticle:function(data, network){
		// Variables des éléments créés dans la page
		var article;
		var divSource, sourceP, sourceImg;
		var aLink;
		var divContent, imgContent;
		var divDate;


		article = $("<article></article>");
		article.addClass("social_post");
		article.width(tailleContainer);
		article.attr("data-date", data[3]);

		divSource = $("<div></div>");
		divSource.addClass("social_source");

		sourceImg = $("<img/>");
		switch(network){
			case "Facebook" :
				sourceImg.attr("src", "wp-content/themes/Theme/js/social-wall/img/fb.png");
				article.addClass("social_network_" + network);
				break;
			case "Twitter" :
				sourceImg.attr("src", "wp-content/themes/Theme/js/social-wall/img/tw.png");
				article.addClass("social_network_" + network);
				break;
			case "Instagram" :
				sourceImg.attr("src", "wp-content/themes/Theme/js/social-wall/img/in.png");
				article.addClass("social_network_" + network);
				break;
			case "YouTube" :
				sourceImg.attr("src", "wp-content/themes/Theme/js/social-wall/img/yt.png");
				article.addClass("social_network_" + network);
				break;
			case "Vimeo" :
				sourceImg.attr("src", "wp-content/themes/Theme/js/social-wall/img/vm.png");
				article.addClass("social_network_" + network);
				break;
		}

		sourceP = $("<p></p>");
		sourceP.text(data[4]);

		aLink = $("<a></a>");
		aLink.attr({"href": data[2], "target": "_blank"});

		divContent = $("<div></div>");
		divContent.addClass("social_content");
		divContent.text(data[1]);

		imgContent = $("<img/>");

		if(data[5] != null){
			imgContent.attr("src", data[5]);
		}
		else{
			imgContent.css("display", "none");
		}

		divDate = $("<div></div>");
		divDate.addClass("social_date");
		divDate.text(network + " - " + data[3]);

		// Append des éléments
		divSource.append(sourceImg);
		divSource.append(sourceP);

		article.append(divSource);

		divContent.append(imgContent);

		aLink.append(divContent);
		aLink.append(divDate);

		article.append(aLink);

		$("#social_wall").append(article);

		allDates.push(data[3]);

		social.verifComplete();
	},
	verifComplete:function(){
		var nbElem = $(".social_post").length;

		// console.log("Nombre d'éléments créés : " + nbElem);
		// console.log($(".social_network_YouTube").length);

		if(!isFbOk){
			if($(".social_network_Facebook").length == nbPostsFb){
				isFbOk = true;
				loadingState++;
				social.progressLoading();
			}
		}

		if(!isTwOk){
			if($(".social_network_Twitter").length == nbPostsTw){
				isTwOk = true;
				loadingState++;
				social.progressLoading();
			}
		}

		if(!isInsOk){
			if($(".social_network_Instagram").length == nbPostsIns){
				isInsOk = true;
				loadingState++;
				social.progressLoading();
			}
		}

		if(!isYtOk){
			if($(".social_network_YouTube").length == nbPostsYt){
				isYtOk = true;
				loadingState++;
				social.progressLoading();
			}
		}

		// if(!isVmOk){
		// 	if($(".social_network_Vimeo").length == 20){
		// 		isVmOk = true;
		// 	}
		// }

		if(isFbOk && isTwOk && isInsOk && isYtOk && isVmOk){
			social.sortArticles();
		}
	},
	analyzeDate:function(theDate, network){
		var year, month, day;
		var theDateOk;

		if(network == "tw"){
			theDateOk = theDate.substr(4, 7);
			theDateOk = theDateOk + theDate.substr(-4);
			
			year = theDateOk.substr(7);
			month = theDateOk.substr(0, 3);
			day = theDateOk.substr(4, 2);

			switch(month){
				case "Jan" :
					month = "01";
					break;
				case "Feb" :
					month = "02";
					break;
				case "Mar" :
					month = "03";
					break;
				case "Apr" :
					month = "04";
					break;
				case "May" :
					month = "05";
					break;
				case "Jun" :
					month = "06";
					break;
				case "Jul" :
					month = "07";
					break;
				case "Aug" :
					month = "08";
					break;
				case "Sep" :
					month = "09";
					break;
				case "Oct" :
					month = "10";
					break;
				case "Nov" :
					month = "11";
					break;
				case "Dec" :
					month = "12";
					break;
			}

			theDateOk = year + "-" + month + "-" + day;
		}

		if(network == "ins"){
			theDateOk = new Date(parseInt(theDate) * 1000);

			month = (theDateOk.getMonth() + 1);
			day = theDateOk.getDate();

			if(month < 10){
				month = "0" + month;
			}

			if(day < 10){
				day = "0" + day;
			}

			theDateOk = theDateOk.getFullYear() + "-" + month + "-" + day;
		}

		if(network == "yt"){
			theDateOk = theDate.substr(0, 10);
		}

		return theDateOk;
	},
	sortArticles:function(){
		allDates.sort();
		allDates.reverse();

		for(var i in allDates){
			$(".social_post[data-date='" + allDates[i] + "']").appendTo("#social_wall");
		}

		var totalElements = (nbPostsFb + nbPostsTw + nbPostsIns + nbPostsYt);

		console.log("Fb = " + nbPostsFb);
		console.log("Tw = " + nbPostsTw);
		console.log("Ins = " + nbPostsIns);
		console.log("Yt = " + nbPostsYt);
		console.log("Total = " + totalElements);

		// Classe les éléments par page (4 pages maximum = 100 éléments)
		for(var j = elemPerPage; j <= totalElements; j += elemPerPage){
			$(".social_post").slice(j - elemPerPage, j).addClass("social_page_" + j / elemPerPage);
		}

		$(".social_post:not(.social_page_1)").hide();

		for(var j = (maxPages + 1); j <= (totalElements / maxPages); j++){
			$(".social_page_" + j).remove();
		}

		loadingState++;
		social.progressLoading();
	},
	hasError:function(data, network){
		if(network != "ins"){
			if(data.hasOwnProperty("error") || data.hasOwnProperty("errors")){
				switch(network){
					case "fb" :
						if(data.error.hasOwnProperty("type")){
							console.error("Social Wall - Facebook --> " + data.error.type + " : " + data.error.message + " | (Code : " + data.error.code + ")");
						}
						else{
							console.error("Social Wall - Facebook --> " + data.error.message);
						}
						break;
					case "tw" :
						if(data.hasOwnProperty("errors")){
							console.error("Social Wall - Twitter --> " + data.errors[0].message + " | (Code : " + data.errors[0].code + ")");
						}
						else{
							console.error("Social Wall - Twitter --> " + data.error.message);
						}
						break;
					case "yt" :
						if(data.error.hasOwnProperty("errors")){
							console.error("Social Wall - YouTube --> " + data.error.errors[0].message + " : " + data.error.errors[0].reason);
						}
						else{
							console.error("Social Wall - YouTube --> " + data.error.message);
						}
						break;
				}

				return true;
			}
			else{
				return false;
			}
		}
		else{
			if(data.hasOwnProperty("meta")){
				if(data.meta.hasOwnProperty("error_type") || data.meta.hasOwnProperty("error_message")){
					console.error("Social Wall - Instagram --> " + data.meta.error_type + " : " + data.meta.error_message + " | (Code : " + data.meta.code + ")");
					return true;
				}
				else{
					return false;
				}
			}
			else{
				console.error("Social Wall - Instagram --> " + data.error.message);
				return true;
			}
		}
	}
}


/* --------------------------------------------------*/
/* --------------------------------------------------*/
/* --------------------------------------------------*/



// Contient toutes les fonctions liées à FB
var social_fb = {
	launchFb:function(fbPageId){
		// Va lancer la récupération du feed FB
		$.post(
			"wp-content/themes/Theme/js/social-wall/social-wall.php",
			{
				network : "fb",
				method : "getFeed",
				id : fbPageId
			}
		)
		.done(function(feed, status){
			// console.log("Requête Facebook exécutée");

			feed = $.parseJSON(feed);

			if(!social.hasError(feed, "fb")){
				// Lance l'analyse des posts FB récupérés
				social_fb.recupPosts(feed);
			}
		})
		.fail(function(xhr, status, error){
			console.error("Social Wall - Facebook --> " + error);
		});
	},
	recupPosts:function(feedFb){
		// console.log("Analyse des posts Facebook...");
		var posts = feedFb.data;
		nbPostsFb = posts.length;

		var postId, postDate, postPicture;

		for(var i in posts){
			postId = posts[i].id;

			$.post(
				"wp-content/themes/Theme/js/social-wall/social-wall.php",
				{
					network : "fb",
					method : "getPost",
					id : postId
				}
			)
			.done(function(post, status){
				post = $.parseJSON(post);

				if(!social.hasError(post, "fb")){
					postId = post.id;

					postDate = post.created_time;
					postDate = postDate.substr(0, 10);

					postPicture = null;

					var thisPost = [];
					thisPost.push(postId);
					thisPost.push(post.message);
					thisPost.push(post.link);
					thisPost.push(postDate);
					thisPost.push(post.from.name);

					$.post(
						"wp-content/themes/Theme/js/social-wall/social-wall.php",
						{
							network : "fb",
							method : "getPicture",
							id : postId
						}
					)
					.done(function(picture, status){
						postPicture = $.parseJSON(picture);

						if(!social.hasError(postPicture, "fb")){
							postPicture = postPicture.full_picture;

							thisPost.push(postPicture);

							social.createArticle(thisPost, "Facebook");
						}
					})
					.fail(function(xhr, status, error){
						console.error("Social Wall - Facebook --> " + error);
					});
				}
			})
			.fail(function(xhr, status, error){
				console.error("Social Wall - Facebook --> " + error);
			});
		}
	}
}

/* --------------------------------------------------*/
/* --------------------------------------------------*/
/* --------------------------------------------------*/



// Contient toutes les fonctions liées à TW
var social_tw = {
	launchTw:function(twUserId){
		// Va lancer la récupération du feed Twitter
		$.post(
			"wp-content/themes/Theme/js/social-wall/social-wall.php",
			{
				network : "tw",
				method : "",
				id : twUserId
			}
		)
		.done(function(feed, status){
			// console.log("Requête Twitter exécutée");

			feed = $.parseJSON(feed);

			if(!social.hasError(feed, "tw")){
				// Lance l'analyse des posts Twitter récupérés
				social_tw.recupPosts(feed);
			}
		})
		.fail(function(xhr, status, error){
			console.error("Social Wall - Twitter --> " + error);
		});
	},
	recupPosts:function(feedTw){
		// console.log("Analyse des posts Twitter...");

		// console.log(feedTw);
		
		nbPostsTw = feedTw.length;

		for(var i in feedTw){
			var thisPost = [];
			thisPost.push(feedTw[i].id_str);
			thisPost.push(feedTw[i].text);
			thisPost.push("https://twitter.com/" + feedTw[i].user.screen_name + "/status/" + feedTw[i].id_str);
			
			var created_at = social.analyzeDate(feedTw[i].created_at, "tw");

			thisPost.push(created_at);
			thisPost.push(feedTw[i].user.screen_name);

			if(feedTw[i].hasOwnProperty("entities")){
				if(feedTw[i].entities.hasOwnProperty("media")){
					thisPost.push(feedTw[i].entities.media[0].media_url_https);
				}
				else{
					thisPost.push(null);
				}
			}
			else{
				thisPost.push(null);
			}

			social.createArticle(thisPost, "Twitter");
		}
	}
}

/* --------------------------------------------------*/
/* --------------------------------------------------*/
/* --------------------------------------------------*/



// Contient toutes les fonctions liées à INS
var social_ins = {
	launchIns:function(insUserId){
		// Va lancer la récupération du feed Instagram
		$.post(
			"wp-content/themes/Theme/js/social-wall/social-wall.php",
			{
				network : "ins",
				method : "",
				id : insUserId
			}
		)
		.done(function(feed, status){
			// console.log("Requête Instagram exécutée");

			feed = $.parseJSON(feed);

			if(!social.hasError(feed, "ins")){
				// Lance l'analyse des posts Instagram récupérés
				social_ins.recupPosts(feed);
			}
		})
		.fail(function(xhr, status, error){
			console.error("Social Wall - Instagram --> " + error);
		});
	},
	recupPosts:function(feedIns){
		// console.log("Analyse des posts Instagram...");

		feedIns = feedIns.data;

		nbPostsIns = feedIns.length;

		for(var i in feedIns){
			/*
			thisPost[0] = id;
			thisPost[1] = message;
			thisPost[2] = lien;
			thisPost[3] = date;
			thisPost[4] = auteur;
			thisPost[5] = image;
			*/

			var thisPost = [];

			var thisDate = social.analyzeDate(feedIns[i].created_time, "ins");

			thisPost.push(feedIns[i].id);
			thisPost.push(feedIns[i].caption.text);
			thisPost.push(feedIns[i].link);
			thisPost.push(thisDate);
			thisPost.push(feedIns[i].user.full_name);
			thisPost.push(feedIns[i].images.standard_resolution.url);

			social.createArticle(thisPost, "Instagram");
		}
	}
}

/* --------------------------------------------------*/
/* --------------------------------------------------*/
/* --------------------------------------------------*/


// Contient toutes les fonctions liées à YT
var social_yt = {
	launchYt:function(ytChannelId){
		// Va lancer la récupération du feed YouTube
		$.post(
			"wp-content/themes/Theme/js/social-wall/social-wall.php",
			{
				network : "yt",
				method : "",
				id : ytChannelId
			}
		)
		.done(function(feed, status){
			// console.log("Requête YouTube 1/4 exécutée");

			feed = $.parseJSON(feed);

			if(!social.hasError(feed, "yt")){
				// Lance l'analyse des posts YouTube récupérés
				social_yt.recupPosts(feed, ytChannelId);
			}
		})
		.fail(function(xhr, status, error){
			console.error("Social Wall - YouTube --> " + error);
		});
	},
	recupPosts:function(feedYt, ytChannelId){
		// console.log("Analyse des posts YouTube...");

		// console.log(feedYt);
		nbPostsYt = feedYt.pageInfo.totalResults;

		feedYt = feedYt.items;

		for(var i in feedYt){
			/*
			thisPost[0] = id;
			thisPost[1] = message;
			thisPost[2] = lien;
			thisPost[3] = date;
			thisPost[4] = auteur;
			thisPost[5] = image;
			*/

			var thisPost = [];

			if(feedYt[i].snippet.description == "" || feedYt[i].snippet.description == null){
				var titleAndDescription = feedYt[i].snippet.title;
			}
			else{
				var titleAndDescription = feedYt[i].snippet.title + " - " + feedYt[i].snippet.description;
			}
			
			var linkVideo = "https://youtube.com/watch?v=" + feedYt[i].contentDetails.upload.videoId;

			var dateVideo = social.analyzeDate(feedYt[i].snippet.publishedAt, "yt");

			var thumbnail;

			thisPost.push(feedYt[i].contentDetails.upload.videoId);
			thisPost.push(titleAndDescription);
			thisPost.push(linkVideo);
			thisPost.push(dateVideo);
			thisPost.push(feedYt[i].snippet.channelTitle);

			if(feedYt[i].snippet.thumbnails.hasOwnProperty("default")){
				thumbnail = feedYt[i].snippet.thumbnails.default.url;

				if(feedYt[i].snippet.thumbnails.hasOwnProperty("medium")){
					thumbnail = feedYt[i].snippet.thumbnails.medium.url;
					
					if(feedYt[i].snippet.thumbnails.hasOwnProperty("high")){
						thumbnail = feedYt[i].snippet.thumbnails.high.url;
						
						if(feedYt[i].snippet.thumbnails.hasOwnProperty("standard")){
							thumbnail = feedYt[i].snippet.thumbnails.standard.url;
							
							if(feedYt[i].snippet.thumbnails.hasOwnProperty("maxres")){
								thumbnail = feedYt[i].snippet.thumbnails.maxres.url;
							}
						}
					}
				}
			}

			thisPost.push(thumbnail);

			social.createArticle(thisPost, "YouTube");
		}
	}
}