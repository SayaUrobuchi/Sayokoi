
var current_bgm;

function play_bgm(data)
{
	stop_bgm();
	current_bgm = data.audio;
	if (is_def(current_bgm))
	{
		current_bgm.loop = data.loop;
		current_bgm.play();
	}
}
	
function stop_bgm()
{
	if (is_def(current_bgm))
	{
		current_bgm.pause();
		current_bgm.currentTime = 0;
	}
}

function bgm_volume(volume)
{
	if (is_def(current_bgm))
	{
		current_bgm.volume = volume;
	}
}
