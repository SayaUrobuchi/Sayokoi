
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
		
		self.hand_limit = 10;
		
		self.hand_current = 0;
		self.hand = [];
		self.hand_pos = [];
		self.deck = [
			999, 
			998, 
			997, 
			999, 
			998, 
			997, 
			999, 
			998, 
			997, 
			999, 
			998, 
			997, 
			999, 
			998, 
			997, 
		];
		
		self.max_hp = 100;
		self.hp = self.max_hp;
		self.max_mp = 40;
		self.mp = 5;
		self.mp_recover = 15;
		
		self.draw_card(self.hand_limit);
		
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
		
		if (self.state >= HUNT_STATE.READY)
		{
			// common
			self.update_background(g);
			self.update_hand(g);
			self.update_attr(g);
			// discover
			// battle
			// gather
			// talk
		}
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
			if (scene.current == self)
			{
				self.state = HUNT_STATE.READY;
			}
		case HUNT_STATE.READY:
			self.state = HUNT_STATE.EVENT;
			self.event = {
				type: HUNT_EVENT.BATTLE, 
			};
			self.event_setup();
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
	
	self.update_hand = function (g)
	{
		var modify = -Math.floor((self.hand.length-1)/2);
		var x_mod = 16;
		var x_accr = .7;
		var y_mod = -10;
		var y_add = 4;
		var y_add2 = 1;
		self.hand_x = 0;
		self.hand_y = 16 + (4+modify) * UI.HAND.HEIGHT;
		for (var i=0; i<self.hand.length; i++, modify++)
		{
			var idx = (self.hand_current + modify + self.hand.length) % self.hand.length;
			self.hand_draw_pos = self.hand_pos[idx];
			self.hand_draw_pos.x = self.hand_x;
			self.hand_draw_pos.y = self.hand_y;
			var diff = (self.hand_draw_pos.y-self.hand_draw_pos.real_y);
			if (diff > 400)
			{
				self.hand_draw_pos.real_y = self.hand_draw_pos.y + 60;
				self.hand_draw_pos.real_x = -UI.HAND.WIDTH;
			}
			if (diff < -400)
			{
				self.hand_draw_pos.real_y = self.hand_draw_pos.y - 60;
				self.hand_draw_pos.real_x = -UI.HAND.WIDTH;
			}
			self.hand_pos_update(self.hand_pos[idx]);
			if (idx == self.hand_current)
			{
				self.hand_is_current = true;
				Card.draw_hand(self.hand[idx], g, self);
				self.hand_y += UI.HAND.MAIN_HEIGHT;
				x_mod = -x_mod;
				x_accr = 1/x_accr;
				y_add = -y_add;
			}
			else
			{
				self.hand_is_current = false;
				Card.draw_hand(self.hand[idx], g, self);
				self.hand_y += UI.HAND.HEIGHT;
				y_mod += y_add;
				y_add += y_add2;
				if (y_mod < -8)
				{
					y_mod = -8;
				}
			}
			self.hand_y += y_mod;
			self.hand_x += x_mod;
			x_mod *= x_accr;
		}
	}
	
	self.update_attr = function (g)
	{
	}
	
	self.hand_pos_update = function (data)
	{
		var spd = .3;
		data.real_x = lerp(data.real_x, data.x, spd);
		data.real_y = lerp(data.real_y, data.y, spd);
		data.real_a = lerp(data.real_a, data.a, spd);
	}
	
	self.hand_push = function (card)
	{
		self.hand.splice(self.hand.current, 0, card);
		self.hand_pos.splice(self.hand.current, 0, {
			x: 0, 
			y: 12 + UI.HAND.HEIGHT*4, 
			a: 1, 
			real_x: -UI.HAND.WIDTH, 
			real_y: 12 + UI.HAND.HEIGHT*4, 
			real_a: 0, 
		});
	}
	
	self.draw_card = function (num)
	{
		if (is_ndef(num))
		{
			num = 1;
		}
		for (var i=0; i<num&&self.hand.length<self.hand_limit; i++)
		{
			var card = self.take_card_from_deck();
			self.hand_push(card);
		}
	}
	
	self.take_card_from_deck = function ()
	{
		var idx = random(self.deck.length);
		var res = self.deck[idx];
		self.deck.splice(idx, 1);
		return res;
	}
	
	self.event_setup = function ()
	{
	}
	
	self.keyup = function (e)
	{
		var key = e.which || e.keyCode;
		return true;
	}
	
	self.keydown = function (e)
	{
		var key = e.which || e.keyCode;
		switch (parse_key(key))
		{
		case INPUT.DOWN:
			self.hand_current = (self.hand_current+1) % self.hand.length;
			return false;
		case INPUT.UP:
			self.hand_current = (self.hand_current-1+self.hand.length) % self.hand.length;
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
