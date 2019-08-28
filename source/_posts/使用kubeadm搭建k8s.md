---
title: 使用kubeadm搭建 k8s
tags:
  - k8s
  - docker
  - 虚拟化
  - 笔记
date: 2019-08-26 10:32:51
---




# 使用 kubeadm 搭建 k8s_

上次把内网的虚拟化清理掉了, 包括内网的一些服务全都没了, 这篇文章就记录一下 k8s 的搭建过程吧

<div style="display:flex">
<?xml version="1.0" encoding="utf-8"?>
<!-- Generator: Adobe Illustrator 21.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg  height="80" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 503.1 89.5" style="enable-background:new 0 0 503.1 89.5;margin:10px" xml:space="preserve">
<style type="text/css">
	.st0{fill:#FFFFFF;stroke:#FFFFFF;stroke-width:5;stroke-miterlimit:10;}
	.st1{fill:#326DE6;}
	.st2{fill:#FFFFFF;}
</style>
<title>Kubernetes_Logo_Hrz_lockup_REV</title>
<g id="Layer_2">
	<g id="Layer_1-2">
		<path class="st0" d="M82.3,21.3c-0.5-1.6-1.7-2.9-3.2-3.7L48.6,3c-0.8-0.4-1.7-0.5-2.5-0.5c-0.8,0-1.7,0-2.5,0.2L13.1,17.4
			c-1.5,0.7-2.6,2-3,3.7L2.6,54c-0.3,1.7,0.1,3.4,1.1,4.8l21.1,26.1c1.2,1.2,2.9,2,4.6,2.1H63c1.8,0.2,3.5-0.6,4.6-2.1l21.1-26.1
			c1-1.4,1.4-3.1,1.2-4.8L82.3,21.3z"/>
		<path class="st1" d="M82.3,21.3c-0.5-1.6-1.7-2.9-3.2-3.7L48.6,3c-0.8-0.4-1.7-0.5-2.5-0.5c-0.8,0-1.7,0-2.5,0.2L13.1,17.4
			c-1.5,0.7-2.6,2-3,3.7L2.6,54c-0.3,1.7,0.1,3.4,1.1,4.8l21.1,26.1c1.2,1.2,2.9,2,4.6,2.1H63c1.8,0.2,3.5-0.6,4.6-2.1l21.1-26.1
			c1-1.4,1.4-3.1,1.2-4.8L82.3,21.3z"/>
		<path class="st2" d="M77.6,52.7L77.6,52.7c-0.1,0-0.2,0-0.2-0.1s-0.2-0.1-0.4-0.1c-0.4-0.1-0.8-0.1-1.2-0.1c-0.2,0-0.4,0-0.6-0.1
			h-0.1c-1.1-0.1-2.3-0.3-3.4-0.6c-0.3-0.1-0.6-0.4-0.7-0.7C71.1,51,71,51,71,51l0,0l-0.8-0.2c0.4-2.9,0.2-5.9-0.4-8.8
			c-0.7-2.9-1.9-5.7-3.5-8.2l0.6-0.6l0,0v-0.1c0-0.3,0.1-0.7,0.3-0.9c0.9-0.8,1.8-1.4,2.8-2l0,0c0.2-0.1,0.4-0.2,0.6-0.3
			c0.4-0.2,0.7-0.4,1.1-0.6c0.1-0.1,0.2-0.1,0.3-0.2S72,29,72,28.9l0,0c0.9-0.7,1.1-1.9,0.4-2.8c-0.3-0.4-0.9-0.7-1.4-0.7
			c-0.5,0-1,0.2-1.4,0.5l0,0l-0.1,0.1c-0.1,0.1-0.2,0.2-0.3,0.2c-0.3,0.3-0.6,0.6-0.8,0.9c-0.1,0.2-0.3,0.3-0.4,0.4l0,0
			c-0.7,0.8-1.6,1.6-2.5,2.2c-0.2,0.1-0.4,0.2-0.6,0.2c-0.1,0-0.3,0-0.4-0.1h-0.1l-0.8,0.5c-0.8-0.8-1.7-1.6-2.5-2.4
			c-3.7-2.9-8.3-4.7-13-5.2l-0.1-0.8l0,0L48,22c-0.3-0.2-0.4-0.5-0.5-0.8c0-1.1,0-2.2,0.2-3.4v-0.1c0-0.2,0.1-0.4,0.1-0.6
			c0.1-0.4,0.1-0.8,0.2-1.2v-0.6l0,0c0.1-1-0.7-2-1.7-2.1c-0.6-0.1-1.2,0.2-1.7,0.7c-0.4,0.4-0.6,0.9-0.6,1.4l0,0v0.5
			c0,0.4,0.1,0.8,0.2,1.2c0.1,0.2,0.1,0.4,0.1,0.6v0.1c0.2,1.1,0.2,2.2,0.2,3.4c-0.1,0.3-0.2,0.6-0.5,0.8L44,22.1l0,0l-0.1,0.8
			c-1.1,0.1-2.2,0.3-3.4,0.5c-4.7,1-9,3.5-12.3,7L27.6,30h-0.1c-0.1,0-0.2,0.1-0.4,0.1c-0.2,0-0.4-0.1-0.6-0.2
			c-0.9-0.7-1.8-1.5-2.5-2.3l0,0c-0.1-0.2-0.3-0.3-0.4-0.4c-0.3-0.3-0.5-0.6-0.8-0.9c-0.1-0.1-0.2-0.1-0.3-0.2s-0.1-0.1-0.1-0.1l0,0
			c-0.4-0.3-0.9-0.5-1.4-0.5c-0.6,0-1.1,0.2-1.4,0.7c-0.6,0.9-0.4,2.1,0.4,2.8l0,0c0.1,0,0.1,0.1,0.1,0.1s0.2,0.2,0.3,0.2
			c0.3,0.2,0.7,0.4,1.1,0.6c0.2,0.1,0.4,0.2,0.6,0.3l0,0c1,0.6,2,1.2,2.8,2c0.2,0.2,0.4,0.6,0.3,0.9V33l0,0l0.6,0.6
			c-0.1,0.2-0.2,0.3-0.3,0.5C22.4,39,21.1,44.8,22,50.5l-0.8,0.2l0,0c0,0.1-0.1,0.1-0.1,0.1c-0.1,0.3-0.4,0.5-0.7,0.7
			c-1.1,0.3-2.2,0.5-3.4,0.6H17c-0.2,0-0.4,0-0.6,0.1c-0.4,0-0.8,0.1-1.2,0.1c-0.1,0-0.2,0.1-0.4,0.1c-0.1,0-0.1,0-0.2,0.1l0,0
			c-1.1,0.2-1.8,1.2-1.6,2.3c0,0,0,0,0,0c0.2,0.9,1.1,1.5,2,1.4c0.2,0,0.3,0,0.5-0.1l0,0c0.1,0,0.1,0,0.1-0.1S15.9,56,16,56
			c0.4-0.1,0.8-0.3,1.1-0.4c0.2-0.1,0.4-0.2,0.6-0.2h0.1c1.1-0.4,2.1-0.7,3.3-0.9h0.1c0.3,0,0.6,0.1,0.8,0.3c0.1,0,0.1,0.1,0.1,0.1
			l0,0l0.9-0.1c1.5,4.6,4.3,8.7,8.2,11.7c0.9,0.7,1.7,1.3,2.7,1.8L33.4,69l0,0c0,0.1,0.1,0.1,0.1,0.1c0.2,0.3,0.2,0.7,0.1,1
			c-0.4,1-1,2-1.6,2.9v0.1c-0.1,0.2-0.2,0.3-0.4,0.5s-0.4,0.6-0.7,1c-0.1,0.1-0.1,0.2-0.2,0.3c0,0,0,0.1-0.1,0.1l0,0
			c-0.5,1-0.1,2.2,0.8,2.7c0.2,0.1,0.5,0.2,0.7,0.2c0.8,0,1.5-0.5,1.9-1.2l0,0c0,0,0-0.1,0.1-0.1c0-0.1,0.1-0.2,0.2-0.3
			c0.1-0.4,0.3-0.7,0.4-1.1l0.2-0.6l0,0c0.3-1.1,0.8-2.1,1.3-3.1c0.2-0.3,0.5-0.5,0.8-0.6c0.1,0,0.1,0,0.1-0.1l0,0l0.4-0.8
			c2.8,1.1,5.7,1.6,8.7,1.6c1.8,0,3.6-0.2,5.4-0.7c1.1-0.2,2.2-0.6,3.2-0.9l0.4,0.7l0,0c0.1,0,0.1,0,0.1,0.1
			c0.3,0.1,0.6,0.3,0.8,0.6c0.5,1,1,2,1.3,3.1v0.1l0.2,0.6c0.1,0.4,0.2,0.8,0.4,1.1c0.1,0.1,0.1,0.2,0.2,0.3c0,0,0,0.1,0.1,0.1l0,0
			c0.4,0.7,1.1,1.2,1.9,1.2c0.3,0,0.5-0.1,0.8-0.2c0.4-0.2,0.8-0.6,0.9-1.1c0.1-0.5,0.1-1-0.1-1.5l0,0c0-0.1-0.1-0.1-0.1-0.1
			c0-0.1-0.1-0.2-0.2-0.3c-0.2-0.4-0.4-0.7-0.7-1c-0.1-0.2-0.2-0.3-0.4-0.5V73c-0.7-0.9-1.2-1.9-1.6-2.9c-0.1-0.3-0.1-0.7,0.1-1
			c0-0.1,0.1-0.1,0.1-0.1l0,0l-0.3-0.8c5.1-3.1,9-7.9,10.8-13.6l0.8,0.1l0,0c0.1,0,0.1-0.1,0.1-0.1c0.2-0.2,0.5-0.3,0.8-0.3h0.1
			c1.1,0.2,2.2,0.5,3.2,0.9h0.1c0.2,0.1,0.4,0.2,0.6,0.2c0.4,0.2,0.7,0.4,1.1,0.5c0.1,0,0.2,0.1,0.4,0.1c0.1,0,0.1,0,0.2,0.1l0,0
			c0.2,0.1,0.3,0.1,0.5,0.1c0.9,0,1.7-0.6,2-1.4C79.3,53.7,78.5,52.9,77.6,52.7z M48.7,49.6L46,50.9l-2.7-1.3l-0.7-2.9l1.9-2.4h3
			l1.9,2.4L48.7,49.6z M65,43.1c0.5,2.1,0.6,4.2,0.4,6.3l-9.5-2.7l0,0c-0.9-0.2-1.4-1.1-1.2-2c0.1-0.3,0.2-0.5,0.4-0.7l7.5-6.8
			C63.7,39,64.5,41,65,43.1z M59.6,33.5l-8.2,5.8c-0.7,0.4-1.7,0.3-2.2-0.4c-0.2-0.2-0.3-0.4-0.3-0.7l-0.6-10.1
			C52.7,28.6,56.6,30.5,59.6,33.5L59.6,33.5z M41.5,28.4l2-0.4L43,38l0,0c0,0.9-0.8,1.6-1.7,1.6c-0.3,0-0.5-0.1-0.8-0.2l-8.3-5.9
			C34.8,31,38,29.2,41.5,28.4z M29.3,37.2l7.4,6.6l0,0c0.7,0.6,0.8,1.6,0.2,2.3c-0.2,0.3-0.4,0.4-0.8,0.5l-9.7,2.8
			C26.1,45.2,27.1,40.9,29.3,37.2z M27.6,54.1l9.9-1.7c0.8,0,1.6,0.5,1.7,1.3c0.1,0.3,0.1,0.7-0.1,1l0,0l-3.8,9.2
			C31.8,61.6,29,58.1,27.6,54.1z M50.3,66.5C48.9,66.8,47.5,67,46,67c-2.1,0-4.3-0.4-6.3-1l4.9-8.9c0.5-0.6,1.3-0.8,2-0.4
			c0.3,0.2,0.5,0.4,0.8,0.7l0,0l4.8,8.7C51.6,66.2,51,66.3,50.3,66.5z M62.5,57.8c-1.5,2.4-3.6,4.5-6,6l-3.9-9.4
			c-0.2-0.8,0.2-1.6,0.9-1.9c0.3-0.1,0.6-0.2,0.9-0.2l10,1.7C63.9,55.4,63.3,56.7,62.5,57.8z"/>
		<g id="layer1">
			<g id="text4373">
				<path id="path2985" class="st1" d="M128.1,48.4c1.1-1.2,2.1-2.4,3.3-3.6c1.1-1.3,2.2-2.5,3.3-3.7c1.1-1.3,2.1-2.4,3-3.5
					s1.8-2.1,2.5-2.9H153c-2.6,2.9-5.1,5.8-7.5,8.5c-2.5,2.7-5.1,5.5-8,8.3c1.6,1.5,3.1,3,4.5,4.7c1.5,1.8,3,3.6,4.5,5.6
					c1.4,1.9,2.8,3.9,4,5.8c1.2,1.9,2.2,3.7,3,5.3h-12.4c-0.8-1.3-1.7-2.6-2.7-4.1s-2.1-3-3.1-4.6c-1.1-1.5-2.3-3-3.6-4.4
					c-1.1-1.3-2.3-2.5-3.6-3.5v16.7h-10.8V18.2l10.8-1.7L128.1,48.4"/>
				<path id="path2987" class="st1" d="M191.1,71.4c-2.3,0.6-4.7,1.1-7.1,1.4c-3,0.5-6.1,0.7-9.1,0.7c-2.8,0.1-5.5-0.4-8.1-1.3
					c-2-0.8-3.7-2-5.1-3.6c-1.3-1.7-2.2-3.6-2.7-5.7c-0.6-2.3-0.8-4.8-0.8-7.2V34.6H169v19.9c0,3.5,0.5,6,1.4,7.5s2.6,2.3,5.1,2.3
					c0.8,0,1.6,0,2.5-0.1s1.6-0.1,2.3-0.3V34.6h10.8L191.1,71.4"/>
				<path id="path2989" class="st1" d="M225.7,53.4c0-7-2.6-10.4-7.7-10.4c-1.1,0-2.2,0.1-3.3,0.4c-0.9,0.2-1.8,0.6-2.6,1.1v19.6
					c0.5,0.1,1.2,0.2,2,0.3c0.8,0.1,1.7,0.1,2.7,0.1c2.6,0.2,5.1-0.9,6.7-3C225,59.1,225.8,56.3,225.7,53.4 M236.7,53.8
					c0,2.8-0.4,5.6-1.4,8.3c-0.8,2.4-2.1,4.5-3.8,6.3c-1.8,1.8-3.9,3.2-6.2,4.1c-2.7,1-5.5,1.4-8.4,1.4c-1.3,0-2.7-0.1-4.1-0.2
					c-1.4-0.1-2.8-0.3-4.2-0.4c-1.3-0.2-2.6-0.4-3.9-0.7c-1.3-0.2-2.4-0.5-3.3-0.9V18.2l10.8-1.7v19c1.2-0.5,2.5-0.9,3.8-1.2
					c1.4-0.3,2.8-0.4,4.2-0.4c2.5,0,4.9,0.4,7.2,1.5c2,0.9,3.8,2.3,5.2,4c1.5,1.9,2.6,4,3.2,6.3C236.4,48.2,236.7,51,236.7,53.8"/>
				<path id="path2991" class="st1" d="M243.2,54c-0.1-3,0.5-6,1.5-8.8c0.9-2.4,2.3-4.5,4.1-6.4c1.7-1.7,3.6-3,5.8-3.8
					c2.2-0.9,4.5-1.3,6.8-1.3c5.4,0,9.7,1.7,12.8,5c3.1,3.3,4.7,8.2,4.7,14.5c0,0.6,0,1.3-0.1,2.1s-0.1,1.4-0.1,2h-24.5
					c0.2,2.1,1.3,4.1,3.1,5.3c2.2,1.4,4.8,2.1,7.4,2c1.9,0,3.9-0.2,5.8-0.5c1.6-0.3,3.2-0.8,4.7-1.4l1.5,8.8
					c-0.7,0.4-1.5,0.6-2.3,0.9c-1.1,0.3-2.2,0.6-3.3,0.7c-1.2,0.2-2.4,0.4-3.8,0.6c-1.3,0.1-2.7,0.2-4.1,0.2c-3.1,0.1-6.1-0.4-9-1.5
					c-2.4-0.9-4.5-2.3-6.3-4.1c-1.7-1.8-2.9-4-3.7-6.3C243.6,59.3,243.2,56.7,243.2,54 M268.6,49.9c0-0.9-0.2-1.8-0.5-2.7
					c-0.2-0.9-0.7-1.6-1.2-2.3c-0.6-0.7-1.3-1.3-2.1-1.7c-1-0.5-2-0.7-3.1-0.7c-1.1,0-2.1,0.2-3.1,0.7c-0.8,0.4-1.6,0.9-2.2,1.6
					c-0.6,0.7-1.1,1.5-1.4,2.4c-0.3,0.9-0.5,1.8-0.6,2.7L268.6,49.9"/>
				<path id="path2993" class="st1" d="M310.3,44.2c-1-0.2-2.1-0.5-3.4-0.7c-1.4-0.3-2.8-0.4-4.2-0.4c-0.8,0-1.6,0.1-2.5,0.2
					c-0.7,0.1-1.4,0.2-2.1,0.4v29.1h-10.8V36.6c2.2-0.8,4.5-1.4,6.8-1.9c2.9-0.7,5.9-1,8.8-0.9c0.7,0,1.4,0.1,2.1,0.1
					c0.8,0,1.6,0.1,2.5,0.3c0.8,0.1,1.6,0.2,2.5,0.4c0.7,0.1,1.4,0.3,2.1,0.6L310.3,44.2"/>
				<path id="path2995" class="st1" d="M317.9,35.9c2.3-0.6,4.7-1.1,7.1-1.5c3-0.5,6.1-0.7,9.1-0.7c2.7-0.1,5.4,0.4,8,1.3
					c2,0.7,3.8,1.9,5.1,3.5c1.3,1.6,2.2,3.5,2.7,5.5c0.6,2.3,0.8,4.7,0.8,7.1v21.5H340V52.5c0-3.5-0.5-5.9-1.4-7.4
					c-0.9-1.4-2.6-2.2-5.1-2.2c-0.8,0-1.6,0-2.5,0.1c-0.9,0-1.6,0.1-2.3,0.2v29.4h-10.8L317.9,35.9"/>
				<path id="path2997" class="st1" d="M358.9,54c-0.1-3,0.5-6,1.5-8.8c0.9-2.4,2.3-4.5,4.1-6.4c1.7-1.7,3.6-3,5.8-3.8
					c2.2-0.9,4.5-1.3,6.8-1.3c5.4,0,9.7,1.7,12.8,5c3.1,3.3,4.7,8.2,4.7,14.6c0,0.6,0,1.3-0.1,2.1s-0.1,1.4-0.1,2h-24.5
					c0.2,2.1,1.3,4.1,3.1,5.3c2.2,1.4,4.8,2.1,7.4,2c1.9,0,3.9-0.2,5.8-0.5c1.6-0.3,3.2-0.8,4.8-1.5l1.5,8.8
					c-0.7,0.4-1.5,0.6-2.3,0.9c-1.1,0.3-2.2,0.6-3.3,0.7c-1.2,0.2-2.4,0.4-3.8,0.6c-1.3,0.1-2.7,0.2-4.1,0.2c-3.1,0.1-6.1-0.4-9-1.5
					c-2.4-0.9-4.5-2.3-6.3-4.1c-1.7-1.8-2.9-4-3.7-6.3C359.2,59.3,358.8,56.6,358.9,54 M384.2,49.9c0-0.9-0.2-1.8-0.5-2.7
					c-0.2-0.9-0.7-1.6-1.2-2.3c-0.6-0.7-1.3-1.3-2.1-1.7c-1-0.5-2-0.7-3.1-0.7c-1.1,0-2.1,0.2-3.1,0.7c-0.8,0.4-1.5,0.9-2.1,1.6
					c-0.6,0.7-1.1,1.5-1.4,2.4c-0.3,0.9-0.5,1.8-0.6,2.7L384.2,49.9"/>
				<path id="path2999" class="st1" d="M402.6,25.1l10.8-1.7v11.2h13v9h-13V57c-0.1,1.9,0.3,3.8,1.2,5.4c0.8,1.3,2.4,2,4.9,2
					c1.2,0,2.4-0.1,3.5-0.3c1.2-0.2,2.3-0.5,3.4-0.9l1.5,8.4c-1.4,0.6-2.9,1-4.4,1.4c-1.9,0.4-3.9,0.6-5.9,0.6
					c-2.5,0.1-5-0.3-7.3-1.2c-1.8-0.7-3.4-1.9-4.6-3.3c-1.2-1.5-2-3.3-2.5-5.2c-0.5-2.2-0.7-4.5-0.6-6.7V25.1"/>
				<path id="path3001" class="st1" d="M431.9,54c-0.1-3,0.5-6,1.5-8.8c0.9-2.4,2.3-4.5,4.1-6.4c1.7-1.7,3.6-3,5.8-3.8
					c2.2-0.9,4.5-1.3,6.8-1.3c5.4,0,9.7,1.7,12.8,5s4.7,8.2,4.7,14.6c0,0.6,0,1.3-0.1,2.1c0,0.8-0.1,1.4-0.1,2H443
					c0.2,2.1,1.3,4.1,3.1,5.3c2.2,1.4,4.8,2.1,7.4,2c1.9,0,3.9-0.2,5.8-0.5c1.6-0.3,3.2-0.8,4.7-1.5l1.5,8.8
					c-0.7,0.4-1.5,0.6-2.3,0.9c-1.1,0.3-2.2,0.6-3.3,0.7c-1.2,0.2-2.4,0.4-3.8,0.6c-1.3,0.1-2.7,0.2-4.1,0.2c-3.1,0.1-6.1-0.4-9-1.5
					c-2.4-0.9-4.5-2.3-6.3-4.1c-1.7-1.8-2.9-4-3.7-6.3C432.3,59.3,431.9,56.6,431.9,54 M457.2,49.9c0-0.9-0.2-1.8-0.5-2.7
					c-0.2-0.9-0.7-1.6-1.2-2.3c-0.6-0.7-1.3-1.3-2.1-1.7c-1-0.5-2-0.7-3.1-0.7c-1.1,0-2.1,0.2-3.1,0.7c-0.8,0.4-1.6,0.9-2.2,1.6
					c-0.6,0.7-1.1,1.5-1.4,2.4c-0.3,0.9-0.5,1.8-0.6,2.7L457.2,49.9"/>
				<path id="path3003" class="st2" d="M487,65c1.4,0.1,2.9-0.1,4.2-0.6c0.8-0.4,1.3-1.3,1.2-2.2c-0.1-1-0.7-1.9-1.6-2.2
					c-1.5-0.9-3.2-1.7-4.9-2.2c-1.7-0.6-3.2-1.3-4.6-2c-1.3-0.6-2.4-1.4-3.5-2.4c-1-1-1.7-2.1-2.2-3.4c-0.6-1.5-0.8-3.1-0.8-4.7
					c-0.1-3.3,1.4-6.5,4-8.5c2.7-2.1,6.3-3.1,10.9-3.1c2.2,0,4.5,0.2,6.7,0.7c1.7,0.3,3.4,0.7,5.1,1.3l-1.9,8.5
					c-1.4-0.5-2.7-0.8-4.1-1.2c-1.6-0.4-3.3-0.5-4.9-0.5c-3.4,0-5.1,0.9-5.1,2.8c0,0.4,0.1,0.8,0.2,1.2c0.2,0.4,0.5,0.7,0.9,1
					c0.4,0.3,1,0.6,1.7,1c0.7,0.4,1.7,0.8,2.9,1.2c2,0.7,4,1.6,5.8,2.6c1.4,0.7,2.6,1.6,3.6,2.8c0.9,0.9,1.5,2,1.9,3.3
					c0.4,1.4,0.6,2.8,0.6,4.2c0.2,3.4-1.4,6.7-4.3,8.6c-2.8,1.9-6.8,2.9-12,2.9c-2.9,0.1-5.7-0.2-8.5-0.9c-1.6-0.4-3.1-0.9-4.6-1.4
					l1.8-8.8c1.8,0.7,3.7,1.3,5.6,1.7C483.1,64.8,485,65,487,65"/>
			</g>
		</g>
	</g>
</g>
</svg>
<span style="line-height: 100px;text-align: center;font-size: 80px;color: #326DE6;"> & </span>
<img src="/2019/08/26/使用kubeadm搭建k8s/kubeadm-logo.png" style="margin-left: 30px !important;margin-top: 10px !important;height:80px" >
</div> 

<!-- more -->

## 准备

先把服务器准备好, 搭建 k8s 最小化的集群, 一个 master 2 个 node

* 机器 

| \\\\    | Master1     | Node1       | Node2       |
|----------|:-------------:|------:|------:|
| CPU  | 2 核心      | 2 核心      | 2 核心      |
| 内存 | 2G          | 4G          | 4G          |
| 磁盘 | 30G 本地SSD | 30G 本地SSD | 30G 本地SSD |

磁盘给的不多, 后面需要数据持久化的时候远程挂在 NFS 存储即可,性能也给的不多, 后期按需求添加

* 系统 (Centos 7)

所有的均关闭了 SELinux, 防火墙

### 关闭 SELinux

在每一个节点上面运行以下命令, 以关闭 selinux

```sh
setenforce 0
sed -i 's/^SELINUX=enforcing$/SELINUX=permissive/' /etc/selinux/config
```
### 关闭防火墙
```sh
systemctl stop firewalld.service
systemctl disable firewalld.service
```

###  设置路由

```sh
cat <<EOF >  /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
EOF
sysctl --system
```

### 设置转发

```sh
echo 1 > /proc/sys/net/ipv4/ip_forward
```

### 关闭 Swap 分区

```sh
echo "vm.swappiness = 0">> /etc/sysctl.conf  
swapoff -a && swapon -a   # 写回所有数据
sysctl -p  #(执行这个使其生效，不用重启)
# 编辑 /etc/fstab 删除  swap 挂载
# 如果还是无效 reboot 一下
```



## 安装

> 下面的所有步骤均按照 [kubernetes 官方教程](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm/) 操作, 且使用了代理, 未使用相关的国内镜像服务, 请在相关的 yum, docker 处做好 proxy

### 安装 DockerCE

先安装  `yum-config-manager`

```sh
sudo yum install -y yum-utils device-mapper-persistent-data lvm2
```

添加仓库

```sh
sudo yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo
```
安装 docker-ce
```sh
sudo yum install docker-ce docker-ce-cli containerd.io -y
sudo systemctl enable --now docker
```

**当前版本建议安装 `18.09`的版本, 但是因为我头铁, 所以选最新的**

### 安装kubeadm

在每一个节点上运行以下命令, 添加 kubernetes 的仓库

```sh
cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
EOF
```

安装 `kubeadm`

```sh
yum install -y kubelet kubeadm kubectl --disableexcludes=kubernetes
```

启动 `kubeadm`

```sh
systemctl enable --now kubelet
```



## 初始化

## Master 节点

运行

```sh
kubeadm init --pod-network-cidr=10.244.0.0/16
```

如果出现了类似这样的提示

```
	[WARNING IsDockerSystemdCheck]: detected "cgroupfs" as the Docker cgroup driver. The recommended driver is "systemd". Please follow the guide at https://kubernetes.io/docs/setup/cri/
```

参照 [Container runtimes](https://kubernetes.io/docs/setup/production-environment/container-runtimes/) 修复, 过程如下

```sh
## Create /etc/docker directory.
mkdir /etc/docker

# Setup daemon.
cat > /etc/docker/daemon.json <<EOF
{
  "exec-opts": ["native.cgroupdriver=systemd"],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m"
  },
  "storage-driver": "overlay2",
  "storage-opts": [
    "overlay2.override_kernel_check=true"
  ]
}
EOF

mkdir -p /etc/systemd/system/docker.service.d

# Restart Docker
systemctl daemon-reload
systemctl restart docker
```

然后按照 [Configure cgroup driver used by kubelet on control-plane node](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)进行修改

编辑 `/etc/default/kubelet`文件添加

```sh
KUBELET_EXTRA_ARGS=--cgroup-driver=systemd
```

然后

```sh
systemctl daemon-reload
systemctl restart kubelet
```

亲测有效



如果发现镜像下载不下来

```sh
#编辑 
vi /etc/systemd/system/docker.service.d/http-proxy.conf
# 如果提示文件夹不存在 就先创建
mkdir -p /etc/systemd/system/docker.service.d
#添加

[Service]
Environment="HTTP_PROXY=http://proxy-addr:proxy-port" "HTTPS_PROXY=http://proxy-addr:proxy-port" "NO_PROXY=localhost,127.0.0.1"

# 重启
systemctl daemon-reload
systemctl restart docker

# 下载镜像
kubeadm config images pull
```

如果镜像拉取完成, 重新执行 `init` 操作, 完成之后如下

```sh
Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/

Then you can join any number of worker nodes by running the following on each as root:

kubeadm join 192.168.50.160:6443 --token 8tu5cg.u8frzod9ddjm67lf \
    --discovery-token-ca-cert-hash sha256:68383ad315c9da26f8d3848d216477dc109b24787960e6cc7065913476dabca2
```

执行其中的

```
sudo cp /etc/kubernetes/admin.conf $HOME/
sudo chown $(id -u):$(id -g) $HOME/admin.conf
export KUBECONFIG=$HOME/admin.conf
```



记录 Master 机器的这个信息以后要用到

```sh
kubeadm join 192.168.50.160:6443 --token te0pye.vdexzm8onjil28g6 \
    --discovery-token-ca-cert-hash sha256:68383ad315c9da26f8d3848d216477dc109b24787960e6cc7065913476dabca2
```



## Node 节点

在每个 node 节点上面运行上面 master 节点保存的 `kubeadm join`,如果出现了问题, 参考上面 master 的处理方式进行操作

 加入到 Master 的集群里面

> 这里我遇到了一个问题, 我忘记修改 hostname 了, 导致三个节点的 hostname 为同一个, 虽然下 join 的时候不会报错, 但是get nodes 的时候除了 master 其他的都不会显示, 修改方式为 ` hostnamectl  set-hostname <hostname>`

上面的所有操作完成之后 `kubectl get nodes` 如下图
```sh
[root@localhost ~]# kubectl get node
NAME               STATUS     ROLES    AGE     VERSION
haozi.k8s-master   NotReady   master   4m13s   v1.15.3
haozi.k8s-node1    NotReady   <none>   3m12s   v1.15.3
haozi.k8s-node2    NotReady   <none>   67s     v1.15.3
```

不过这个时候所有的节点都处在 `NotReady`的状态, 这时候还缺一个 网络插件, 这里我们安装`flannel`

在 Master 上面执行

```sh
kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/62e44c867a2846fefb68bd5f178daf4da3095ccb/Documentation/kube-flannel.yml
```

等待完成之后 运行 `kubectl get pods -A`

```
[root@localhost ~]# kubectl get pods -A
NAMESPACE     NAME                                       READY   STATUS    RESTARTS   AGE
kube-system   coredns-5c98db65d4-85xx4                   1/1     Running   0          2m53s
kube-system   coredns-5c98db65d4-lp8w9                   1/1     Running   0          2m54s
kube-system   etcd-haozi.k8s-master                      1/1     Running   0          114s
kube-system   kube-apiserver-haozi.k8s-master            1/1     Running   0          2m1s
kube-system   kube-controller-manager-haozi.k8s-master   1/1     Running   0          113s
kube-system   kube-flannel-ds-amd64-65wmg                1/1     Running   0          71s
kube-system   kube-flannel-ds-amd64-q5jpt                1/1     Running   0          71s
kube-system   kube-flannel-ds-amd64-rm5mb                1/1     Running   0          71s
kube-system   kube-proxy-26bfq                           1/1     Running   0          2m24s
kube-system   kube-proxy-qmb7p                           1/1     Running   0          2m54s
kube-system   kube-proxy-zsmpv                           1/1     Running   0          2m27s
kube-system   kube-scheduler-haozi.k8s-master            1/1     Running   0          107s
```

可以看到 flannel 的组建都已经 Running, 这时候我们再查看一下 node 的状态

```
[root@localhost ~]# kubectl get node
NAME               STATUS   ROLES    AGE     VERSION
haozi.k8s-master   Ready    master   4m16s   v1.15.3
haozi.k8s-node1    Ready    <none>   3m31s   v1.15.3
haozi.k8s-node2    Ready    <none>   3m28s   v1.15.3
```

都已经 Ready,

致此, 基本安装已经结束

