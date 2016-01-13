/**
 * social-wall - 0.3.1
 * Made by Jordan Thiervoz
 * OKLM posey
**/

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

// PHP URL
var phpURL = "/";

// jQuery element where the loader animation will be done
var $loaderElement;

// Element to be placed in localStorage for every network
var fb_posts = "{ \"posts\": [";
var tw_posts = "{ \"posts\": [";
var ins_posts = "{ \"posts\": [";
var yt_posts = "{ \"posts\": [";

// Number of elements per network
var nbPostsFb;
var nbPostsTw;
var nbPostsIns;
var nbPostsYt;

// Masonry variable
var $masonGrid;

// Cache will be used for a certain time before being checked again. For now, the minimum is 1.
var cacheDuration = 1;

// Network variable initialization
var fb, tw, ins, yt, vm;

// Device width
var clientWidth = $(window).width();

/* END VARIABLE INITIALIZATION */


/* --------------------------------------------------*/
/* --------------------------------------------------*/
/* --------------------------------------------------*/


// General functions are in the social variable
// Social wall Initialization, Sorting, Loading, Creating elements, Show articles, Progress verification and Error verification
var social = {
	init:function(config){
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

		if(clientWidth < 850){
			if(clientWidth > 600){
				tailleContainer = Math.floor((tailleContainer / 3) - 35);
			}
		}
		else{
			tailleContainer = Math.floor((tailleContainer / 4) - 35);
		}

		var loaderElementIsChanged;

		// Search if other parameters are set
		if(config.hasOwnProperty("params")){
			if(config.params.hasOwnProperty("elemPerPage")){
				elemPerPage = config.params.elemPerPage;
			}

			if(config.params.hasOwnProperty("maxPages")){
				maxPages = config.params.maxPages;
			}

			if(config.params.hasOwnProperty("loaderElement")){
				loaderElementIsChanged = true;
				$loaderElement = config.params.loaderElement;
			}
			else{
				loaderElementIsChanged = false;
			}

			if(config.params.hasOwnProperty("cacheDuration")){
				cacheDuration = config.params.cacheDuration;

				if(cacheDuration < 1){
					cacheDuration = 1;
				}
			}

			if(config.params.hasOwnProperty("phpURL")){
				phpURL = config.params.phpURL;

				if(phpURL.substr(-1) != "/"){
					phpURL += "/";
				}
			}
		}

		// Launch the first loading animation and progression
		social.loading(loaderElementIsChanged);

		// Launch every network if the parameter is not false
		if(fb != false){
			// If elements are not in cache, launch Facebook ajax. Else, create posts with the cache
			if(localStorage.getItem("fb_elems") === null || localStorage.getItem("fb_elems") == "null"){
				social_fb.launchFb(fb);
			}
			else{
				social.verifCache("fb");
			}
		}
		else{
			loadingState++;
			social.progressLoading();
		}

		if(tw != false){
			// If elements are not in cache, launch Twitter ajax. Else, create posts with the cache
			if(localStorage.getItem("tw_elems") === null || localStorage.getItem("tw_elems") == "null"){
				social_tw.launchTw(tw);
			}
			else{
				social.verifCache("tw");
			}
		}
		else{
			loadingState++;
			social.progressLoading();
		}

		if(ins != false)
			// If elements are not in cache, launch Instagram ajax. Else, create posts with the cache
			if(localStorage.getItem("ins_elems") === null || localStorage.getItem("ins_elems") == "null"){
				social_ins.launchIns(ins);
			}
			else{
				social.verifCache("ins");
			}
		else{
			loadingState++;
			social.progressLoading();
		}

		if(yt != false)
			// If elements are not in cache, launch YouTube ajax. Else, create posts with the cache
			if(localStorage.getItem("yt_elems") === null || localStorage.getItem("yt_elems") == "null"){
				social_yt.launchYt(yt);
			}
			else{
				social.verifCache("yt");
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
			if($loaderElement.attr("id") == "social_loading"){{
				$loaderElement.hide();
			}
			}

			$loaderElement.removeClass("social_state_0 social_state_1 social_state_2 social_state_3 social_state_4 social_state_5 social_state_6");

			if($(".social_page_1").length == 0){
				var divAlert = $("<div></div>");
				divAlert.text("Pas d'articles");
				divAlert.attr("id", "social_alert");

				$("#social_wall").append(divAlert);

				$("#social_alert").fadeIn();
			}
			else{
				$(".social_post.social_page_1").show();

				$(".social_post.social_page_1").each(function(){
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
				});

				setTimeout(function(){
					$(".social_post.social_page_1").each(function(i){
						TweenLite.to($(this), 0, { scale : 0.8 });
						TweenLite.to($(this), 0.2, { alpha : 1, scale : 1, delay : i * 0.2 });
					});
				}, 2000);

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

				if(clientWidth < 850){
					$("#social_wall #social_load_more").width(clientWidth);
					$("#social_wall #social_load_more").addClass('littleScreen');
				}
			}
		}

		if(state == "loadInit"){
			console.log("Chargement terminé");
			if($loaderElement.attr("id") =="social_loading"){{
				TweenLite.to($loaderElement, 0.5, { alpha: 0, delay : 1.5, onComplete : showThePostsInit});
			}
			}
			else{{
				TweenLite.to($loaderElement, 0.5, { delay : 1.5, onComplete : showThePostsInit});
			}
			}
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

			if(currentPage == maxPages){{
				$("#social_load_more").hide();
			}
			}
		}
	},
	createArticle:function(data, network){
		// Variables des éléments créés dans la page
		var article;
		var divSource, sourceP;
		var sourceImg, gElement, pathElement, pathElement2;
		var aLink;
		var divContent, imgContent;
		var divDate;


		article = $("<article></article>");
		article.addClass("social_post");
		article.width(tailleContainer);
		article.attr("data-date", data[3]);

		divSource = $("<div></div>");
		divSource = document.createElement("div");
		divSource.className = "social_source";

		sourceImg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

		sourceImg.width = 30;
		sourceImg.height = 30;

		gElement = document.createElementNS("http://www.w3.org/2000/svg", "g");
		pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
		pathElement2 = document.createElementNS("http://www.w3.org/2000/svg", "path");

		switch(network){
			case "Facebook" :
				gElement.setAttribute("id", "Facebook_6_");

				pathElement.setAttribute("fill", "#43619C");
				pathElement.setAttribute("d", "M15,30C6.729,30,0,23.271,0,15S6.729,0,15,0s15,6.729,15,15S23.271,30,15,30z M15,1.14 C7.357,1.14,1.14,7.357,1.14,15S7.357,28.86,15,28.86S28.86,22.643,28.86,15S22.643,1.14,15,1.14z");
				
				pathElement2.setAttribute("id", "Facebook_1_");
				pathElement2.setAttribute("fill", "#43619C");
				pathElement2.setAttribute("d", "M21.866,20.939c0,0.425-0.345,0.77-0.77,0.77h-3.555v-5.403h1.814l0.271-2.105h-2.085 v-1.344c0-0.61,0.17-1.025,1.044-1.025l1.115-0.001V9.947c-0.193-0.025-0.854-0.083-1.625-0.083c-1.608,0-2.708,0.981-2.708,2.783 V14.2h-1.818v2.105h1.818v5.403H8.683c-0.425,0-0.77-0.345-0.77-0.77V8.526c0-0.425,0.345-0.77,0.77-0.77h12.413 c0.425,0,0.77,0.344,0.77,0.77C21.866,8.526,21.866,20.939,21.866,20.939z");
				break;
			case "Twitter" :
				gElement.setAttribute("id", "Twitter_7_");

				pathElement.setAttribute("id", "Twitter_1_");
				pathElement.setAttribute("fill", "#24A9E6");
				pathElement.setAttribute("d", "M21.55,9.208C20.985,9.55,20.361,9.8,19.694,9.934c-0.532-0.582-1.291-0.945-2.132-0.945 c-1.612,0-2.92,1.341-2.92,2.995c0,0.235,0.025,0.462,0.075,0.682c-2.427-0.125-4.579-1.316-6.02-3.13 c-0.252,0.444-0.395,0.959-0.395,1.507c0,1.038,0.515,1.955,1.299,2.492c-0.478-0.014-0.929-0.151-1.323-0.374v0.037 c0,1.451,1.007,2.662,2.344,2.936c-0.245,0.07-0.503,0.106-0.77,0.106c-0.188,0-0.372-0.018-0.55-0.053 c0.372,1.189,1.45,2.055,2.728,2.079c-0.999,0.804-2.259,1.283-3.627,1.283c-0.235,0-0.469-0.014-0.697-0.041 c1.293,0.849,2.828,1.344,4.477,1.344c5.373,0,8.31-4.563,8.31-8.52c0-0.13-0.003-0.26-0.008-0.388 c0.571-0.423,1.066-0.95,1.456-1.55c-0.523,0.238-1.086,0.399-1.677,0.472C20.869,10.494,21.332,9.907,21.55,9.208z");
				
				pathElement2.setAttribute("fill", "#24A9E6");
				pathElement2.setAttribute("d", "M15,30C6.729,30,0,23.271,0,15S6.729,0,15,0s15,6.729,15,15S23.271,30,15,30z M15,1.14 C7.357,1.14,1.14,7.357,1.14,15S7.357,28.86,15,28.86S28.86,22.643,28.86,15S22.643,1.14,15,1.14z");
				break;
			case "Instagram" :
				gElement.setAttribute("id", "Instagram_7_");

				pathElement.setAttribute("id", "Instagram_1_");
				pathElement.setAttribute("fill", "#2A5B83");
				pathElement.setAttribute("d", "M20.674,7.995H10.053c-0.915,0-1.657,0.74-1.657,1.653v10.63 c0,0.913,0.742,1.653,1.657,1.653h10.622c0.915,0,1.657-0.74,1.657-1.653V9.648C22.331,8.735,21.589,7.995,20.674,7.995z M18.411,10.173c0-0.241,0.195-0.436,0.436-0.436h1.306c0.241,0,0.436,0.195,0.436,0.436v1.306c0,0.241-0.195,0.436-0.436,0.436 h-1.306c-0.241,0-0.436-0.195-0.436-0.436V10.173z M15.38,12.306c1.48,0,2.68,1.197,2.68,2.673c0,1.477-1.2,2.674-2.68,2.674 s-2.679-1.197-2.679-2.674C12.7,13.502,13.9,12.306,15.38,12.306z M21.024,20.188c0,0.241-0.195,0.436-0.436,0.436h-10.45 c-0.241,0-0.436-0.195-0.436-0.436v-6.532h1.742c-0.227,0.327-0.303,0.936-0.303,1.323c0,2.332,1.901,4.229,4.239,4.229 s4.239-1.897,4.239-4.229c0-0.387-0.055-0.987-0.336-1.323h1.742L21.024,20.188L21.024,20.188z");
				
				pathElement2.setAttribute("fill", "#2A5B83");
				pathElement2.setAttribute("d", "M15,30C6.729,30,0,23.271,0,15S6.729,0,15,0s15,6.729,15,15S23.271,30,15,30z M15,1.14 C7.357,1.14,1.14,7.357,1.14,15S7.357,28.86,15,28.86S28.86,22.643,28.86,15S22.643,1.14,15,1.14z");
				break;
			case "YouTube" :
				pathElement.setAttribute("fill", "#F24033");
				pathElement.setAttribute("d", "M15,30C6.729,30,0,23.271,0,15S6.729,0,15,0s15,6.729,15,15S23.271,30,15,30z M15,1.14 C7.357,1.14,1.14,7.357,1.14,15S7.357,28.86,15,28.86S28.86,22.643,28.86,15S22.643,1.14,15,1.14z");
				
				pathElement2.setAttribute("fill", "#F24033");
				pathElement2.setAttribute("d", "M20.255,9.442c0,0-2.94-0.127-5.072-0.127s-4.964,0.127-4.964,0.127c-1.4,0-2.428,1.136-2.428,2.536v5.579 c0,1.4,1.026,2.536,2.426,2.536c0,0,2.068,0.158,5.075,0.174c3.007,0.016,4.989-0.174,4.989-0.174c1.4,0,2.511-1.136,2.511-2.536 v-5.579C22.792,10.578,21.655,9.442,20.255,9.442z M13.66,17.074v-4.343l4.175,2.179L13.66,17.074z");
				break;
			case "Vimeo" :
				gElement.setAttribute("id", "Vimeo_1_");

				pathElement.setAttribute("fill", "#1CB1E6");
				pathElement.setAttribute("d", "M19.943,9.107c-1.937-0.063-3.247,1.01-3.935,3.214c0.353-0.146,0.697-0.216,1.031-0.216 c0.708,0,1.02,0.389,0.936,1.173c-0.042,0.475-0.353,1.164-0.936,2.072c-0.583,0.906-1.021,1.358-1.312,1.358 c-0.375,0-0.717-0.699-1.031-2.1c-0.104-0.412-0.292-1.463-0.56-3.153c-0.252-1.565-0.918-2.298-2-2.194 c-0.459,0.043-1.146,0.454-2.06,1.237c-0.668,0.597-1.344,1.195-2.03,1.791l0.656,0.836c0.626-0.434,0.989-0.65,1.093-0.65 c0.478,0,0.926,0.742,1.344,2.227c0.375,1.357,0.749,2.719,1.124,4.08c0.561,1.484,1.248,2.224,2.059,2.224 c1.312,0,2.916-1.215,4.81-3.648c1.83-2.326,2.779-4.159,2.839-5.5C22.054,10.064,21.377,9.147,19.943,9.107z");
				
				pathElement2.setAttribute("fill", "#1CB1E6");
				pathElement2.setAttribute("d", "M15,30C6.729,30,0,23.271,0,15S6.729,0,15,0s15,6.729,15,15S23.271,30,15,30z M15,1.14 C7.357,1.14,1.14,7.357,1.14,15S7.357,28.86,15,28.86S28.86,22.643,28.86,15S22.643,1.14,15,1.14z");
				break;
		}

		article.addClass("social_network_" + network);

		sourceP = document.createElement("p");
		sourceP.innerHTML = data[4];

		aLink = $("<a></a>");
		if(data[2] != ""){
			aLink.attr({"href": data[2], "target": "_blank"});
		}
		else{
			aLink.attr("href", null).css("cursor","pointer");
		}

		divContent = $("<div></div>");
		divContent.addClass("social_content");

		if(!(typeof data[1] === "undefined") && data[1].length >= 375){
			data[1] = data[1].substr(0, 375) + " ...";
		}

		divContent.text(data[1]);

		imgContent = $("<img/>");

		if(data[5] == "" || data[5] == "null"){
			imgContent.css("display","none");
		}

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
		gElement.appendChild(pathElement);
		gElement.appendChild(pathElement2);
		sourceImg.appendChild(gElement);

		divSource.appendChild(sourceImg);
		divSource.appendChild(sourceP);

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
		// var nbElem = $(".social_post").length;

		if(!isFbOk){
			if($(".social_network_Facebook").length == nbPostsFb){
				// If Facebook is ok AND if the cache doesn't exist.
				if(localStorage.getItem("fb_elems") === null || localStorage.getItem("fb_elems") == "null"){
					social.finishCache(fb, "fb");
				}

				isFbOk = true;
				loadingState++;
				social.progressLoading();
			}
		}

		if(!isTwOk){
			if($(".social_network_Twitter").length == nbPostsTw){
				// If Twitter is ok AND if the cache doesn't exist.
				if(localStorage.getItem("tw_elems") === null || localStorage.getItem("tw_elems") == "null"){
					social.finishCache(tw, "tw");
				}

				isTwOk = true;
				loadingState++;
				social.progressLoading();
			}
		}

		if(!isInsOk){
			if($(".social_network_Instagram").length == nbPostsIns){
				// If Instagram is ok AND if the cache doesn't exist.
				if(localStorage.getItem("ins_elems") === null || localStorage.getItem("ins_elems") == "null"){
					social.finishCache(ins, "ins");
				}

				isInsOk = true;
				loadingState++;
				social.progressLoading();
			}
		}

		if(!isYtOk){
			if($(".social_network_YouTube").length == nbPostsYt){
				// If YouTube is ok AND if the cache doesn't exist.
				if(localStorage.getItem("yt_elems") === null || localStorage.getItem("yt_elems") == "null"){
					social.finishCache(yt, "yt");
				}

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

		if(typeof nbPostsFb === "undefined"){
			nbPostsFb = 0;
		}

		if(typeof nbPostsTw === "undefined"){
			nbPostsTw = 0;
		}

		if(typeof nbPostsIns === "undefined"){
			nbPostsIns = 0;
		}

		if(typeof nbPostsYt === "undefined"){
			nbPostsYt = 0;
		}

		var totalElements = (nbPostsFb + nbPostsTw + nbPostsIns + nbPostsYt);

		// console.log("Fb = " + nbPostsFb);
		// console.log("Tw = " + nbPostsTw);
		// console.log("Ins = " + nbPostsIns);
		// console.log("Yt = " + nbPostsYt);
		// console.log("Total = " + totalElements);

		var y;

		// Classe les éléments par page
		for(var j = elemPerPage; j <= totalElements; j += elemPerPage){
			y = j;
			$(".social_post").slice(j - elemPerPage, j).addClass("social_page_" + j / elemPerPage);
		}

		y += elemPerPage;
		$(".social_post").slice(y - elemPerPage, y).addClass("social_page_" + y / elemPerPage);

		$(".social_post:not(.social_page_1)").hide();

		for(var k = (maxPages + 1); k <= (totalElements / maxPages); k++){
			$(".social_page_" + k).remove();
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
	},
	verifCache:function(network){
		var isSame;
		var longNetwork;
		var thePosts;

		switch(network){
			case "fb" :
				fb_posts = $.parseJSON(localStorage.getItem("fb_elems"));

				if(fb_posts.id_target == fb){
					isSame = true;
					thePosts = fb_posts.posts;
					longNetwork = "Facebook";
					nbPostsFb = thePosts.length;
				}
				else{
					isSame = false;
					localStorage.setItem("fb_elems", "null");
					social_fb.launchFb(fb);
				}

				break;
			case "tw" :
				tw_posts = $.parseJSON(localStorage.getItem("tw_elems"));

				if(tw_posts.id_target == tw){
					isSame = true;
					thePosts = tw_posts.posts;
					longNetwork = "Twitter";
					nbPostsTw = thePosts.length;
				}
				else{
					isSame = false;
					localStorage.setItem("tw_elems", "null");
					social_tw.launchTw(tw);
				}

				break;
			case "ins" :
				ins_posts = $.parseJSON(localStorage.getItem("ins_elems"));

				if(ins_posts.id_target == ins){
					isSame = true;
					thePosts = ins_posts.posts;
					longNetwork = "Instagram";
					nbPostsIns = thePosts.length;
				}
				else{
					isSame = false;
					localStorage.setItem("ins_elems", "null");
					social_ins.launchIns(ins);
				}

				break;
			case "yt" :
				yt_posts = $.parseJSON(localStorage.getItem("yt_elems"));

				if(yt_posts.id_target == yt){
					isSame = true;
					thePosts = yt_posts.posts;
					longNetwork = "YouTube";
					nbPostsYt = thePosts.length;
				}
				else{
					isSame = false;
					localStorage.setItem("yt_elems", "null");
					social_yt.launchYt(yt);
				}

				break;
		}

		if(isSame){
			var cacheOld = social.verifDateCache(network);

			if(cacheOld == false){
				// If cache is not old, create elements via the cache
				console.log("Cache is not old, creating cached elements...");

				for(var i = 0; i < thePosts.length; i++){
					var thisPost = [];
					thisPost.push(thePosts[i].id);
					thisPost.push(thePosts[i].message);
					thisPost.push(thePosts[i].link);
					thisPost.push(thePosts[i].date);
					thisPost.push(thePosts[i].author);
					thisPost.push(thePosts[i].picture);

					social.createArticle(thisPost, longNetwork);
				}
			}
			else{
				// If the cache is old, check for more recent elements
				console.log("Cache is old, check for new elements");
				
				if(network == "fb"){
					localStorage.setItem("fb_elems", "null");
					social_fb.launchFb(fb);
				}
				else if(network == "tw"){
					localStorage.setItem("tw_elems", "null");
					social_tw.launchTw(tw);
				}
				else if(network == "ins"){
					localStorage.setItem("ins_elems", "null");
					social_ins.launchIns(ins);
				}
				else if(network == "yt"){
					localStorage.setItem("yt_elems", "null");
					social_yt.launchYt(yt);
				}
			}
		}
	},
	verifDateCache:function(network){
		var dateCache;

		if(network == "fb"){
			dateCache = fb_posts.creationDate;
		}
		else if(network == "tw"){
			dateCache = tw_posts.creationDate;
		}
		else if(network == "ins"){
			dateCache = ins_posts.creationDate;
		}
		else if(network == "yt"){
			dateCache = yt_posts.creationDate;
		}

		var todayDate = new Date();

		dateCache = dateCache.split("-");

		var yearCache = dateCache[0];
		var monthCache = dateCache[1];
		var dayCache = dateCache[2];

		var day = todayDate.getDate();
		var month = (todayDate.getMonth()) + 1;
		var year = todayDate.getFullYear();

		if(dayCache != day){
			if((dayCache - day) < -cacheDuration || (dayCache - day) > cacheDuration){
				return true;
			}
			else{
				if(yearCache != year){
					return true;
				}
				else{
					if(monthCache != month){
						return true;
					}
					else{
						return false;
					}
				}
			}
		}
		else{
			if(monthCache == month && yearCache == year){
				return false;
			}
			else if(yearCache != year || monthCache != month){
				return true;
			}
		}
	},
	createCache:function(network, id, message, link, date, author, picture){
		if(!(typeof message === "undefined")){
			message = message.replace(/\"/g,"\\\"");
			message = message.replace(new RegExp("(\r\n|\r|\n)", "g"), "");
		}
		else{
			message = "";
		}

		if(typeof link === "undefined"){
			link = "";
		}

		if(typeof picture === "undefined"){
			picture = "";
		}


		var objectToAdd = "{ \"id\": \"" + id + "\", \"message\": \"" + message + "\", \"link\": \"" + link + "\", \"date\": \"" + date + "\", \"author\": \"" + author + "\", \"picture\": \"" + picture + "\" }";

		switch(network){
			case "fb" :
				// console.log(fb_posts);
				if(fb_posts == "null"){
					fb_posts = "{ \"posts\": [";
				}

				if(fb_posts != "{ \"posts\": ["){
					fb_posts += ", ";
				}

				fb_posts += objectToAdd;
				break;
			case "tw" :
				if(tw_posts != "{ \"posts\": ["){
					tw_posts += ", ";
				}

				tw_posts += objectToAdd;
				break;
			case "ins" :
				if(ins_posts != "{ \"posts\": ["){
					ins_posts += ", ";
				}

				ins_posts += objectToAdd;
				break;
			case "yt" :
				if(yt_posts != "{ \"posts\": ["){
					yt_posts += ", ";
				}

				yt_posts += objectToAdd;
				break;
		}
	},
	finishCache:function(id_target, network){
		var d = new Date();
		
		if(network == "fb"){
			fb_posts += " ], \"creationDate\": \"" + d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + "\", \"id_target\": \"" + id_target + "\"}";
			localStorage.setItem("fb_elems", fb_posts);

			if(localStorage.getItem("fb_elems").substr(0, 15) == "[object Object]"){
				var saveCache = "{ \"posts\": [" + localStorage.getItem("fb_elems").substr(17);
				
				localStorage.setItem("fb_elems", saveCache);
			}
		}
		else if(network == "tw"){
			tw_posts += " ], \"creationDate\": \"" + d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + "\", \"id_target\": \"" + id_target + "\"}";
			localStorage.setItem("tw_elems", tw_posts);

			if(localStorage.getItem("tw_elems").substr(0, 15) == "[object Object]"){
				var saveCache = "{ \"posts\": [" + localStorage.getItem("tw_elems").substr(17);
				
				localStorage.setItem("tw_elems", saveCache);
			}
		}
		else if(network == "ins"){
			ins_posts += " ], \"creationDate\": \"" + d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + "\", \"id_target\": \"" + id_target + "\"}";
			localStorage.setItem("ins_elems", ins_posts);

			if(localStorage.getItem("ins_elems").substr(0, 15) == "[object Object]"){
				var saveCache = "{ \"posts\": [" + localStorage.getItem("ins_elems").substr(17);
				
				localStorage.setItem("ins_elems", saveCache);
			}
		}
		else if(network == "yt"){
			yt_posts += " ], \"creationDate\": \"" + d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + "\", \"id_target\": \"" + id_target + "\"}";
			localStorage.setItem("yt_elems", yt_posts);

			if(localStorage.getItem("yt_elems").substr(0, 15) == "[object Object]"){
				var saveCache = "{ \"posts\": [" + localStorage.getItem("yt_elems").substr(17);
				
				localStorage.setItem("yt_elems", saveCache);
			}
		}
	}
};


/* --------------------------------------------------*/
/* --------------------------------------------------*/
/* --------------------------------------------------*/


// Contient toutes les fonctions liées à FB
var social_fb = {
	launchFb:function(fbPageId){
		// Search if the token is already in cache
		if(localStorage.getItem("fb_a_t") === null || localStorage.getItem("fb_a_t") == "null"){
			localStorage.setItem("fb_a_t", "null");
		}

		// Va lancer la récupération du feed FB
		$.post(
			phpURL + "social-wall.php",
			{
				network : "fb",
				id : fbPageId,
				a_t : localStorage.getItem("fb_a_t")
			}
		)
		.done(function(feed){
			// console.log("Requête Facebook exécutée");

			feed = $.parseJSON(feed);

			// Lance l'analyse des posts FB récupérés
			if(!social.hasError(feed, "fb")){
				localStorage.setItem("fb_a_t", feed.access_token);
				social_fb.getPosts(feed);
			}
		})
		.fail(function(xhr, status, error){
			console.error("Social Wall - Facebook --> " + error);
		});
	},
	getPosts:function(feedFb){
		var posts = feedFb.data;
		nbPostsFb = posts.length;

		for(var i in posts){
			var postDate = posts[i].created_time.substr(0, 10);

			var thisPost = [];
			thisPost.push(posts[i].id);
			thisPost.push(posts[i].message);
			thisPost.push(posts[i].link);
			thisPost.push(postDate);
			thisPost.push(posts[i].from.name);
			thisPost.push(posts[i].full_picture);

			social.createCache("fb", thisPost[0], thisPost[1], thisPost[2], thisPost[3], thisPost[4], thisPost[5]);

			social.createArticle(thisPost, "Facebook");
		}
	}
};


/* --------------------------------------------------*/
/* --------------------------------------------------*/
/* --------------------------------------------------*/


// Contient toutes les fonctions liées à TW
var social_tw = {
	launchTw:function(twUserId){
		// Va lancer la récupération du feed Twitter
		$.post(
			phpURL + "social-wall.php",
			{
				network : "tw",
				id : twUserId
			}
		)
		.done(function(feed){
			// console.log("Requête Twitter exécutée");

			feed = $.parseJSON(feed);

			// Lance l'analyse des posts Twitter récupérés
			if(!social.hasError(feed, "tw")){
				social_tw.getPosts(feed);
			}
		})
		.fail(function(xhr, status, error){
			console.error("Social Wall - Twitter --> " + error);
		});
	},
	getPosts:function(feedTw){
		// console.log("Analyse des posts Twitter...");
		
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
			else
				thisPost.push(null);

			social.createCache("tw", thisPost[0], thisPost[1], thisPost[2], thisPost[3], thisPost[4], thisPost[5]);

			social.createArticle(thisPost, "Twitter");
		}
	}
};


/* --------------------------------------------------*/
/* --------------------------------------------------*/
/* --------------------------------------------------*/


// Contient toutes les fonctions liées à INS
var social_ins = {
	launchIns:function(insUserId){
		// Va lancer la récupération du feed Instagram
		$.post(
			phpURL + "social-wall.php",
			{
				network : "ins",
				id : insUserId
			}
		)
		.done(function(feed){
			// console.log("Requête Instagram exécutée");

			feed = $.parseJSON(feed);

			// Lance l'analyse des posts Instagram récupérés
			if(!social.hasError(feed, "ins")){
				social_ins.getPosts(feed);
			}
		})
		.fail(function(xhr, status, error){
			console.error("Social Wall - Instagram --> " + error);
		});
	},
	getPosts:function(feedIns){
		// console.log("Analyse des posts Instagram...");

		feedIns = feedIns.data;

		nbPostsIns = feedIns.length;

		for(var i in feedIns){
			var thisPost = [];

			var thisDate = social.analyzeDate(feedIns[i].created_time, "ins");

			thisPost.push(feedIns[i].id);
			thisPost.push(feedIns[i].caption.text);
			thisPost.push(feedIns[i].link);
			thisPost.push(thisDate);
			thisPost.push(feedIns[i].user.full_name);
			thisPost.push(feedIns[i].images.standard_resolution.url);

			social.createCache("ins", thisPost[0], thisPost[1], thisPost[2], thisPost[3], thisPost[4], thisPost[5]);

			social.createArticle(thisPost, "Instagram");
		}
	}
};


/* --------------------------------------------------*/
/* --------------------------------------------------*/
/* --------------------------------------------------*/


// Contient toutes les fonctions liées à YT
var social_yt = {
	launchYt:function(ytChannelId){
		// Va lancer la récupération du feed YouTube
		$.post(
			phpURL + "social-wall.php",
			{
				network : "yt",
				id : ytChannelId
			}
		)
		.done(function(feed){
			feed = $.parseJSON(feed);

			// Lance l'analyse des posts YouTube récupérés
			if(!social.hasError(feed, "yt")){
				social_yt.getPosts(feed);
			}
		})
		.fail(function(xhr, status, error){
			console.error("Social Wall - YouTube --> " + error);
		});
	},
	getPosts:function(feedYt){
		nbPostsYt = feedYt.pageInfo.totalResults;

		feedYt = feedYt.items;

		for(var i in feedYt){
			var thisPost = [];
			var titleAndDescription;

			if(feedYt[i].snippet.description == "" || feedYt[i].snippet.description == null){
				titleAndDescription = feedYt[i].snippet.title;
			}
			else{
				titleAndDescription = feedYt[i].snippet.title + " - " + feedYt[i].snippet.description;
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

			social.createCache("yt", thisPost[0], thisPost[1], thisPost[2], thisPost[3], thisPost[4], thisPost[5]);

			social.createArticle(thisPost, "YouTube");
		}
	}
};
