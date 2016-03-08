
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
		self.mp = 20;
		self.mp_recover = 15;
		self.hp_draw_back = 0;
		self.hp_draw_front = 0;
		self.mp_draw_back = 0;
		self.mp_draw_front = 0;
		self.hp_prev = 0;
		self.hp_draw_prev = 0;
		self.mp_prev = 0;
		
		self.enemy_area_x = 500;
		self.enemy_area_y = 450;
		self.enemy_area_w = 760;
		
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
			self.update_background(g);
			
			if (self.state == HUNT_STATE.EVENT)
			{
				self.update_enemy(g);
				self.update_timeline(g);
			}
			
			self.update_hand(g);
			self.update_attr(g);
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
	
	self.update_enemy = function (g)
	{
		g.strokeStyle = COLOR.GREEN;
		g.lineWidth = 4;
		g.strokeRect(self.enemy_area_x, self.enemy_area_y-400, self.enemy_area_w, 400);
		for (var i=0; i<self.enemy.length; i++)
		{
			self.enemy[i].update(self);
		}
		for (var i=0; i<self.enemy.length; i++)
		{
			self.enemy[i].draw(self, g);
		}
	}
	
	self.update_timeline = function (g)
	{
		self.timeline = [
		{
			name: "紅蓮劫火", 
			spd: 17, 
			group: GROUP.MATE, 
		}, 
		{
			name: "靜止吧！『世界』", 
			spd: 115, 
			group: GROUP.MATE, 
			is_preview: true, 
		}, 
		{
			name: "恋符．恋色花火", 
			spd: 9, 
			group: GROUP.ENEMY, 
		}, 
		{
			name: "一閃", 
			spd: 6, 
			group: GROUP.MATE, 
		}, 
		{
			name: "斬", 
			spd: -13, 
			group: GROUP.ENEMY, 
		}, 
		];
		var xx = 340;
		var yy = 10;
		var yint = 18;
		var id = 0;
		self.timeline_draw = [
		{
			a: 1, 
			x: xx, 
			y: yy+yint*id++, 
			ta: 1, 
			tx: xx, 
			ty: yy+yint*id++, 
		}, 
		{
			a: 1, 
			x: xx, 
			y: yy+yint*id++, 
			ta: 1, 
			tx: xx, 
			ty: yy+yint*id++, 
		}, 
		{
			a: 1, 
			x: xx, 
			y: yy+yint*id++, 
			ta: 1, 
			tx: xx, 
			ty: yy+yint*id++, 
		}, 
		{
			a: 1, 
			x: xx, 
			y: yy+yint*id++, 
			ta: 1, 
			tx: xx, 
			ty: yy+yint*id++, 
		}, 
		{
			a: 1, 
			x: xx, 
			y: yy+yint*id++, 
			ta: 1, 
			tx: xx, 
			ty: yy+yint*id++, 
		}, 
		];
		
		for (var i=0; i<self.timeline.length; i++)
		{
			var t = self.timeline[i];
			var td = self.timeline_draw[i];
			var spd = .2;
			td.a = lerp(td.a, td.ta, spd);
			td.x = lerp(td.x, td.tx, spd);
			td.y = lerp(td.y, td.ty, spd);
			
			var temp_a = g.globalAlpha;
			g.globalAlpha = td.a;
			{
				var draw_color;
				g.font = UI.TIMELINE.FONT;
				if (t.is_preview)
				{
					draw_color = COLOR.YELLOW;
				}
				else if (t.group == GROUP.MATE)
				{
					draw_color = COLOR.DARK_GREEN2;
				}
				else if (t.group == GROUP.ENEMY)
				{
					draw_color = COLOR.DARK_RED;
				}
				g.fillStyle = draw_color;
				g.textAlign = "right";
				g.textBaseline = "top";
				g.fillText(t.spd+":", td.x+36, td.y);
				g.textAlign = "left";
				g.fillText(t.name, td.x+44, td.y);
				var text_w = g.measureText(t.name).width;
				var grad = g.createLinearGradient(td.x-12, 0, td.x+100+text_w, 0);
				grad.addColorStop(0, draw_color);
				grad.addColorStop(0.5, draw_color);
				grad.addColorStop(1, COLOR.TRANSPARENT);
				g.strokeStyle = grad;
				g.beginPath();
				g.moveTo(td.x-12, td.y+34);
				g.lineTo(td.x+300, td.y+34);
				g.lineWidth = 3;
				g.stroke();
			}
			g.globalAlpha = temp_a;
		}
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
				self.mp_prev = -CARD[self.hand[idx]].cost;
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
			var new_rate = self.hp / self.mhp;
			if (new_rate != self.hp_rate)
			{
				self.hp_rate = new_rate;
				self.hp_draw_back_timer = 0;
				self.hp_draw_back_orig = self.hp_draw_back;
				self.hp_draw_front_timer = 0;
				self.hp_draw_front_orig = self.hp_draw_front;
			}
			if (self.hp_draw_back_orig < self.hp_rate)
			{
				self.hp_draw_back_timer = Math.min(self.hp_draw_back_timer+0.15, 1);
				self.hp_draw_back = swing_f(self.hp_draw_back_orig, self.hp_rate, self.hp_draw_back_timer);
			}
			else
			{
				self.hp_draw_back_timer = Math.min(self.hp_draw_back_timer+0.025, 1);
				self.hp_draw_back = swing_f(self.hp_draw_back_orig, self.hp_rate, self.hp_draw_back_timer);
				self.hp_draw_value = Math.round(self.mhp * self.hp_draw_back);
			}
			if (self.hp_draw_front < self.hp_rate)
			{
				self.hp_draw_front_timer = Math.min(self.hp_draw_front_timer+0.025, 1);
				self.hp_draw_front = swing_f(self.hp_draw_front_orig, self.hp_rate, self.hp_draw_front_timer);
				self.hp_draw_value = Math.round(self.mhp * self.hp_draw_front);
			}
			else
			{
				self.hp_draw_front_timer = Math.min(self.hp_draw_front_timer+0.15, 1);
				self.hp_draw_front = swing_f(self.hp_draw_front_orig, self.hp_rate, self.hp_draw_front_timer);
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
				g.strokeStyle = "#663300";
				g.stroke();
				// text
				g.textBaseline = "middle";
				g.textAlign = "left";
				g.font = UI.HP_BAR.TEXT_FONT;
				g.fillStyle = COLOR.TEXT;
				g.fillText(UI.HP_BAR.TEXT, -48, r);
				g.textAlign = "right";
				g.font = UI.HP_BAR.VALUE_FONT;
				g.fillStyle = COLOR.TEXT;
				g.fillText(self.hp_draw_value, 84, r);
				g.textAlign = "right";
				g.font = UI.HP_BAR.VALUE_FONT;
				g.fillText(UI.HP_BAR.SEP_TEXT, 96, r);
				g.textAlign = "left";
				g.font = UI.HP_BAR.VALUE_FONT;
				g.fillText(self.mhp, 108, r);
			}
			g.translate(-x, -y);
		}
		// MP
		{
			var new_rate = self.mp / self.mmp;
			if (new_rate != self.mp_rate)
			{
				self.mp_rate = new_rate;
				self.mp_draw_back_timer = 0;
				self.mp_draw_back_orig = self.mp_draw_back;
				self.mp_draw_front_timer = 0;
				self.mp_draw_front_orig = self.mp_draw_front;
			}
			if (self.mp_draw_back_orig < self.mp_rate)
			{
				self.mp_draw_back_timer = Math.min(self.mp_draw_back_timer+0.15, 1);
				self.mp_draw_back = swing_f(self.mp_draw_back_orig, self.mp_rate, self.mp_draw_back_timer);
			}
			else
			{
				self.mp_draw_back_timer = Math.min(self.mp_draw_back_timer+0.025, 1);
				self.mp_draw_back = swing_f(self.mp_draw_back_orig, self.mp_rate, self.mp_draw_back_timer);
				self.mp_draw_value = Math.round(self.mmp * self.mp_draw_back);
			}
			if (self.mp_draw_front < self.mp_rate)
			{
				self.mp_draw_front_timer = Math.min(self.mp_draw_front_timer+0.025, 1);
				self.mp_draw_front = swing_f(self.mp_draw_front_orig, self.mp_rate, self.mp_draw_front_timer);
				self.mp_draw_value = Math.round(self.mmp * self.mp_draw_front);
			}
			else
			{
				self.mp_draw_front_timer = Math.min(self.mp_draw_front_timer+0.15, 1);
				self.mp_draw_front = swing_f(self.mp_draw_front_orig, self.mp_rate, self.mp_draw_front_timer);
			}
			// draw
			var w = 3;
			g.lineWidth = w;
			var grad;
			// border
			var x = UI.MP_BAR.X;
			var y = UI.SCREEN.HEIGHT - (UI.MP_BAR.HEIGHT + w);
			var h = UI.MP_BAR.HEIGHT;
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
					if (self.mp_prev)
					{
						var prev_rate = (self.mp_prev) / self.mmp;
						g.fillStyle = UI.MP_BAR.PREVIEW_COLOR;
						g.fillRect(w*self.mp_draw_front, 0, w*prev_rate, h);
					}
				}
				g.restore();
				g.strokeStyle = "#663300";
				g.stroke();
				// text
				g.textBaseline = "middle";
				g.textAlign = "left";
				g.font = UI.MP_BAR.TEXT_FONT;
				g.fillStyle = COLOR.TEXT;
				g.fillText(UI.MP_BAR.TEXT, -48, r);
				g.textAlign = "right";
				g.font = UI.MP_BAR.VALUE_FONT;
				g.fillStyle = COLOR.TEXT;
				g.fillText(self.mp_draw_value, 84, r);
				g.textAlign = "right";
				g.font = UI.MP_BAR.VALUE_FONT;
				g.fillText(UI.MP_BAR.SEP_TEXT, 96, r);
				g.textAlign = "left";
				g.font = UI.MP_BAR.VALUE_FONT;
				g.fillText(self.mmp, 108, r);
				if (self.mp_prev)
				{
					g.textAlign = "left";
					g.font = UI.MP_BAR.VALUE_FONT;
					var mp_prev_string = "(";
					if (self.mp_prev > 0)
					{
						mp_prev_string += "+";
					}
					mp_prev_string += self.mp_prev + ")";
					g.fillText(mp_prev_string, 196, r);
				}
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
	
	self.generate_enemy = function ()
	{
		self.enemy = [];
		self.enemy.push(Enemy(ENEMY.TEST0));
		self.enemy.push(Enemy(ENEMY.TEST1));
		self.enemy.push(Enemy(ENEMY.TEST2));
	}
	
	self.adjust_enemy_location = function ()
	{
		var total_w = 0;
		for (var i=0; i<self.enemy.length; i++)
		{
			total_w += self.enemy[i].cw;
		}
		var remain_w = self.enemy_area_w - total_w;
		var interval = remain_w / (self.enemy.length+1);
		var x = self.enemy_area_x + interval;
		for (var i=0; i<self.enemy.length; i++)
		{
			self.enemy[i].x = x + (self.enemy[i].cw)/2;
			self.enemy[i].y = self.enemy_area_y;
			x += self.enemy[i].cw + interval;
		}
	}
	
	self.event_setup = function ()
	{
		self.generate_enemy();
		self.adjust_enemy_location();
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
			else if (res == INPUT.MENU)
			{
				self.mp_prev++;
			}
			else if (res == INPUT.SUB)
			{
				self.mp_prev--;
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
