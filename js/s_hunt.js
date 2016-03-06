
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
		
		self.mhp = 100;
		self.hp = self.mhp;
		self.mmp = 40;
		self.mp = 5;
		self.mp_recover = 15;
		self.hp_draw_back = 0;
		self.hp_draw_front = 0;
		self.mp_draw_back = 0;
		self.mp_draw_front = 0;
		
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
		if (self.is_key(INPUT.DOWN))
		{
			self.hand_current = (self.hand_current+1) % self.hand.length;
			self.key_delay(INPUT.DOWN, 10, 30);
		}
		if (self.is_key(INPUT.UP))
		{
			self.hand_current = (self.hand_current-1+self.hand.length) % self.hand.length;
			self.key_delay(INPUT.UP, 10, 30);
		}
		var modify = -Math.floor((self.hand.length-1)/2);
		var x_mod = 16;
		var x_accr = .7;
		var y_mod = modify*4;
		var y_add = 3;
		var y_add2 = 2;
		self.hand_x = 0;
		self.hand_y = 16 + (4+modify) * UI.HAND.HEIGHT;
		for (var i=0; i<self.hand.length; i++, modify++)
		{
			var idx = (self.hand_current + modify + self.hand.length) % self.hand.length;
			self.hand_scale = 1 - Math.abs(modify)*.04;
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
				y_add = -y_add + y_add2;
			}
			else
			{
				self.hand_is_current = false;
				Card.draw_hand(self.hand[idx], g, self);
				self.hand_y += UI.HAND.HEIGHT;
				y_mod += y_add;
				y_add += y_add2;
				if (y_mod < -16)
				{
					y_mod = -16;
				}
			}
			self.hand_y += y_mod;
			self.hand_x += x_mod;
			x_mod *= x_accr;
		}
	}
	
	self.update_attr = function (g)
	{
		// HP
		{
			self.hp_rate = self.hp / self.mhp;
			if (self.hp_draw_back < self.hp_rate)
			{
				self.hp_draw_back = lerp(self.hp_draw_back, self.hp_rate, .5);
			}
			else
			{
				self.hp_draw_back = Math.max(self.hp_draw_back-.005, self.hp_rate);
			}
			if (self.hp_draw_front > self.hp_rate)
			{
				self.hp_draw_front = lerp(self.hp_draw_front, self.hp_rate, .5);
			}
			else
			{
				self.hp_draw_front = Math.min(self.hp_draw_front+.005, self.hp_rate);
			}
			// draw
			var w = 3;
			g.lineWidth = w;
			var grad;
			// border
			var x = UI.HP_BAR.X;
			var y = UI.SCREEN.HEIGHT - (UI.HP_BAR.HEIGHT + w) * 2;
			var h = UI.HP_BAR.HEIGHT;
			var r = h/2;
			var rate = 1;
			var ex = UI.SCREEN.WIDTH-r-x-w;
			var w = ex+r;
			g.translate(x, y);
			{
				g.beginPath();
				g.moveTo(r, 0);
				g.lineTo(ex, 0);
				g.arc(ex, r, r, 1.5*Math.PI, 0.5*Math.PI);
				g.moveTo(ex, h);
				g.lineTo(r, h);
				g.arc(r, r, r, 0.5*Math.PI, 1.5*Math.PI);
				g.strokeStyle = "#663300";
				g.stroke();
				g.save();
				g.clip();
				{
					
					grad = g.createLinearGradient(0, 0, 0, h);
					grad.addColorStop(0, COLOR.RED);
					grad.addColorStop(1, COLOR.DARK_RED2);
					g.fillStyle = grad;
					g.fillRect(0, 0, w*self.hp_draw_back, h);
					grad = g.createLinearGradient(0, 0, 0, h);
					grad.addColorStop(0, COLOR.DARK_GREEN);
					grad.addColorStop(1, COLOR.DARK_GREEN2);
					g.fillStyle = grad;
					g.fillRect(0, 0, w*self.hp_draw_front, h);
				}
				g.restore();
			}
			g.translate(-x, -y);
		}
		// MP
		{
			self.mp_rate = self.mp / self.mmp;
			if (self.mp_draw_back < self.mp_rate)
			{
				self.mp_draw_back = lerp(self.mp_draw_back, self.mp_rate, .5);
			}
			else
			{
				self.mp_draw_back = Math.max(self.mp_draw_back-.005, self.mp_rate);
			}
			if (self.mp_draw_front > self.mp_rate)
			{
				self.mp_draw_front = lerp(self.mp_draw_front, self.mp_rate, .5);
			}
			else
			{
				self.mp_draw_front = Math.min(self.mp_draw_front+.005, self.mp_rate);
			}
			// draw
			var w = 3;
			g.lineWidth = w;
			var grad;
			// border
			var x = UI.HP_BAR.X;
			var y = UI.SCREEN.HEIGHT - UI.HP_BAR.HEIGHT - w;
			var h = UI.HP_BAR.HEIGHT;
			var r = h/2;
			var rate = 1;
			var ex = UI.SCREEN.WIDTH-r-x-w;
			var w = ex+r;
			g.translate(x, y);
			{
				g.beginPath();
				g.moveTo(r, 0);
				g.lineTo(ex, 0);
				g.arc(ex, r, r, 1.5*Math.PI, 0.5*Math.PI);
				g.moveTo(ex, h);
				g.lineTo(r, h);
				g.arc(r, r, r, 0.5*Math.PI, 1.5*Math.PI);
				g.strokeStyle = "#663300";
				g.stroke();
				g.save();
				g.clip();
				{
					
					grad = g.createLinearGradient(0, 0, 0, h);
					grad.addColorStop(0, COLOR.RED);
					grad.addColorStop(1, COLOR.DARK_RED2);
					g.fillStyle = grad;
					g.fillRect(0, 0, w*self.mp_draw_back, h);
					grad = g.createLinearGradient(0, 0, 0, h);
					grad.addColorStop(0, COLOR.BRIGHT_BLUE);
					grad.addColorStop(1, COLOR.BLUE);
					g.fillStyle = grad;
					g.fillRect(0, 0, w*self.mp_draw_front, h);
				}
				g.restore();
			}
			g.translate(-x, -y);
		}
	}
	
	self.hand_pos_update = function (data)
	{
		var spd = .2;
		var diff = Math.abs(data.real_y-data.y);
		if (diff > UI.HAND.HEIGHT-10)
		{
			data.real_desc_a = 0;
			data.real_desc_h = 0;
		}
		else
		{
			data.real_desc_a = lerp(data.real_desc_a, 1, .1);
			data.real_desc_h = lerp(data.real_desc_h, UI.HAND.MAIN_HEIGHT-UI.HAND.HEIGHT, spd);
		}
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
			real_desc_a: 0, 
			real_desc_h: 0, 
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
	
	self.is_key = function(key)
	{
		return self.input[key] && (!self.input_delay[key] || self.fid >= self.input_delay[key]);
	}
	
	self.key_delay = function (key, delay, first_delay)
	{
		if (first_delay && (!self.input_delay[key] || self.fid-self.input_delay[key] > delay))
		{
			delay = first_delay;
		}
		self.input_delay[key] = self.fid + delay;
	}
	
	self.keyup = function (e)
	{
		var key = e.which || e.keyCode;
		var res = parse_key(key);
		if (res != INPUT.UNKNOWN)
		{
			self.input[res] = false;
			self.input_delay[res] = 0;
			return false;
		}
		return true;
	}
	
	self.keydown = function (e)
	{
		var key = e.which || e.keyCode;
		var res = parse_key(key);
		if (res != INPUT.UNKNOWN)
		{
			self.input[res] = true;
			if (res == INPUT.DECIDE)
			{
				self.hp -= 8;
			}
			else if (res == INPUT.CANCEL)
			{
				self.hp += 8;
			}
			return false;
		}
		return true;
	}
	
	self.clear_input = function ()
	{
		self.input = {};
		self.input_delay = {};
	}
	
	self.init();
	
	return self;
}
