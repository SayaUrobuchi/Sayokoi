
var ENEMY = {};

var ENEMY_FUNC = {
	DRAW_NORMAL: function (field, g, self)
	{
		g.drawImage(self.data.img, 
			self.x-self.w/2, self.y-self.h-self.data.sy, self.w, self.h);
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
		self.x = data.x;
		self.y = data.y;
		self.w = data.w;
		self.cw = self.w + self.data.cw;
		self.h = data.img.height * self.w / data.img.width;
		self.state = 0;
		self.hp_bar_rate = 0;
	};
	
	self.update = function (field)
	{
		if ((field.state == STG.BATTLE || field.state == STG.ENEMY_DEFEAT) && self.fid != field.fid)
		{
			self.fid = field.fid;
			self.update_defeat(field);
		}
	}
	
	self.update_defeat = function (field)
	{
	}
	
	self.draw = function (field, g)
	{
		if (!self.hide)
		{
			self.data.draw(field, g, self);
		}
		self.draw_name(field, g);
	}
	
	self.draw_name = function (field, g)
	{
		g.font = UI.ENEMY.NAME_FONT;
		g.textAlign = "center";
		g.textBaseline = "top";
		g.fillStyle = COLOR.TEXT;
		g.fillText(self.data.name, self.x, self.y+24);
		g.strokeStyle = COLOR.RED;
		g.lineWidth = 0.2;
		//g.strokeText(self.data.name, self.x, self.y+24);
	}
	
	self.take_damage = function (field, value)
	{
		self.hp -= value;
		if (self.hp <= 0)
		{
			self.hp = 0;
			self.die(field);
		}
	}
	
	self.die = function (field)
	{
	}
	
	self.init();
	
	return self;
}

