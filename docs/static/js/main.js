/** Useful codes.
 * @Author @iwasakishuto <https://github.com/iwasakishuto>
 * @Editor @akari-doichan <https://github.com/akari-doichan>
 * @License MIT license <https://github.com/akari-doichan/embuddyChapterDiviser/blob/main/LICENSE>
 */

var target_video, google_drive_video, google_drive_inner_iframe;
const video_url_input = document.querySelector("input#video-url");
const upload_video_btn = document.querySelector("input#upload-video");
const uploaded_video = document.querySelector("video#uploaded-video");
const google_drive_iframe = document.querySelector("iframe#google-drive");
const video_start_stop_btn = document.querySelector("button#video-start-stop");
const video_skip_10s = document.querySelector("button#video-skip-10s");
const video_back_10s = document.querySelector("button#video-back-10s");
const video_curt_speed = document.querySelector("span#video-curt-speed");
const video_speed_control = document.querySelector("input#video-speed");
const video_curt_position = document.querySelector("span#video-curt-position");
const video_position_control = document.querySelector("input#video-position");
const video_mute_btn = document.querySelector("input#video-mute");
const video_max_position = document.querySelector("div#video-max-position");
const video_info = document.querySelector("tbody#video-info");

const startVideoTimer = (url) => {
  target_video.addEventListener("timeupdate", function () {
    video_curt_position.textContent = target_video.currentTime.toFixed(1);
  });
  var updateVideoStatesTimer = setInterval(function () {
    if (target_video.readyState > 0) {
      let duration = target_video.duration.toString();
      video_position_control.max = duration;
      video_max_position.innerHTML = date_formate(duration).slice(0, -3);
      clearInterval(updateVideoStatesTimer);
    }
  }, 300);
  startTimer();
};

//=== Upload Video ===
upload_video_btn.addEventListener(
  "change",
  function (event) {
    var URL = URL || webkitURL;
    var file = event.target.files[0];
    uploaded_video.src = URL.createObjectURL(file);
    target_video = uploaded_video;
    uploaded_video.style.display = "inline";
    google_drive_iframe.style.display = "none";
    startVideoTimer();
  },
  false
);

// Input Google Drive Video Id.
video_url_input.addEventListener(
  "change",
  function (event) {
    google_drive_iframe.src = `https://drive.google.com/file/d/${video_url_input.value}/preview`;
    google_drive_iframe.style.display = "inline";
    uploaded_video.style.display = "none";
    var start_find_google_drive_video = setInterval(function () {
      google_drive_inner_iframe = google_drive_iframe.contentWindow.document.querySelector(
        "iframe#drive-viewer-video-player-object-0"
      );
      if (google_drive_inner_iframe != null) {
        google_drive_video = google_drive_inner_iframe.contentWindow.document.querySelector(
          "#movie_player > div.html5-video-container > video"
        );
        if (google_drive_video != null) {
          target_video = google_drive_video;
          startTimer();
          clearInterval(start_find_google_drive_video);
        }
      }
    }, 500);
  },
  false
);

const zeropad = function (v) {
  return ("00" + v).slice(-2);
};

const date_formate = function (ds) {
  let sec = Math.floor(ds);
  let msec = ((ds - sec) * 100).toFixed(0);
  let min = Math.floor(sec / 60);
  sec -= min * 60;
  return zeropad(min) + ":" + zeropad(sec) + ":" + zeropad(msec);
};

/* <--- Video Controller --- */
var playtimer = null;
const startTimer = function () {
  playtimer = setInterval(function () {
    video_position_control.value = target_video.currentTime.toFixed(1);
  }, 100);
};
const stopTimer = function () {
  clearInterval(playtimer);
};
video_skip_10s.addEventListener("click", function () {
  target_video.currentTime = Math.min(
    target_video.currentTime + 10,
    target_video.duration
  );
});
video_back_10s.addEventListener("click", function () {
  target_video.currentTime = Math.max(target_video.currentTime - 10, 0);
});
video_start_stop_btn.addEventListener("click", function () {
  if (video_start_stop_btn.classList.contains("playing")) {
    target_video.pause();
    stopTimer();
    video_start_stop_btn.classList.add("pausing");
    video_start_stop_btn.classList.remove("playing");
    video_start_stop_btn.innerHTML = "Play";
  } else {
    target_video.play();
    startTimer();
    video_start_stop_btn.classList.add("playing");
    video_start_stop_btn.classList.remove("pausing");
    video_start_stop_btn.innerHTML = "Pause";
  }
});
video_speed_control.addEventListener("change", function () {
  let curt_speed = video_speed_control.value;
  target_video.playbackRate = curt_speed;
  video_curt_speed.textContent = curt_speed;
});
video_position_control.addEventListener("input", function () {
  target_video.currentTime = video_position_control.value;
  stopTimer();
});
video_position_control.addEventListener("change", function () {
  target_video.currentTime = video_position_control.value;
  startTimer();
});
video_mute_btn.addEventListener("click", function () {
  target_video.muted = video_mute_btn.checked;
});
/* --- Video Controller ---> */

$(document).on("click", ".add", function () {
  var target = $(this).parent().parent();
  var clone = target.clone(true);
  var target_select = target[0].querySelectorAll("select");
  var clone_select = clone[0].querySelectorAll("select");
  for (let i = 0; i < target_select.length; i++) {
    clone_select[i].selectedIndex = target_select[i].selectedIndex;
  }
  clone.insertAfter(target);
});
$(document).on("click", ".del", function () {
  var target = $(this).parent().parent();
  if (target.parent().children().length > 1) {
    target.remove();
  }
});

// Input Current Time
$("#video-info-table").on(
  "keydown",
  'input[name$="start"], input[name$="end"]',
  function (e) {
    if (e.keyCode == 13) {
      // Video is already Uploaded
      $(this)[0].value = target_video.currentTime.toFixed(0);
      e.preventDefault();
    }
  }
);

$(document).on("click", "#copy2clipboardBtn", function () {
  var text = "";

  var copyListener = function (e) {
    var text = "";
    var values = [];
    video_info.querySelectorAll("tr").forEach(function (e, i) {
      values.push([
        e.querySelector("input[name='label']").value,
        e.querySelector("input[name='start']").value,
      ]);
    });
    values.forEach(function (e, i) {
      if (i == values.length - 1) {
        text += `${e[0]}\t${e[1]}\t${parseInt(target_video.duration) - e[1]}`;
      } else {
        text += `${e[0]}\t${e[1]}\t${values[i + 1][1] - e[1]}\n`;
      }
    });
    e.clipboardData.setData("text/plain", text.trim());
    e.preventDefault();
    document.removeEventListener("copy", copyListener);
  };

  document.addEventListener("copy", copyListener);
  document.execCommand("copy");
  alert("コピーされました。");
});
