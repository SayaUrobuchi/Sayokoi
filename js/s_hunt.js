
var HUNT_STATE = {
	NONE: -1, 
	LOADING: 0, 
	READY: 1, 
	DISCOVER: 2, 
	EVENT: 3, 
	END: 32, 
};

var HUNT_EVENT = {
	NONE: 0, 
	GATHER: 1, 
	BATTLE: 2, 
	TALK: 3, 
};

var HUNT_TALK = {
	TEXT_TOP: 0, 
	TEXT_BOT: 1, 
	TEXT_MID: 2, 
	TACHIE_LEFT: 0, 
	TACHIE_RIGHT: 1, 
	KEY_CD: 8, 
};

function HuntScene()
{
	var self = Scene();
	
	self.init = function ()
	{
		self.fid = 0;
		self.state = HUNT_STATE.NONE;
		
		self.clear_input();
	}
	
	self.deinit = function ()
	{
	}
	
	self.update = function (g)
	{
		self.fid++;
		self.update_state();
		self.update_logic();
		
		// common
		self.update_background(g);
		// discover
		// battle
		// gather
		// talk
	}
	
	self.update_state = function ()
	{
		switch (self.state)
		{
		case HUNT_STATE.NONE:
			if (!is_preload_complete())
			{
				self.state = HUNT_STATE.LOADING;
				enter_loading();
			}
			else
			{
				self.state = HUNT_STATE.READY;
			}
			break;
		case HUNT_STATE.LOADING:
			if (scene.current === self)
			{
				self.state = HUNT_STATE.READY;
			}
		case HUNT_STATE.READY:
			self.state = HUNT_STATE.EVENT;
			self.event = {
				type: HUNT_EVENT.BATTLE, 
			};
			self.event.setup(self);
			break;
		case HUNT_STATE.EVENT:
			break;
		}
	}
	
	self.update_logic = function ()
	{
	}
	
	self.update_background = function (g)
	{
	}
	
	self.keyup = function (e)
	{
		var key = e.which || e.keyCode;
		if (KEY.ACCEPT[key])
		{
			switch (self.state)
			{
			case HUNT_STATE.EVENT:
				if (key == KEY.FIRE)
				{
					self.input[key] = true;
				}
				else if (key == KEY.MODE)
				{
					self.input[key] = false;
				}
				break;
			default:
				self.input[key] = false;
				break;
			}
			return false;
		}
		return true;
	}
	
	self.keydown = function (e)
	{
		var key = e.which || e.keyCode;
		if (KEY.ACCEPT[key])
		{
			switch (self.state)
			{
			case HUNT_STATE.EVENT:
				if (key == KEY.MODE)
				{
					self.input[key] = true;
				}
				break;
			default:
				self.input[key] = true;
				break;
			}
			return false;
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
