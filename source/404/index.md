---
layout: page
title: 404 Page Not Found
comments: false
---



<img src="index/toumiao.png" />

<center>偷瞄~</center>
<center>您访问的资源暂时不存在, 在 <span id="time" style="color:red">10</span> 秒之后, 将跳转回主页</center>

<script type="text/javascript">
$(document).ready(() => {
	setInterval(() => {
		$("#time").text($("#time").text()-1)
		if ($("#time").text() === "0") {
			location.href = "https://haozi.moe";
		}
	}, 1000);
})
</script>