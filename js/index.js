/****** fullPage ********/ 
$(function() {
    $('#wot').fullpage({
    	anchors: ['page1', 'page2', 'page3', 'page4', 'page5', 'page6'],
        menu: '#menuBg',
        afterLoad: function(link, index) {
        	var angle = -60 * (index - 1);
        	var rotateValueStr = "rotate(" + angle + "deg)";
        	$("#menuBg").css("transform", rotateValueStr);

        	var index_top = index == 1 ? 6 : index - 1;
        	var index_bottom = index == 6 ? 1 : index + 1;

        	var selectorStr = "#menuBg li.spoke" + index+ " a";
        	var selectorStr_top = "#menuBg li.spoke" + index_top + " a";
        	var selectorStr_bottom = "#menuBg li.spoke" + index_bottom + " a";

        	$(selectorStr_top).css({ "transform": "rotate(60deg)", "right": "-40px", "top": "40px" });
            $(selectorStr).css({ "transform": "rotate(0deg)", "right": "-80px", "top": "0px" });
            $(selectorStr_bottom).css({ "transform": "rotate(-60deg)", "right": "-50px", "top": "-40px" });
        }
    });
});
/****** /fullPage ********/

$(function() {
	/****** 第一屏、第三屏的点击播放视频部分 ******/
	$("a.video_btn").on('click', function(event) {
		// 监听a.video_btn，如果点击，音频暂停然后播放视频
		$("#audioPlayer")[0].pause();
		$("div.mask").css('display', 'block');
		var myVideo = $("#myVideo")[0];
		var videoSrc = "source/video/" + this.dataset.src;
		myVideo.src = videoSrc;
		myVideo.load();
		event.preventDefault();
		event.stopPropagation();
	});

	$("div.videoPlayer > a.close").on('click', function(event) {
		// 监听a.close，如果点击，视频暂停然后播放音频
		$("#audioPlayer")[0].play();
		$("#myVideo")[0].pause();
		$("div.mask").css('display', 'none');
		event.preventDefault();
		event.stopPropagation();
	});

	/****** /第一屏、第三屏的点击播放视频部分 ******/

	/****** 第二屏的切换视频部分 ******/
	$("div.features a").on('click', function(event) {
		var sourceStr = "source/video/features/" + this.dataset.feature;
		$("#VidageVideoP2")[0].src = sourceStr;
		$("div.videoList div.features").removeClass('active');
		$(this).parent("div.videoList div.features").addClass('active');
		event.preventDefault();
		event.stopPropagation();
	});
	/****** /第二屏的切换视频部分 ******/

	/****** 第四屏的音乐播放部分 ******/
	console.log($("#audioPlayer")[0].autoplay);
	// 点击歌名
	$("ul.songList").on('click', "li", function(event) {
		var num = this.dataset.num; // 可以找到哪一首歌
		changeSongName(num);
	    changeAudioSrc(num);
	    changeCDCoverSrc(num);
		event.preventDefault();
		event.stopPropagation();
	});

	// 点击上一曲
	$("div.music_Ctrl").on('click', "div.prev", function(event) {
		var prevNum = getNumArr()[0];
		changeSongName(prevNum);
	    changeAudioSrc(prevNum);
	    changeCDCoverSrc(prevNum);
		judgePlayOrPause();
		event.preventDefault();
		event.stopPropagation();
	});

	// 点击播放按钮
	$("div.music_Ctrl").on('click', "div.play", function(event) {
		judgePlayOrPause();
		event.preventDefault();
		event.stopPropagation();
	});

	// 点击下一曲
	$("div.music_Ctrl").on('click', "div.next", function(event) {
		var nextNum = getNumArr()[2];
		changeSongName(nextNum);
	    changeAudioSrc(nextNum);
	    changeCDCoverSrc(nextNum);
	    judgePlayOrPause();
		event.preventDefault();
		event.stopPropagation();
	});

	// 静音按钮设置
	$("div.music_Ctrl").on('click', "div.muted", function(event) {
		var mutedBtn = $("div.music_Ctrl > div.muted");
		var audioPlayer = $("#audioPlayer")[0];

		if (audioPlayer.muted) {
			mutedBtn.css('background-image', 'url(source/images/p4/voice_on.png)');
		} else {
			mutedBtn.css('background-image', 'url(source/images/p4/voice_off.png)');
		}
		audioPlayer.muted = !audioPlayer.muted;
		event.preventDefault();
		event.stopPropagation();
	});

	// 设置状态条,播放完自动进行下一曲
	$("#audioPlayer").on('timeupdate', function() {
		var currentTime = $(this)[0].currentTime;
		var durationTime = $(this)[0].duration;
		var currentPercent = currentTime / durationTime;
		var progressDomWidth = $("div.progress").width();
		var currentTimeDomWidth = progressDomWidth * currentPercent;

		$("div.currentTime").width(parseInt(currentTimeDomWidth));

		if (this.ended) {
			var nextNum = getNumArr()[2];
			changeSongName(nextNum);
		    changeAudioSrc(nextNum);
		}
	});

	// 根据当前的num更换CD_cover的图片src
	function changeCDCoverSrc(num) {
		var coverSrcArr = ["source/images/p4/DISK0.png",
						   "source/images/p4/DISK1.png",
						   "source/images/p4/DISK2.png",
						   "source/images/p4/DISK3.png",
						   "source/images/p4/DISK4.png",
						   "source/images/p4/DISK5.png",
						   "source/images/p4/DISK6.png"];
		var coverSrc = coverSrcArr[num];	   
		$("img.CD_cover").attr('src', coverSrc);
	}

	// 获取当前num，找到上一个num和下一个num；
	function getNumArr() {
		var currentNum = $("ul.songList > li.currentSong").data("num");
		var prevNum,nextNum;
		prevNum = currentNum == 0 ? 6 : currentNum - 1;
		nextNum = currentNum == 6 ? 0 : currentNum + 1;
		return [prevNum, currentNum, nextNum];
	}

	// 判断是否暂停，并改变背景
	function judgePlayOrPause() {
		var playBtn = $("div.music_Ctrl > div.play");
		var audioPlayer = $("#audioPlayer")[0];

		if (audioPlayer.paused) {
			playBtn.css('background-image', 'url(source/images/p4/button_pause.png)');
			$("div.CD_Ctrl").removeClass('CD_CtrlRotate');
			$("img.CD_cover").addClass('CDRotate');
			audioPlayer.play();
			var imgLight = $("img.light");
			imgLight.removeClass('lightOut');
			imgLight.addClass('lightIn');
		} else {
			playBtn.css('background-image', 'url(source/images/p4/button_on.png)');
			$("div.CD_Ctrl").addClass('CD_CtrlRotate');
			$("img.CD_cover").removeClass('CDRotate');
			audioPlayer.pause();
			var imgLight = $("img.light");
			imgLight.removeClass('lightIn');
			imgLight.addClass('lightOut');
		}
	}

	// 根据num改变audio的src
	function changeAudioSrc(num) {
		var audioSrcArr = ["source/music/maintheme.mp3",
						   "source/music/nebelburg.mp3",
						   "source/music/glacier.mp3",
						   "source/music/liveoaks.mp3",
						   "source/music/abbey.mp3",
						   "source/music/elhalluf.mp3",
						   "source/music/prokhorovka.mp3"];
		var currentSrc = audioSrcArr[num];
		$("#audioPlayer").attr('src', currentSrc);
	}

	// 改变展示的歌名
	function changeSongName(num) {
		var songArr = ["<li data-num='0'>《坦克世界》重制版主章节</li>",
		               "<li data-num='1'>尼德堡序曲</li>",
		               "<li data-num='2'>冰川之地序曲</li>",
		               "<li data-num='3'>里夫奥克斯序曲</li>",
		               "<li data-num='4'>小镇争夺战序曲</li>",
		               "<li data-num='5'>埃里哈罗夫序曲</li>",
	               	   "<li data-num='6'>普罗霍洛夫卡WG Fest序曲</li>"];
	    var currentLiArr = ["<li data-num='0' class='currentSong'>《坦克世界》重制版主章节</li>",
			                "<li data-num='1' class='currentSong'>尼德堡序曲</li>",
			                "<li data-num='2' class='currentSong'>冰川之地序曲</li>",
			                "<li data-num='3' class='currentSong'>里夫奥克斯序曲</li>",
			                "<li data-num='4' class='currentSong'>小镇争夺战序曲</li>",
			                "<li data-num='5' class='currentSong'>埃里哈罗夫序曲</li>",
			                "<li data-num='6' class='currentSong'>普罗霍洛夫卡WG Fest序曲</li>"];
	    var currentLi = currentLiArr[num];
	    num = parseInt(num);
	    var songArrLen = songArr.length;
	    var resultArr = [];
	    if (num == 1) {
	    	resultArr = songArr.splice(num + 1, 2);
	    	resultArr.unshift(currentLi);

	    	resultArr.unshift(songArr.shift());
	    	resultArr.unshift(songArr.pop());
	    } else if (num == 0) {
	    	resultArr = songArr.splice(num + 1, 2);
	    	resultArr.unshift(currentLi);

	    	resultArr = songArr.splice(songArr.length - 3, 2).concat(resultArr);
	    } else if (num == songArrLen - 2) {
	    	resultArr = songArr.splice(num + 1);
	    	resultArr.unshift(currentLi);

	    	resultArr.push(songArr.shift());
	    	resultArr = songArr.splice(songArr.length - 3, 2).concat(resultArr);
	    } else if (num == songArrLen - 1) {
	    	resultArr.push(currentLi);
			resultArr = resultArr.concat(songArr.splice(0, 2));

	    	resultArr = songArr.splice(songArr.length - 3, 2).concat(resultArr);
	    } else {
	    	resultArr = songArr.splice(num + 1, 2);
	        resultArr.unshift(currentLi);

	    	resultArr = songArr.splice(num - 2, 2).concat(resultArr);
	    }

	    var ulListStr = "";
	    var resultArrLen = resultArr.length;
	    for (var i = 0; i < resultArrLen; i++) {
	    	ulListStr += resultArr[i];
	    }
	    $("ul.songList").html(ulListStr);
	}

	/****** /第四屏的音乐播放部分 ******/
})




