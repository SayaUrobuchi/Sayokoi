
var HUNT_STATE = {
	NONE: -1, 
	LOADING: 0, 
	READY: 1, 
	DISCOVER: 2, 
	EVENT: 3, 
	END: 32, 
	TURN_START: 128, 
	TURN_PREPARE: 129, 
	TURN_EXECUTE: 130, 
	TURN_END: 131, 
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
		self.turn_draw = 3;
		
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
		self.hand_temp = [];
		self.timeline = [];
		self.timeline_draw = [];
		
		self.player_battler = Hero({
			hp: 100, 
			mp: 40, 
			mp_init: 20, 
			mp_regen: 15, 
			atk: 20, 
		});
		
		self.tachie = image.TACHIE_YOYO_NORMAL;
		self.tachie2 = image.TACHIE_SAKO_NORMAL;
		
		self.enemy_area_x = 500;
		self.enemy_area_y = 450;
		self.enemy_area_w = 760;
		
		self.set_background(image.BG_FOREST_TWILIGHT);
		
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
		
		self.update_shake(g);
		
		if (self.state >= HUNT_STATE.READY)
		{
			self.update_background(g);
			self.update_tachie(g);
			
			if (self.state == HUNT_STATE.EVENT)
			{
				self.update_enemy(g);
				self.update_timeline(g);
			}
			
			self.update_msg(g);
			self.update_chain(g);
			self.update_hero(g);
			self.update_hand(g);
			
			self.update_helper();
		}
		
		self.update_shake_after(g);
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
		switch (self.state)
		{
		case HUNT_STATE.EVENT:
			if (self.turn_state == HUNT_STATE.TURN_START)
			{
				self.turn_start();
			}
			if (self.turn_state == HUNT_STATE.TURN_PREPARE)
			{
				self.player_battler.set_mp_preview(-CARD[self.hand[self.hand_current]].cost);
				if (self.is_key(INPUT.DOWN))
				{
					self.hand_current = (self.hand_current+1) % self.hand.length;
					self.key_delay(INPUT.DOWN, 10, 30);
					self.remove_preview_action();
					self.insert_preview_action();
				}
				if (self.is_key(INPUT.UP))
				{
					self.hand_current = (self.hand_current-1+self.hand.length) % self.hand.length;
					self.key_delay(INPUT.UP, 10, 30);
					self.remove_preview_action();
					self.insert_preview_action();
				}
				if (self.is_key(INPUT.DECIDE))
				{
					if (self.can_hand_use())
					{
						self.remove_preview_action();
						self.hand_use();
						self.insert_preview_action();
					}
					self.key_delay(INPUT.DECIDE, Infinity);
				}
				if (self.is_key(INPUT.CANCEL))
				{
					if (self.can_hand_rollback())
					{
						self.remove_preview_action();
						self.hand_rollback();
						self.insert_preview_action();
					}
					self.key_delay(INPUT.CANCEL, Infinity);
				}
				if (self.is_key(INPUT.MENU))
				{
					self.remove_preview_action();
					self.turn_execute();
					self.key_delay(INPUT.MENU, Infinity);
				}
			}
			if (self.turn_state == HUNT_STATE.TURN_EXECUTE)
			{
				if (self.executing_action)
				{
					self.executing_action.execute(self);
					if (self.executing_action.is_finish())
					{
						if (self.executing_action.group == GROUP.MATE)
						{
							self.deck.push(self.executing_action.card_id);
						}
						self.executing_action = null;
					}
				}
				else
				{
					if (self.timeline.length > 0)
					{
						self.executing_action = self.timeline.shift();
						self.executing_action_draw = self.timeline_draw.shift();
						self.executing_action_draw.ta = 0;
						self.executing_action_draw.tx += 240;
						self.adjust_action();
						self.executing_action.prepare(self);
						if (self.executing_action.is_available(self))
						{
							var group = self.executing_action.group;
							if (group != self.last_group)
							{
								self.chain_break();
							}
							self.last_group = group;
							self.chain_add();
							self.executing_action.start(self);
						}
					}
					else
					{
						self.turn_end();
					}
				}
			}
			if (self.turn_state == HUNT_STATE.TURN_END)
			{
				self.turn_state = HUNT_STATE.TURN_START;
			}
			break;
		}
	}
	
	self.update_background = function (g)
	{
		// diagos
		{
			var x0 = 640;
			var x1 = 200;
			var x2 = 920;
			var h = UI.SCREEN.HEIGHT;
			var w = UI.SCREEN.WIDTH;
			g.beginPath();
			g.moveTo(0, 0);
			g.lineTo(x0, 0);
			g.lineTo(x1, h);
			g.lineTo(0, h);
			g.closePath();
			g.fillStyle = "#336699";
			g.fill();
			g.beginPath();
			g.moveTo(w, h);
			g.lineTo(x2, h);
			g.lineTo(x2+(x0-x1), 0);
			g.lineTo(w, 0);
			g.closePath();
			g.fill();
		}
		// bottom back
		{
			var y = UI.SCREEN.HEIGHT-100;
			g.fillStyle = COLOR.BRIGHT_COFFEE;
			g.fillRect(0, y, UI.SCREEN.WIDTH, UI.SCREEN.HEIGHT);
		}
		// enemy area battle bg
		{
			var w = self.enemy_area_w;
			var h = 400;
			var x = self.enemy_area_x + self.enemy_area_w/2 - w/2;
			var y = self.enemy_area_y - h;
			var sh = Math.min(h * self.background.width / w, self.background.height);
			var sw = w * sh / h;
			var sx = (self.background.width-sw) / 2;
			var sy = self.background.height-sh;
			g.drawImage(self.background, sx, sy, sw, sh, x, y, w, h);
		}
		// current state text
		{
			var y = 40;
			var x = UI.SCREEN.WIDTH;
			var x2 = x-200;
			var c = COLOR.RED;
			g.fillStyle = c;
			g.font = UI.GENERAL.SUB_TITLE_FONT;
			g.textAlign = "right";
			g.textBaseline = "top";
			g.fillText("戰鬥階段", x-16, 0);
			g.lineWidth = 4;
			g.beginPath();
			g.moveTo(x, y);
			g.lineTo(x2, y);
			var grad = g.createLinearGradient(x, 0, x2, 0);
			grad.addColorStop(0, c);
			grad.addColorStop(.4, c);
			grad.addColorStop(1, COLOR.TRANSPARENT);
			g.strokeStyle = grad;
			g.stroke();
		}
	}
	
	self.update_tachie = function (g)
	{
		var w = self.tachie.width;
		var h = self.tachie.height;
		var x = 100;
		var y = UI.SCREEN.HEIGHT-180;
		g.drawImage(self.tachie, x, y, w, h);
		w = self.tachie2.width;
		h = self.tachie2.height;
		x = -100;
		y = UI.SCREEN.HEIGHT-200;
		g.drawImage(self.tachie2, x, y, w, h);
	}
	
	self.update_msg = function (g)
	{
		// top msg
		{
			if (self.executing_action)
			{
				var msg = self.executing_action.data.name;
				var x = 600;
				var y = 16;
				var r = 8;
				var x2 = UI.SCREEN.WIDTH - 160;
				var y2 = y + 48;
				g.fillStyle = COLOR.DARK_RED2;
				g.beginPath();
				g.moveTo(x+r, y);
				g.lineTo(x2-r, y);
				g.arcTo(x2, y, x2, y+r, r);
				g.lineTo(x2, y2-r);
				g.arcTo(x2, y2, x2-r, y2, r);
				g.lineTo(x+r, y2);
				g.arcTo(x, y2, x, y2-r, r);
				g.lineTo(x, y+r);
				g.arcTo(x, y, x+r, y, r);
				g.fill();
				g.strokeStyle = COLOR.DARK_RED;
				g.stroke();
				g.fillStyle = COLOR.TEXT;
				g.font = UI.GENERAL.SUB_TITLE_FONT;
				g.textAlign = "center";
				g.textBaseline = "top";
				g.fillText(msg, x+(x2-x)/2, y+r/2);
			}
		}
		// bottom msg
		{
			self.msg = "臣亮言：先帝創業未半，而中道崩殂。今天下三分，益州疲弊，此誠危急存亡之秋也。然侍衛之臣，不懈於內；忠志之士，忘身於外";
			var x = 400;
			var y = UI.SCREEN.HEIGHT-220;
			var r = 24;
			var x2 = UI.SCREEN.WIDTH - 16;
			var y2 = y + 128;
			var dy = y2-r-12;
			var dyo = dy+16;
			var dy2 = y+r+28;
			var dx = x-40;
			g.fillStyle = COLOR.DARK_RED2;
			g.beginPath();
			g.moveTo(x+r, y);
			g.lineTo(x2-r, y);
			g.arcTo(x2, y, x2, y+r, r);
			g.lineTo(x2, y2-r);
			g.arcTo(x2, y2, x2-r, y2, r);
			g.lineTo(x+r, y2);
			g.arcTo(x, y2, x, y2-r, r);
			g.lineTo(x, dy);
			g.lineTo(dx, dyo);
			g.lineTo(x, dy2);
			g.lineTo(x, y+r);
			g.arcTo(x, y, x+r, y, r);
			g.fill();
			g.strokeStyle = COLOR.DARK_RED;
			g.stroke();
			g.fillStyle = COLOR.TEXT;
			g.font = UI.GENERAL.SUB_TITLE_FONT;
			g.textAlign = "left";
			g.textBaseline = "top";
			draw_text_width(g, self.msg, x+r, y+r, x2-x-(r+r), 36);
		}
	}
	
	self.update_chain = function (g)
	{
		if (self.chain)
		{
			self.chain_x = lerp(self.chain_x, UI.SCREEN.WIDTH, .2);
			self.chain_y = 120;
			if (self.chain > 1)
			{
				self.chain_draw_scale = lerp(self.chain_draw_scale, self.chain_scale, .1);
			}
		}
		else
		{
			self.chain_x = lerp(self.chain_x, UI.SCREEN.WIDTH+400, .1);
			self.chain_y = 120;
		}
		if (self.chain_x < UI.SCREEN.WIDTH+300)
		{
			var c = COLOR.YELLOW;
			g.fillStyle = c;
			g.font = UI.GENERAL.CHAIN_FONT;
			g.textAlign = "right";
			g.textBaseline = "middle";
			g.fillText(self.chain_msg, self.chain_x, self.chain_y);
			g.beginPath();
			g.lineWidth = 4;
			g.moveTo(UI.SCREEN.WIDTH, self.chain_y+24);
			var w = g.measureText(self.chain_msg).width;
			g.lineTo(self.chain_x-w-40, self.chain_y+24);
			var grad = g.createLinearGradient(UI.SCREEN.WIDTH, 0, UI.SCREEN.WIDTH-w, 0);
			grad.addColorStop(0, c);
			grad.addColorStop(.5, c);
			grad.addColorStop(1, COLOR.TRANSPARENT);
			g.strokeStyle = grad;
			g.stroke();
			if (self.chain > 1)
			{
				g.font = UI.GENERAL.CHAIN_NUMBER_FONT;
				g.textAlign = "center";
				g.fillStyle = COLOR.RED;
				g.strokeStyle = COLOR.YELLOW;
				g.lineWidth = 4;
				var x = UI.SCREEN.WIDTH-w-60;
				var y = self.chain_y;
				g.save();
				g.translate(x, y);
				g.scale(self.chain_draw_scale, self.chain_draw_scale);
				g.fillText(self.chain, 0, 0);
				g.strokeText(self.chain, 0, 0);
				g.restore();
			}
		}
	}
	
	self.update_hero = function (g)
	{
		self.player_battler.update(self);
		self.player_battler.draw(self, g);
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
		if (self.executing_action)
		{
			var t = self.executing_action;
			var td = self.executing_action_draw;
			var spd = .08;
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
					draw_color = COLOR.DARK_GREEN;
				}
				else if (t.group == GROUP.ENEMY)
				{
					draw_color = COLOR.RED;
				}
				else
				{
					draw_color = COLOR.GRAY;
				}
				g.fillStyle = draw_color;
				g.textAlign = "right";
				g.textBaseline = "top";
				g.fillText(t.speed+":", td.x+36, td.y);
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
					draw_color = COLOR.DARK_GREEN;
				}
				else if (t.group == GROUP.ENEMY)
				{
					draw_color = COLOR.RED;
				}
				else
				{
					draw_color = COLOR.GRAY;
				}
				g.fillStyle = draw_color;
				g.textAlign = "right";
				g.textBaseline = "top";
				g.fillText(t.speed+":", td.x+36, td.y);
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
		var modify = -Math.floor((self.hand.length-1)/2);
		var modify_t = modify;
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
			self.hand_draw_pos = self.hand_pos[idx];
			self.hand_draw_pos.scale = 1 - Math.abs(modify)*.04;
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
				self.hand_y += UI.HAND.MAIN_HEIGHT;
				x_mod = -x_mod;
				x_accr = 1/x_accr;
				y_add = -y_add + y_add2;
			}
			else
			{
				self.hand_is_current = false;
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
		for (var i=modify_t, j=self.hand.length-1+i; i<=0; i++, j--)
		{
			var idx = (self.hand_current+i+self.hand.length) % self.hand.length;
			Card.draw_hand(idx, g, self);
			if (i != j)
			{
				idx = (self.hand_current+j+self.hand.length) % self.hand.length;
				Card.draw_hand(idx, g, self);
			}
		}
	}
	
	self.update_helper = function ()
	{
		set_helper(self.helper_str);
	}
	
	self.update_shake = function (g)
	{
		if (self.shake_count < self.shake_length)
		{
			self.shake_temp_x = 0;
			self.shake_temp_y = random(self.shake_power);
			g.translate(self.shake_temp_x, self.shake_temp_y);
			self.shake_count++;
		}
	}
	
	self.update_shake_after = function (g)
	{
		if (self.shake_count < self.shake_length)
		{
			g.translate(-self.shake_temp_x, -self.shake_temp_y);
			self.shake_count++;
		}
	}
	
	self.insert_preview_action = function ()
	{
		var action = Action(self.hand[self.hand_current], self.player_battler, true);
		self.insert_action(action);
	}
	
	self.remove_preview_action = function ()
	{
		var i, j;
		for (i=0, j=0; i<self.timeline.length; i++)
		{
			if (!self.timeline[i].is_preview)
			{
				self.timeline[j] = self.timeline[i];
				self.timeline_draw[j] = self.timeline_draw[i];
				j++;
			}
		}
		if (i != j)
		{
			for (; i>j; i--)
			{
				self.timeline.pop();
				self.timeline_draw.pop();
			}
			self.adjust_action();
		}
	}
	
	self.insert_action = function (action)
	{
		var idx = self.timeline.length-1;
		while (idx >= 0)
		{
			if (action.compare_to(self.timeline[idx]) <= 0)
			{
				break;
			}
			idx--;
		}
		++idx;
		self.timeline.splice(idx, 0, action);
		self.timeline_draw.splice(idx, 0, {
			a: 0, 
			x: 600, 
			y: 0, 
		});
		self.adjust_action();
	}
	
	self.cancel_action = function (id)
	{
		for (var i=self.timeline.length-1; i>=0; i--)
		{
			if (self.timeline[i].card_id == id)
			{
				self.timeline.splice(i, 1);
				self.timeline_draw.splice(i, 1);
				self.adjust_action();
				return true;
			}
		}
		return false;
	}
	
	self.adjust_action = function ()
	{
		var xx = 340;
		var yy = 10;
		var yint = 36;
		for (var i=0; i<self.timeline.length; i++)
		{
			var td = self.timeline_draw[i];
			td.tx = xx;
			td.ty = yy + yint*i;
			td.ta = 1;
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
		var location = (self.hand.length > 0 ? (self.hand_current+1) % self.hand.length : 0);
		self.hand.splice(location, 0, card);
		self.hand_pos.splice(location, 0, {
			x: 0, 
			y: 12 + UI.HAND.HEIGHT*4, 
			a: 1, 
			real_x: -UI.HAND.WIDTH, 
			real_y: 12 + UI.HAND.HEIGHT*4, 
			real_a: 0, 
			real_desc_a: 0, 
			real_desc_h: 0, 
		});
		self.hand_current = location;
	}
	
	self.hand_pop = function ()
	{
		var res = self.hand.splice(self.hand_current, 1)[0];
		self.hand_pos.splice(self.hand_current, 1);
		self.hand_current %= self.hand.length;
		return res;
	}
	
	self.can_hand_use = function ()
	{
		return Card.is_usable(self.hand[self.hand_current], self);
	}
	
	self.hand_use = function ()
	{
		var card = self.hand[self.hand_current];
		if (Card.is_usable(card, self))
		{
			Card.cost_mp(card, self);
			self.hand_pop();
			self.hand_temp.push(card);
			self.insert_action(Action(card, self.player_battler));
		}
	}
	
	self.can_hand_rollback = function ()
	{
		return self.hand_temp.length > 0;
	}
	
	self.hand_rollback = function ()
	{
		if (self.hand_temp.length > 0)
		{
			var card = self.hand_temp.pop();
			Card.recover_cost_mp(card, self);
			self.hand_push(card);
			self.cancel_action(card);
		}
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
			self.enemy[i].set_xy(x + (self.enemy[i].cw)/2, self.enemy_area_y);
			x += self.enemy[i].cw + interval;
		}
	}
	
	self.event_setup = function ()
	{
		if (self.event)
		{
			switch (self.event.type)
			{
			case HUNT_EVENT.BATTLE:
				self.set_helper([
					[INPUT.VERTICAL, "選擇卡片"], 
					[INPUT.DECIDE, "宣告發動"], 
					[INPUT.CANCEL, "取消宣告"], 
					[INPUT.MENU, "回合開始"], 
				]);
				self.generate_enemy();
				self.adjust_enemy_location();
				self.turn_state = HUNT_STATE.TURN_START;
				break;
			}
		}
	}
	
	self.turn_start = function ()
	{
		self.insert_action(Action(99998, self.enemy[0]));
		self.insert_action(Action(99997, self.enemy[1]));
		self.insert_action(Action(99999, self.enemy[2]));
		self.insert_preview_action();
		self.turn_state = HUNT_STATE.TURN_PREPARE;
	}
	
	self.turn_execute = function ()
	{
		self.player_battler.clear_hp_preview();
		self.player_battler.clear_mp_preview();
		self.chain = 0;
		self.turn_state = HUNT_STATE.TURN_EXECUTE;
	}
	
	self.turn_end = function ()
	{
		self.draw_card(Math.min(self.hand_limit-self.hand.length, self.turn_draw));
		self.player_battler.regen_mp(self);
		self.player_battler.fadeout_hp_preview();
		self.chain_break();
		var win = true;
		for (var i=0; i<self.enemy.length; i++)
		{
			if (self.enemy[i].is_alive(self))
			{
				win = false;
				break;
			}
		}
		if (win)
		{
			self.enemy = [];
			self.event_setup();
		}
		self.turn_state = HUNT_STATE.TURN_END;
	}
	
	self.chain_add = function ()
	{
		self.chain++;
		if (self.chain == 1)
		{
			self.chain_msg = "連鎖開始!!";
		}
		else
		{
			self.chain_scale = 1+(self.chain*0.2);
			self.chain_draw_scale = self.chain_scale * 5;
			self.chain_msg = "連鎖!!";
		}
	}
	
	self.chain_break = function ()
	{
		self.chain = 0;
		self.chain_x = UI.SCREEN.WIDTH+200;
	}
	
	self.get_chain_bonus = function ()
	{
		return (self.chain-1) * 0.15;
	}
	
	self.set_helper = function (data)
	{
		self.helper_str = generate_helper_str(data);
	}
	
	self.set_background = function (bg)
	{
		self.background = bg;
	}
	
	self.shake = function (power, length)
	{
		self.shake_power = power;
		self.shake_length = length;
		self.shake_count = 0;
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
			/*if (res == INPUT.DECIDE)
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
			}*/
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
