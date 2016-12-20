/* NYT API Key - 4bbabbfc37dd4786914ca930e35dd905 */

$(document).ready(function() {

	$(document).on("click", "#search-btn", function(event) {
		event.preventDefault();
		$("#results").empty();
		$("#results").html("<p>Click on Images to View Article</p>");
		var queryURL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q='
		+ $("#search-text").val().replace(" ", "+");
		var restrictSource = '&fq=source:("The New York Times")';
		var apiKey = '&api-key=4bbabbfc37dd4786914ca930e35dd905';
		if ($("#start-year").val() !== '') {
			var startDate = '&begin_date=' + $("#start-year").val() + '0101';
		} else {
			var startDate = "";
		}
		if ($("#end-year").val() !== '') {
			var endDate = '&end_date=' + $("#end-year").val() + '1231';
		} else {
			var endDate = "";
		}
		queryURL = queryURL + startDate + endDate + restrictSource + apiKey;
		console.log(queryURL);

		$.ajax({
			url: queryURL,
			method: "GET"
		}).done(function(response){
			console.log(response.response);

			var numResults = $("#num-records").val();
			console.log(numResults);

			for (let i = 0; i < numResults; i++) {
				//create bootstrap media object
				var wrapper = $("<div>").addClass("media");
				var mediaLeft = $("<div>").addClass("media-left")
					.appendTo(wrapper);
				//creates thumbnail image as a link to the artice left-justified
				var link = $("<a>").attr("href", response.response.docs[i].web_url)
					.attr("target", "_blank");					
				var thumb = $("<img>").addClass("media-object");
				for (let x = 0; x < response.response.docs[i].multimedia.length; x++) {
					if (response.response.docs[i].multimedia[x].subtype === "thumbnail") {
						thumb.attr("src", "https://www.nytimes.com/" 
							+ response.response.docs[i].multimedia[x].url)
						.attr("alt", "Image for " + response.response.docs[i].headline.main)
						.appendTo(link);
	
					} 
				}
				if (!thumb.attr("src")) {
					thumb.attr("src", "https://placehold.it/75x75?text=No+Image")
						.attr("alt", "No Image Available")
						.appendTo(link);
				}
				link.appendTo(mediaLeft);

				//creates the text body of the article
				var mediaBody = $("<div>").addClass("media-body")
					.appendTo(wrapper);	
				//grabs headline		
				var headline = $("<h4>").addClass("media-heading")
					.text(response.response.docs[i].headline.main)
					.appendTo(mediaBody);
				//grabs snippet
				var snippet = $("<p>").text(response.response.docs[i].snippet)
					.appendTo(mediaBody);
				//converts timestamp into readable English
				var newDate = new Date(response.response.docs[i].pub_date.replace(/-/g,"/").replace("T", " "));
				var date = $("<p>").text(newDate)
					.appendTo(mediaBody);
				wrapper.appendTo($("#results"));

			}

		}).fail(function(response){
			$("#results").text("No Records Match Your Search");

		});




	});

	$(document).on("click", "#clear-btn", function(event){
		event.preventDefault();
		$("#results").empty();
		$(".empty").val('');
	});

});