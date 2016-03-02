
var MCHAR_SHOT_TEMPLATE = extend(SHOT_TEMPLATE, {
	r: 4, 
	dr: 6, 
	spd: 16, 
	color: COLOR.GRAY, 
	out_color: COLOR.GREEN, 
	target: GROUP.ENEMY, 
	hit: SHOT.HIT_MC, 
});

function MainChara()
{
	var self = Chara();
	
	self.init = function ()
	{
		self.x = 0;
		self.y = 0;
		self.w = 32;
		self.h = 32;
		self.w2 = 16;
		self.h2 = 16;
		self.spd = 6;
		self.sspd = 2;
		self.r = 4;
		self.zanki = 4;
		self.mana = 1000;
		self.mana_hit = 3;
		self.mana_rec = 0.1;
		self.mana_rage = 500;
		self.mana_disp = 0;
		self.mana_disp_spd = 20;
		self.mana_max = 3000;
		self.muteki = 0;
		self.die_muteki = 96;
		self.mc = true;
		self.hide = false;
		self.fire_cd = 0;
		self.fire_int = 4;
		self.bomb_cd = 0;
		self.bomb_int = 60;
		self.bombing = false;
		self.bomb_f = 30;
		self.bomb_cost = 1000;
		self.bomb_power = 128;
		self.img_data = {
			NORM: {
				img: image.YOYO_BATTLE, 
				sx: 32, 
				sy: 96, 
				sw: 32, 
				sh: 32, 
				ox: self.w2, 
				oy: self.h2, 
			}, 
			MOVE_LEFT: {
			}, 
			MOVE_RIGHT: {
			}, 
		};
		self.img[0] = self.img_data.NORM;
		self.attack = {
			norm: [
				extend(MCHAR_SHOT_TEMPLATE, {
					ox: -10, 
					oy: -14, 
					dx: 0, 
					dy: -1, 
				}), 
				extend(MCHAR_SHOT_TEMPLATE, {
					ox: 10, 
					oy: -14, 
					dx: 0, 
					dy: -1, 
				}), 
				extend(MCHAR_SHOT_TEMPLATE, {
					ox: -16, 
					oy: -4, 
					dx: -0.1, 
					dy: -1, 
				}), 
				extend(MCHAR_SHOT_TEMPLATE, {
					ox: 16, 
					oy: -4, 
					dx: 0.1, 
					dy: -1, 
				}), 
			], 
			mode: [
				extend(MCHAR_SHOT_TEMPLATE, {
					ox: -10, 
					oy: -14, 
					dx: 0, 
					dy: -1, 
				}), 
				extend(MCHAR_SHOT_TEMPLATE, {
					ox: 10, 
					oy: -14, 
					dx: 0, 
					dy: -1, 
				}), 
				extend(MCHAR_SHOT_TEMPLATE, {
					ox: -16, 
					oy: -4, 
					dx: -0.05, 
					dy: -1, 
				}), 
				extend(MCHAR_SHOT_TEMPLATE, {
					ox: 16, 
					oy: -4, 
					dx: 0.05, 
					dy: -1, 
				}), 
			], 
		};
	}
	
	self.update = function (field)
	{
		if (field.state == STG.BATTLE && self.fid != field.fid)
		{
			self.fid = field.fid;
			var dx = 0, dy = 0, spd = self.spd;
			self.moving = 0;
			if (field.input[KEY.MOVE_LEFT])
			{
				dx--;
				self.moving = -1;
			}
			if (field.input[KEY.MOVE_UP])
			{
				dy--;
			}
			if (field.input[KEY.MOVE_RIGHT])
			{
				dx++;
				self.moving = 1;
			}
			if (field.input[KEY.MOVE_DOWN])
			{
				dy++;
			}
			if (field.input[KEY.MODE])
			{
				spd = self.sspd;
			}
			self.move(field, dx, dy, spd);
		
			if (self.fire_cd < 0 && field.input[KEY.FIRE])
			{
				var attack = self.attack.norm;
				if (field.input[KEY.MODE])
				{
					attack = self.attack.mode;
				}
				self.fire(field, attack);
				self.fire_cd = self.fire_int;
			}
			self.fire_cd--;
			
			if (field.input[KEY.BOMB] && self.bomb_cd < 0 && self.mana >= self.bomb_cost)
			{
				self.add_mana(-self.bomb_cost);
				for (var i=0; i<field.group_list[GROUP.ENEMY].length; i++)
				{
					field.group_list[GROUP.ENEMY][i].take_damage(field, self.bomb_power);
				}
				self.bomb_cnt = 0;
				self.bomb_cd = self.bomb_int;
				self.bombing = true;
				self.bx = self.x;
				self.by = self.y;
				self.show_mess(UI.MIKATA.MESS_BOMB);
			}
			self.bomb_cd--;
			
			self.add_mana(self.mana_rec);
			var amount = Math.abs(self.mana - self.mana_disp);
			if (amount > self.mana_disp_spd)
			{
				amount = self.mana_disp_spd;
			}
			if (self.mana > self.mana_disp)
			{
				self.mana_disp += amount;
			}
			else
			{
				self.mana_disp -= amount;
			}
		}
		self.update_mess(field);
		if (self.muteki > 0)
		{
			self.muteki--;
		}
		if (self.bombing)
		{
			field.clear_shot(GROUP.MIKATA);
			self.bomb_cnt++;
			if (self.bomb_cnt > self.bomb_f)
			{
				self.bombing = false;
			}
		}
	}
	
	self.update_mess = function (field)
	{
		if (self.mess)
		{
			if (self.mess_f < 1)
			{
				self.mess_f += UI.MIKATA.MESS_FSPD;
				if (self.mess_f > 1)
				{
					self.mess_f = 1;
				}
			}
			else if (self.mess_s > 0)
			{
				self.mess_s--;
			}
			else if (self.mess_a > 0)
			{
				self.mess_a -= UI.MIKATA.MESS_ASPD;
				if (self.mess_a < 0)
				{
					self.mess_a = 0;
				}
			}
			else
			{
				self.mess = null;
			}
		}
	}
	
	self.draw = function (field, g)
	{
		self.draw_bomb(field, g);
		self.draw_chara(field, g);
		self.draw_message(field, g);
	}
	
	self.draw_chara = function (field, g)
	{
		if (!(self.muteki & 1) && !self.hide)
		{
			var img = self.img[0];
			g.drawImage(img.img, img.sx+32*self.moving, img.sy, img.sw, img.sh, self.x-img.ox, self.y-img.oy, self.w, self.h);
			g.lineWidth = 1;
			g.fillStyle = COLOR.GRAY;
			g.strokeStyle = COLOR.PURPLE;
			g.beginPath();
			g.arc(self.x, self.y, self.r, 0, PI2);
			g.fill();
			g.stroke();
		}
	}
	
	self.draw_bomb = function (field, g)
	{
		if (self.bombing)
		{
			var p = self.bomb_cnt / self.bomb_f;
			var temp = g.globalAlpha;
			g.globalAlpha = sin_f(1, 0, p);
			g.beginPath();
			var r = sin_f(0, UI.SCREEN.WIDTH, p);
			g.arc(self.bx, self.by, r, 0, PI2);
			var c = g.createRadialGradient(self.bx, self.by, 0, self.bx, self.by, r);
			c.addColorStop(0, "#FFFF66");
			c.addColorStop(0.4, "#FF6600");
			c.addColorStop(0.8, "#FF0000");
			c.addColorStop(1, "#000000");
			g.fillStyle = c;
			g.fill();
			g.globalAlpha = temp;
		}
	}
	
	self.draw_message = function (field, g)
	{
		if (self.mess)
		{
			g.font = UI.MIKATA.MESS_FONT;
			g.textAlign = "center";
			g.textBaseline = "middle";
			g.fillStyle = UI.MIKATA.MESS_COLOR;
			var temp = g.globalAlpha;
			g.globalAlpha = self.mess_a;
			var x = sqrt_f(UI.MIKATA.MESS_SX, UI.MIKATA.MESS_EX, self.mess_f);
			var y = sqrt_f(UI.MIKATA.MESS_SY, UI.MIKATA.MESS_EY, self.mess_f);
			g.fillText(self.mess, self.x+x, self.y+y);
			g.globalAlpha = temp;
		}
	}
	
	self.draw_zanki = function (field, g)
	{
		var x = UI.SUB.ZANKI_X + g.measureText(UI.SUB.ZANKI_TEXT).width;
		var y = UI.SUB.ZANKI_Y;
		for (var i=0; i<self.zanki; i++)
		{
			g.drawImage(image.YOYO_BATTLE, 32, 0, 32, 32, x+i*32, y-4, 32, 32);
		}
	}
	
	self.draw_mana = function (field, g)
	{
		var x = UI.SUB.MANA_X + g.measureText(UI.SUB.MANA_TEXT).width;
		var y = UI.SUB.MANA_Y;
		var rx = x + 5;
		var ry = UI.SUB.MANA_Y + 4;
		var nx = rx + UI.SUB.MANA_BAR_WIDTH + 5;
		var ny = y - 4;
		for (var i=1; i*1000<=self.mana; i++)
		{
			g.drawImage(image.YOYO_SP, 64, 0, 32, 32, nx+(i-1)*32, ny, 32, 32);
		}
		var m = Math.floor(self.mana_disp/1000);
		var c = UI.SUB.MANA_COLOR[m];
		if (m > 0)
		{
			var bc = UI.SUB.MANA_COLOR[m-1];
			g.fillStyle = bc;
			g.fillRect(rx, ry, UI.SUB.MANA_BAR_WIDTH, UI.SUB.MANA_BAR_HEIGHT);
		}
		g.fillStyle = c;
		g.fillRect(rx, ry, UI.SUB.MANA_BAR_WIDTH*(self.mana_disp%1000)/1000, UI.SUB.MANA_BAR_HEIGHT);
		g.strokeStyle = COLOR.BLACK;
		g.lineWidth = 2;
		g.strokeRect(rx, ry, UI.SUB.MANA_BAR_WIDTH, UI.SUB.MANA_BAR_HEIGHT);
	}
	
	self.show_mess = function (mess)
	{
		self.mess = mess;
		self.mess_f = 0;
		self.mess_s = UI.MIKATA.MESS_SFCNT;
		self.mess_a = 1;
	}
	
	self.add_mana = function (val)
	{
		self.mana += val;
		if (self.mana < 0)
		{
			self.mana = 0;
		}
		if (self.mana > self.mana_max)
		{
			self.mana = self.mana_max;
		}
	}
	
	self.die = function (field)
	{
		if (!self.is_muteki())
		{
			self.zanki--;
			if (self.zanki >= 0)
			{
				self.muteki = self.die_muteki;
				self.add_mana(self.mana_rage);
				self.show_mess(UI.MIKATA.MESS_DEAD);
			}
			else
			{
				self.hide = true;
				field.game_over();
			}
		}
	}
	
	self.is_muteki = function ()
	{
		return self.muteki > 0;
	}
	
	self.init();
	
	return self;
}

