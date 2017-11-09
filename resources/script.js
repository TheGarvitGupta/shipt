$(document).ready(function() {
	$(".input").keyup(function() {
    	gitFetch();
	});

	gitFetch();
});

function gitFetch() {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "https://api.github.com/users/" + $(".input").val() + "?client_id=62a00b38abdab8b609f1&client_secret=7e0f7f149f39eb1a2550e51aac9ef9eeb452b638", false);
	xhr.send();

	/* User Exists */
	if(xhr.status == 200) {

		/* initialize to first page of followers list */
		page = 1;

		var response = JSON.parse(xhr.response);

		/* Refrest followers list */
		$(".followers-list").html("");

		/* Set image */
		image = response["avatar_url"];
		$(".image").css("background-image", "url(" + response["avatar_url"] + ")");

		/* Set input color to white on match */
		$(".input").css("color", "#ffffff");

		/* Set followers */
		$(".followers").html(response["followers"] + " FOLLOWERS");

		/* Load followers - Page is 1 at the start */
		loadMore();
	}
	else {
		$(".input").css("color", "#ff0000");
	}	
}

function pushFollower(url) {
	$(".followers-list").append("<div class='follows' style='background-image:url(" + url + ")'></div>");
}

function loadMore() {

	/* Hide existing loaders */
	hideLoaders();

	/* Get list of followers */
	var newxhr = new XMLHttpRequest();
	newxhr.open("GET", "https://api.github.com/users/" + $(".input").val() + "/followers?client_id=62a00b38abdab8b609f1&client_secret=7e0f7f149f39eb1a2550e51aac9ef9eeb452b638&page=" + page, false);
	newxhr.send();

	var newresponse = JSON.parse(newxhr.response);

	for (var num=0; num<newresponse.length; num++) {
		pushFollower(newresponse[num]["avatar_url"]);
	}

	page += 1;

	/* Add new loader at the end */
	addLoader();

	if (newresponse.length < 30) {
		hideLoaders();
	}
}

function hideLoaders() {
	$(".loader").each(function(index) {
  		$(this).css("display", "none");
	});
}

function addLoader() {
	$(".followers-list").append("<div class='follows loader'></div>");

	$(".loader").click(function() {
		loadMore();
	});
}