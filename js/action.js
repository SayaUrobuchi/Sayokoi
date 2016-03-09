
function Action(id, caster, is_preview)
{
	var self = {};
	group = caster.group || GROUP.NONE;
	
	self.init = function ()
	{
		self.caster = caster;
		self.card_id = id;
		self.data = CARD[id];
		self.group = group;
		self.speed = self.data.speed;
		self.name = self.data.name;
		self.cost = self.data.cost;
		self.is_preview = is_preview;
	}
	
	self.compare_to = function (action)
	{
		if (self.speed != action.speed)
		{
			return self.speed - action.speed;
		}
		return action.group - self.group;
	}
	
	self.is_available = function (field)
	{
		return self.caster.can_act(field) && self.target.length > 0;
	}
	
	self.prepare = function (field)
	{
		self.get_target(field);
		self.is_finished = false;
	}
	
	self.start = function (field)
	{
		if (self.target.length > 0)
		{
			self.power = [];
			for (var i=0; i<self.target.length; i++)
			{
				self.power.push(self.calc_power(field, self.target[i]));
			}
		}
		self.fcnt = 0;
		self.wait = 0;
	}
	
	self.execute = function (field)
	{
		if (!self.caster.can_act(field) || self.target.length <= 0)
		{
			self.is_finished = true;
			return;
		}
		if (self.wait && self.fcnt > self.wait)
		{
			self.is_finished = true;
			return;
		}
		if (!self.wait)
		{
			self.wait = self.fcnt + 50;
			if (self.data.type)
			{
				self.caster.heal(field, self.power[0]*.8);
			}
			else
			{
				self.target[0].take_damage(field, self.power[0]);
			}
		}
		self.fcnt++;
	}
	
	self.get_target = function (field)
	{
		if (self.group == GROUP.ENEMY)
		{
			self.target = [field.player_battler];
		}
		else
		{
			self.target = [];
			for (var i=0; i<field.enemy.length; i++)
			{
				if (field.enemy[i].is_targetable(field))
				{
					self.target.push(field.enemy[i]);
					break;
				}
			}
		}
	}
	
	self.calc_power = function (field, target)
	{
		return Math.floor(self.caster.atk * (1+field.get_chain_bonus()));
	}
	
	self.is_finish = function ()
	{
		return self.is_finished;
	}
	
	self.init();
	
	return self;
}
