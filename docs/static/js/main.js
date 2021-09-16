/** Useful codes.
 * @Author @iwasakishuto <https://github.com/iwasakishuto>
 * @Editor @akari-doichan <https://github.com/akari-doichan>
 * @License MIT license <https://github.com/akari-doichan/embuddyChapterDiviser/blob/main/LICENSE>
 */

const upload_video_btn = document.querySelector("input#upload-video");
const uploaded_video = document.querySelector("video#uploaded-video");
const video_info = document.querySelector("tbody#video-info");

//=== Upload Video ===
upload_video_btn.addEventListener("change", function (event) {
  var URL = URL || webkitURL;
  var file = event.target.files[0];
  uploaded_video.src = URL.createObjectURL(file);
});

//=== Move Form ===
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
      $(this)[0].value = uploaded_video.currentTime.toFixed(0);
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
        text += `${e[0]}\t${e[1]}\t${parseInt(uploaded_video.duration) - e[1]}`;
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
