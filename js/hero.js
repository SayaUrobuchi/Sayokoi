
function Hero(data)
{
	var self = Drawable();
	
	self.init = function ()
	{
		self.mhp = data.hp;
		self.hp = self.mhp;
		self.mmp = data.mp;
		self.mp = data.mp_init;
		self.mp_regen = data.mp_regen;
		self.atk = data.atk;
		self.group = GROUP.MATE;
		
		self.hp_draw_back = 0;
		self.hp_draw_front = 0;
		self.mp_draw_back = 0;
		self.mp_draw_front = 0;
		self.hp_prev = 0;
		self.hp_draw_prev = 0;
		self.hp_need_prev = false;
		self.mp_prev = 0;
		self.hpmp_draw_back = true;
		self.hpmp_draw_back_color = COLOR.BLACK;
	}
	
	self.update = function (field)
	{
		self.update_hp_prev(field);
	}
	
	self.update_hp_prev = function (field)
	{
		if (self.hp_need_prev)
		{
			var spd = .08;
			self.hp_draw_prev = lerp(self.hp_draw_prev, self.hp_prev, spd);
			self.hp_prev_a = lerp(self.hp_prev_a, self.hp_prev_ta, spd);
			self.hp_prev_scale = lerp(self.hp_prev_scale, self.get_hp_prev_scale(), .12);
			if (self.hp_prev_a < 1e-2)
			{
				self.clear_hp_preview();
			}
		}
	}
	
	self.draw = function (field, g)
	{
		self.draw_mp(field, g);
		self.draw_hp(field, g);
	}
	
	self.draw_hp = function (field, g)
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
			if (self.hpmp_draw_back)
			{
				g.fillStyle = self.hpmp_draw_back_color;
				g.fill();
			}
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
			if (self.hp_need_prev)
			{
				g.save();
				{
					g.globalAlpha = self.hp_prev_a;
					g.textAlign = "center";
					g.textBaseline = "middle";
					g.font = UI.GENERAL.DAMAGE_PREVIEW_FONT;
					var hp_prev_string = "(";
					if (self.hp_draw_prev >= 0)
					{
						hp_prev_string += "+";
					}
					else
					{
						g.fillStyle = COLOR.RED;
					}
					hp_prev_string += Math.round(self.hp_draw_prev) + ")";
					g.translate(ex/2, r);
					g.scale(self.hp_prev_scale, self.hp_prev_scale);
					g.fillText(hp_prev_string, 0, 0);
				}
				g.restore();
			}
		}
		g.translate(-x, -y);
	}
	
	self.draw_mp = function (field, g)
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
			if (self.hpmp_draw_back)
			{
				g.fillStyle = self.hpmp_draw_back_color;
				g.fill();
			}
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
				else
				{
					g.fillStyle = COLOR.RED;
				}
				mp_prev_string += self.mp_prev + ")";
				g.fillText(mp_prev_string, 196, r);
			}
		}
		g.translate(-x, -y);
	}
	
	self.take_damage = function (field, damage)
	{
		self.hp -= damage;
		self.add_hp_preview(-damage);
		var shake_power = (1+damage/self.mhp*2) * 10;
		field.shake(shake_power, 20);
		if (self.hp < 0)
		{
			self.hp = 0;
			self.die(field);
		}
	}
	
	self.regen_mp = function (field, value)
	{
		value = value || self.mp_regen;
		self.mp = Math.min(self.mp+value, self.mmp);
		if (self.mp < 0)
		{
			self.take_damage(field, -self.mp);
			self.mp = 0;
		}
	}
	
	self.die = function (field)
	{
	}
	
	self.get_hp_prev_scale = function ()
	{
		return 1+Math.abs(self.hp_prev/self.mhp);
	}
	
	self.set_hp_preview = function (value)
	{
		self.hp_need_prev = true;
		self.hp_prev = value;
		self.hp_prev_a = 1;
		self.hp_prev_ta = 1;
		self.hp_prev_scale = 2 * self.get_hp_prev_scale();
	}
	
	self.add_hp_preview = function (value)
	{
		self.set_hp_preview(self.hp_prev+value);
		self.hp_prev_scale = (2+(Math.abs(value)/self.mhp)*4) * self.get_hp_prev_scale();
	}
	
	self.fadeout_hp_preview = function ()
	{
		self.hp_prev_ta = 0;
	}
	
	self.clear_hp_preview = function ()
	{
		self.hp_prev = 0;
		self.hp_draw_prev = 0;
		self.hp_need_prev = false;
	}
	
	self.set_mp_preview = function (value)
	{
		self.mp_prev = value;
	}
	
	self.clear_mp_preview = function ()
	{
		self.mp_prev = 0;
	}
	
	self.init();
	
	return self;
}

