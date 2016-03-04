
var LOADING_STATE = {
	READY: 0, 
	WAITING: 1, 
	AFTER_LOAD: 2, 
	FINISH: 32, 
};

function LoadingScene()
{
	var self = Scene();
	
	self.init = function ()
	{
		self.fid = 0;
		self.state = LOADING_STATE.READY;
	}
	
	self.deinit = function ()
	{
	}
	
	self.update = function (g)
	{
		self.fid++;
		switch (self.state)
		{
		case LOADING_STATE.READY:
			if (!is_preload_complete())
			{
				self.state = LOADING_STATE.WAITING;
			}
			else
			{
				//self.state = LOADING_STATE.FINISH;
				self.state = LOADING_STATE.WAITING;
			}
			break;
		case LOADING_STATE.AFTER_LOAD:
			after_preload();
			self.state = LOADING_STATE.FINISH;
			break;
		case LOADING_STATE.FINISH:
			//self.deinit();
			//scene.pop();
			break;
		}
		self.update_background(g);
		self.update_loading(g);
	}
	
	self.update_loading = function (g)
	{
		if (self.state != LOADING_STATE.WAITING)
		{
			return;
		}
		if (self.fid % 120 < 80)
		{
			g.font = UI.LOADING.FONT;
			g.textAlign = "center";
			g.textBaseline = "middle";
			g.fillStyle = UI.LOADING.TEXT_COLOR;
			g.fillText(UI.LOADING.TEXT, canvas.width/2, canvas.height/2);
		}
		if (is_preload_complete())
		{
			self.state = LOADING_STATE.AFTER_LOAD;
		}
	}
	
	self.update_background = function (g)
	{
	}
	
	self.keyup = function (e)
	{
		var key = e.which || e.keyCode;
		var res = parse_key(key);
		switch (self.state)
		{
		}
		return true;
	}
	
	self.keydown = function (e)
	{
		var key = e.which || e.keyCode;
		var res = parse_key(key);
		switch (self.state)
		{
		}
		return true;
	}
	
	self.clear_input = function ()
	{
		self.input = {};
	}
	
	self.init();
	
	return self;
}
