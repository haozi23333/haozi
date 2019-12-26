---
title: metabase与Aggregation
date: 2019-12-17 19:45:59
tags:
	- 笔记
---



# Metabase 与Aggregation

最近入职之后第一个项目就是和数据分析相关的, 由于定的时间比较短, 数据源比较难整理, 留给处理数据的时间不是很多索性选择了 MongoDB 作为数据源,  只需要稍微处理数据, 整个丢到数据库, 不需要做太多的处理



这里分享一下我在使用中的一些感受



## Aggregation 的 $match 函数中是不能使用 `$exist`

