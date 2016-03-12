
var ENEMY = {};

var ENEMY_FUNC = {
	DRAW_NORMAL: function (field, g, self)
	{
		g.drawImage(self.data.img, -self.w/2, -self.h/2, self.w, self.h);
	}, 
	DIE_DISAPPEAR: function (field, self)
	{
		self.disappear = true;
	}, 
};

function Enemy(id)
{
	var self = Drawable();
	var data = ENEMY[id];
	
	self.init = function ()
	{
		self.data = data;
		self.hp = data.hp;
		self.mhp = data.hp;
		self.atk = data.atk;
		self.w = data.w;
		self.cw = self.w + self.data.cw;
		self.h = data.img.height * self.w / data.img.width;
		self.a = 1;
		self.damage_popup = [];
		self.group = GROUP.ENEMY;
		self.state = 0;
		self.hp_bar_rate = 0;
	};
	
	self.update = function (field)
	{
		self.update_damage_popup(field);
		self.update_defeat(field);
		self.update_cast_shadow(field);
	}
	
	self.update_defeat = function (field)
	{
		if (self.defeat && self.a)
		{
			if (self.defeat_wait <= 0)
			{
				self.a = Math.max(0, self.a-0.05);
			}
			else
			{
				self.defeat_wait--;
			}
		}
	}
	
	self.update_damage_popup = function (field)
	{
		for (var i=0; i<self.damage_popup.length; i++)
		{
			var p = self.damage_popup[i];
			p.scale = lerp(p.scale, 1, 0.12);
			if (p.scale-1 < .1 && p.step == 0)
			{
				p.step = 1;
				p.fcnt = 40;
			}
			if (p.step > 0)
			{
				p.y -= 0.5;
				p.fcnt--;
				if (p.fcnt < 0)
				{
					p.step = 2;
				}
			}
			if (p.step > 1)
			{
				p.a -= 0.03;
				if (p.a < 0)
				{
					p.finished = true;
				}
			}
		}
		var j = 0;
		for (var i=0; i<self.damage_popup.length; i++)
		{
			var p = self.damage_popup[i];
			if (!p.finished)
			{
				self.damage_popup[j++] = p;
			}
		}
		for (var i=self.damage_popup.length; i>j; i--)
		{
			self.damage_popup.pop();
		}
	}
	
	self.update_cast_shadow = function (field)
	{
		if (self.cast_shadow_a > 0)
		{
			self.cast_shadow_a -= .05;
			self.cast_shadow_scale += .06;
		}
	}
	
	self.draw = function (field, g)
	{
		self.draw_shake(field, g);
		var ta = g.globalAlpha;
		g.globalAlpha = self.a;
		{
			self.draw_body(field, g);
			self.draw_name(field, g);
			self.draw_cast_shadow(field, g);
		}
		g.globalAlpha = ta;
		self.draw_damage_popup(field, g);
		self.draw_shake_after(field, g);
	}
	
	self.draw_body = function (field, g)
	{
		if (!self.hide)
		{
			g.translate(self.x, self.cy);
			self.data.draw(field, g, self);
			g.translate(-self.x, -self.cy);
		}
	}
	
	self.draw_name = function (field, g)
	{
		g.font = UI.ENEMY.NAME_FONT;
		g.textAlign = "center";
		g.textBaseline = "top";
		g.fillStyle = COLOR.TEXT;
		g.fillText(self.data.name, self.x, self.y+8);
		g.strokeStyle = COLOR.RED;
		g.lineWidth = 0.2;
		//g.strokeText(self.data.name, self.x, self.y+24);
	}
	
	self.draw_damage_popup = function (field, g)
	{
		for (var i=0; i<self.damage_popup.length; i++)
		{
			var p = self.damage_popup[i];
			g.save();
			g.fillStyle = p.color;
			g.translate(p.x, p.y);
			g.scale(p.scale, p.scale);
			g.globalAlpha = p.a;
			g.textBaseline = "middle";
			g.textAlign = "center";
			g.font = UI.GENERAL.DAMAGE_FONT;
			g.fillText(p.value, 0, 0);
			g.strokeStyle = p.stroke_color;
			g.lineWidth = 2;
			g.strokeText(p.value, 0, 0);
			g.restore();
		}
	}
	
	self.draw_cast_shadow = function (field, g)
	{
		if (self.cast_shadow_a > 0)
		{
			g.save();
			g.translate(self.x, self.cy);
			g.scale(self.cast_shadow_scale, self.cast_shadow_scale);
			g.globalAlpha = self.cast_shadow_a;
			self.data.draw(field, g, self);
			g.restore();
		}
	}
	
	self.draw_shake = function (field, g)
	{
		if (self.shake_count < self.shake_length)
		{
			self.shake_temp_x = 0;
			self.shake_temp_y = random(self.shake_power);
			g.translate(self.shake_temp_x, self.shake_temp_y);
			self.shake_count++;
		}
	}
	
	self.draw_shake_after = function (field, g)
	{
		if (self.shake_count < self.shake_length)
		{
			g.translate(-self.shake_temp_x, -self.shake_temp_y);
			self.shake_count++;
		}
	}
	
	self.shake = function (power, length)
	{
		self.shake_power = power;
		self.shake_length = length;
		self.shake_count = 0;
	}
	
	self.take_damage = function (field, value)
	{
		self.damage_popup.push({
			value: value, 
			x: self.x + random(-self.cw/4, self.cw/4), 
			y: self.cy + random(-self.h/8, self.h/8), 
			a: 1, 
			step: 0, 
			scale: 1.8, 
			color: COLOR.RED, 
			stroke_color: COLOR.YELLOW, 
		});
		var shake_power = (1+value/self.mhp*2) * 6;
		self.shake(shake_power, 20);
		self.hp -= value;
		if (self.hp <= 0)
		{
			self.hp = 0;
		}
	}
	
	self.check_die = function (field)
	{
		if (!self.is_alive(field))
		{
			self.die(field);
		}
	}
	
	self.die = function (field)
	{
		self.defeat = true;
		self.defeat_wait = 30;
	}
	
	self.is_alive = function (field)
	{
		return self.hp > 0;
	}
	
	self.is_targetable = function (field)
	{
		return self.is_alive(field);
	}
	
	self.cast_animation = function (field, action)
	{
		self.cast_shadow_a = 1;
		self.cast_shadow_scale = 1;
	}
	
	self.is_casting = function (field)
	{
		return self.cast_shadow_a > 0;
	}
	
	self.can_act = function (field)
	{
		return self.is_alive(field);
	}
	
	self.set_xy = function (x, y)
	{
		self.x = x;
		self.y = y;
		self.cy = self.y-self.data.sy-self.h/2;
	}
	
	self.init();
	
	return self;
}

