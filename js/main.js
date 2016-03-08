
var scene;
var canvas;
var op_help;
var c_context;

function preload()
{
	var cnt = 0;
	image.__cnt = 0;
	for (var key in IMAGE)
	{
		cnt++;
		if (!image[key])
		{
			var img = new Image();
			img.addEventListener("load", preload_image_callback, true);
			img.src = IMAGE[key];
			image[key] = img;
		}
	}
	image.__max_cnt = cnt;
	
	cnt = 0;
	audio.__cnt = 0;
	for (var key in AUDIO)
	{
		cnt++;
		if (!audio[key])
		{
			var sound = new Audio();
			sound.addEventListener("canplaythrough", preload_audio_callback, true);
			sound.preload = 'auto';
			sound.src = AUDIO[key];
			audio[key] = sound;
		}
	}
	audio.__max_cnt = cnt;
}

function preload_image_callback()
{
	image.__cnt++;
}

function preload_audio_callback()
{
	audio.__cnt++;
}

function keydown(e)
{
	return scene.keydown(e);
}

function keyup(e)
{
	return scene.keyup(e);
}

function init()
{
	scene = SceneManager();
	
	canvas = document.getElementById("canvas");
	canvas.width = UI.SCREEN.WIDTH;
	canvas.height = UI.SCREEN.HEIGHT;
	c_context = canvas.getContext("2d");
	
	op_help = document.getElementById("op_help");
	op_help.style.width = (UI.SCREEN.WIDTH-12)+"px";
	op_help.style.display = "relative";
	op_help.style.border = "4px solid "+COLOR.DARK_RED;
	op_help.style.marginTop = 0;
	op_help.style.paddingLeft = "8px";
	op_help.style.color = COLOR.TEXT;
	op_help.style.textAlign = "left";
	op_help.style.fontFamily = UI.DEFAULT_FONT;
	op_help.style.fontSize = "24px";
	op_help.style.backgroundColor = "#000000";
	op_help.innerHTML = "TEST測試中";
	
	document.addEventListener("keydown", keydown);
	document.addEventListener("keyup", keyup);
}

function update()
{
	c_context.fillStyle = COLOR.BLACK;
	c_context.fillRect(0, 0, canvas.width, canvas.height);
	scene.update(c_context);
}

function main()
{
	init();
	scene.push(HuntScene());
	setInterval(update, 16);
}

preload();
window.onload = main;

