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
	var controls = $("<div class=controls>select framerate: <button class=fps>5</button><button class=fps>10</button><button class=fps>30</button><button class=close /></div>"),
	    video = $("<div class=video />")
	    modal = $("<div />"),
	    close = controls.find("button.close");

	close.text("✖");
	close.css({
	    "float": "right"
	});
	close.on("click", function(e) {
	    modal.remove();
	});

	controls.css({
	    "padding": "10px",
	    "height": "25px",
	    "box-style": "border-box",
	    "border-bottom": "2px solid black"
	});
	controls.on("click", "button.fps", function(e) {
	    var buttonText = $(this).text(),
	        framerate = parseInt(buttonText, 10),
	        el = video.get(0);
	    video.empty();
	    renderFaciesVideo(el, framerate);
	});

	modal.css({
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
	modal.append(controls);
	modal.append(video);
	mountNode.appendChild(modal.get(0));
    }

    mountModal(document.body);

})(jQuery, Whammy);
