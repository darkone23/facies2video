(function($, webm) {

    function getJpegURLs() {
	return $("#chat-list > li > img").map(function() {
	    return $(this).attr("src");
	}).get().reverse();
    }

    function jpegToWebP(jpegURL) {
	var canvas = document.createElement("canvas"),
	context = canvas.getContext("2d"),
	img = new Image();
	img.src = jpegURL;
	canvas.height = 300;
	canvas.width = 300;
	context.drawImage(img, 0, 0);
	return canvas.toDataURL('image/webp','');
    }

    function faciesToVideoBlobURL(framerate) {
	var jpegs = getJpegURLs(),
	webps = jpegs.map(jpegToWebP),
	blob = webm.fromImageArray(webps, framerate);
	return URL.createObjectURL(blob);
    }

    function createVideo(src) {
	var video = document.createElement("video");
	video.loop = "loop";
	video.autoplay = "autoplay";
	video.controls = "controls";
	video.src = src;
	return video;
    }

    function renderFaciesVideo(mount, framerate) {
	var videoBlob = faciesToVideoBlobURL(framerate),
	video = createVideo(videoBlob);
	mount.appendChild(video);
    }

    function mountModal(mountNode) {
	var modal = document.createElement("div"),
	    controls = document.createElement("div"),
	    framerateText = document.createElement("span"),
	    framerate5 = document.createElement("button"),
	    framerate10 = document.createElement("button"),
	    framerate30 = document.createElement("button")
	    close = document.createElement("button"),
	    video = document.createElement("div");

	controls.id = "controls";
	video.id = "video";
	close.id = "close";

	framerateText.innerText = "select framerate"
	framerate5.innerText = "5";
	framerate10.innerText = "10";
	framerate30.innerText = "30";

	controls.appendChild(framerateText);
	controls.appendChild(framerate5);
	controls.appendChild(framerate10);
	controls.appendChild(framerate30);
	controls.appendChild(close);
	modal.appendChild(controls);
	modal.appendChild(video);

	close = $(close);
	controls = $(controls);

	close.text("✖");
	close.css({
	    "float": "right"
	});
	close.on("click", function(e) {
	    $(modal).remove();
	});

	controls.css({
	    "padding": "10px",
	    "height": "25px",
	    "box-style": "border-box",
	    "border-bottom": "2px solid black"
	});
	controls.find("button").css({
	    "cursor": "pointer"
	});
	controls.on("click", "button", function(e) {
	    var buttonText = $(this).text(),
	        framerate = parseInt(buttonText, 10);
	    if (isNaN(framerate)) return;
	    $(video).empty();
	    renderFaciesVideo(video, framerate);
	});

	$(modal).css({
	    "position": "absolute",
	    "width": "300px",
	    "height": "325px",
            "margin": "0",
	    "padding": "0",
	    "display": "block",
	    "background-color": "deepskyblue",
	    "box-style": "border-box",
	    "left": "50%",
	    "margin-left": "-150px"
	});

	mountNode.appendChild(modal);
    }

    mountModal(document.body);

})(jQuery, Whammy);
