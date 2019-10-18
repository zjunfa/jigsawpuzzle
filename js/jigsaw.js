var c = document.getElementById('myCanvas');
var ctx = c.getContext('2d');
var series=3;
var num = [
	[00, 01, 02],
	[10, 11, 12],
	[20, 21, 22],
];
var w = 100;

function allowDrop(e) { //ondragover事件回调函数
	e.preventDefault(); //解禁当前元素为可放置被拖拽元素的区域
}

function fileDrop(e) { //ondrop事件的回调函数
	e.preventDefault(); //解禁当前元素为可放置被拖拽元素的区域
	var pictureList = document.getElementById('pictureList'); //获取图片展示区域对象output
	var files = e.dataTransfer.files;
	for(var i = 0, f; f = files[i]; i++) {
		var imgURL = window.webkitURL.createObjectURL(f);
		var img = document.createElement('img');
		img.setAttribute('src', imgURL);
		var photo = document.createElement('li');
		photo.appendChild(img);
		pictureList.insertBefore(photo, pictureList.children[0]);
	}
	bindingEvents()
}

function bindingEvents() {//给左边的列表图绑定事件
	for(var i = 0; i < pictureList.children.length; i++) {
		pictureList.children[i].onclick = function() {
			myImage.setAttribute('src', this.children[0].src);
			s = -1;
			m = 0;
			h = 0;
			getCurrentTime();
			getImageWidth(img.src, function(w, h) {
				width = w / series;
				height = h / series;
				generateNum();
				drawCanvas();
			});
		}
	}
}
bindingEvents();
var img = document.getElementById('myImage');

function change () {//改变难度是触发的函数
	series=parseInt(selectID.value);
	c.width=series*100;
	c.height=series*100;
	s = -1;
	m = 0;
	h = 0;
	getCurrentTime();
	if (series==3) {
		num = [
			[00, 01, 02],
			[10, 11, 12],
			[20, 21, 22],
		];
		
	} else if(series==4){
		num = [
			[00, 01, 02,03],
			[10, 11, 12,13],
			[20, 21, 22,23],
			[30, 31, 32,33],
		];
	} else if(series==5){
		num = [
			[00, 01, 02,03,04],
			[10, 11, 12,13,14],
			[20, 21, 22,23,24],
			[30, 31, 32,33,34],
			[40, 41, 42,43,44]
		];
	};
	getImageWidth(img.src, function(w, h) {
		width = w / series;
		height = h / series;
		generateNum();
		drawCanvas();
	});
}

function getImageWidth(url, callback) {//获取图片的宽高
	var img = new Image();
	img.src = url;
	// 如果图片被缓存，则直接返回缓存数据
	if(img.complete) {
		callback(img.width, img.height);
	} else {
		img.onload = function() {
			callback(img.width, img.height);
		}
	}
}

getImageWidth(img.src, function(w, h) {//调用获取宽高的函数
	width = w / series;
	height = h / series;
	generateNum();
	drawCanvas();
});

function generateNum() {//打乱图片的顺序
	for(var i = 0; i < 50; i++) {
		var i1 = Math.round(Math.random() * (series-1));
		var j1 = Math.round(Math.random() * (series-1));
		var i2 = Math.round(Math.random() * (series-1));
		var j2 = Math.round(Math.random() * (series-1));
		var temp = num[i1][j1];
		num[i1][j1] = num[i2][j2];
		num[i2][j2] = temp;
		
	}
}

function drawCanvas() {//图片上屏
	ctx.clearRect(0, 0, series*100, series*100);
	for(var i = 0; i < series; i++) {
		for(var j = 0; j < series; j++) {
			if(num[i][j] != ((series-1)*10+series-1)) {
				var row = parseInt(num[i][j] / 10);
				var col = num[i][j] % 10;
				ctx.drawImage(img, col * width, row * height, width, height, j * w, i * w, w, w);
			}
		}
	}
}

c.onmousedown = function(e) {//移动图片时触发函数
	var bound = c.getBoundingClientRect();
	var x = e.pageX - bound.left;
	var y = e.pageY - bound.top;
	var row = parseInt(y / 100);
	var col = parseInt(x / 100);
	if(num[row][col] != ((series-1)*10+series-1)) {
		detectBox(row, col);
		drawCanvas();
		var isWin = checkWin();
		if(isWin) {
			clearInterval(timer);
			ctx.drawImage(img, 0, 0, series*100, series*100);
			ctx.font = 'bold 68px 宋体';
			ctx.fillStyle = 'red';
			ctx.fillText('游戏成功！', 20, 150);
		}
	}
}

function detectBox(i, j) {//判断图片的移动方向
	if(i > 0) {
		if(num[i - 1][j] == ((series-1)*10+series-1)) {
			num[i - 1][j] = num[i][j];
			num[i][j] = ((series-1)*10+series-1);
			return;
		}
	}
	if(i < (series-1)) {
		if(num[i + 1][j] == ((series-1)*10+series-1)) {
			num[i + 1][j] = num[i][j];
			num[i][j] = ((series-1)*10+series-1);
			return;
		}
	}
	if(j > 0) {
		if(num[i][j - 1] == ((series-1)*10+series-1)) {
			num[i][j - 1] = num[i][j];
			num[i][j] = ((series-1)*10+series-1);
			return;
		}
	}
	if(j < (series-1)) {
		if(num[i][j + 1] == ((series-1)*10+(series-1))) {
			num[i][j + 1] = num[i][j];
			num[i][j] = ((series-1)*10+(series-1));
			return;
		}
	}
}

function checkWin() {//是否拼图成功
	for(var i = 0; i < series; i++) {
		for(var j = 0; j < series; j++) {
			if(num[i][j] != i * 10 + j) {
				return false;
			}
		}
	}
	return true;
}

var time = document.getElementById('time');
var h = 0,
	m = 0,
	s = 0;

function getCurrentTime() {//计时器
	s = parseInt(s);
	m = parseInt(m);
	h = parseInt(h);
	s++;
	if(s == 60) {
		s = 0;
		m++;
	}
	if(m == 60) {
		s = 0;
		h++;
	}
	if(s < 10) {
		s = "0" + s;
	}
	if(m < 10) {
		m = "0" + m;
	}
	if(h < 10) {
		h = "0" + h;
	}
	time.innerHTML = h + ":" + m + ":" + s;
}

function restartGame() {
	if(onoffBtn.innerHTML == '开始游戏') {
		var timer = setInterval("getCurrentTime()", 1000);
		onoffBtn.innerHTML = '重新开始';
		return;
	}
	clearInterval(timer);
	s = -1;
	m = 0;
	h = 0;
	getCurrentTime();
	timer = setInterval('getCurrentTime()', 1000);
	generateNum();
	drawCanvas();
}