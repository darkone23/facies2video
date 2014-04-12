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

    function mountFaciesVideo(mount, framerate) {
	var videoBlob = faciesToVideoBlobURL(framerate),
	video = createVideo(videoBlob);
	mount.appendChild(video);
    }

    function mountIntoAdspace(framerate) {
	var ad = $("#chat-list > li:first-child"),
	    el = ad.get(0);
	ad.empty();
	mountFaciesVideo(el, framerate);
    }

    function getFramerate() {
	var userInput = prompt("How many frames per second?"),
	    framerate = parseInt(userInput, 10);
	if (isNaN(framerate)) {
	    alert("Whoops, must specify a number");
	}
	return framerate;
    }

    var framerate = getFramerate();
    if (framerate) {
	mountIntoAdspace(framerate);
    }

})(jQuery, Whammy);
