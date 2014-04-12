(function($, webm) {

    function getJpegURLs() {
	return $("li > img").map(function() {
	    return $(this).attr("src");
	}).get();
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
	video.src = src;
	return video;
    }

    function mountFaciesVideo(mount, framerate) {
	var videoBlob = faciesToVideoBlobURL(framerate),
	video = createVideo(videoBlob);
	mount.appendChild(video);
    }

    // todo: actually mount the video

})(jQuery, Whammy);
