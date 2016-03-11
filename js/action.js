
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
			for (var i=0; i<self.data.effect.length; i++)
			{
				var list = [];
				for (var j=0; j<self.target[i].length; j++)
				{
					list.push(self.calc_power(field, self.data.effect[i], self.target[i][j]));
				}
				self.power.push(list);
			}
		}
		self.fcnt = 0;
		self.wait = -1;
		self.eidx = 0;
		self.tidx = -1;
	}
	
	self.execute = function (field)
	{
		if (!self.caster.can_act(field) || self.target.length <= 0)
		{
			self.is_finished = true;
			return;
		}
		if (self.fcnt > self.wait)
		{
			self.tidx++;
			if (self.tidx >= self.target[self.eidx].length)
			{
				self.eidx++;
				self.tidx = 0;
				self.wait = self.fcnt + 15;
				if (self.eidx >= self.data.effect.length)
				{
					self.is_finished = true;
					return;
				}
			}
			else
			{
				self.wait = self.fcnt + 15;
			}
			self.execute_effect(field, self.data.effect[self.eidx], 
				self.target[self.eidx][self.tidx], self.power[self.eidx][self.tidx]);
		}
		self.fcnt++;
	}
	
	self.execute_effect = function (field, effect, target, power)
	{
		switch (effect.type)
		{
		case EFFECT.DAMAGE:
			target.take_damage(field, power);
			break;
		case EFFECT.HEAL:
			target.heal(field, power);
			break;
		}
	}
	
	self.get_target = function (field)
	{
		self.target = [];
		for (var i=0; i<self.data.effect.length; i++)
		{
			self.target.push(field.get_target(self.data.effect[i], self.caster, self.group));
		}
	}
	
	self.calc_power = function (field, effect, target)
	{
		var power = 0;
		if (effect.atk)
		{
			power += self.caster.atk * effect.atk / 100;
		}
		if (effect.hp)
		{
			power += target.hp * effect.hp / 100;
		}
		if (effect.mhp)
		{
			power += target.mhp * effect.mhp / 100;
		}
		return Math.floor(power * (1+field.get_chain_bonus()));
	}
	
	self.is_finish = function ()
	{
		return self.is_finished;
	}
	
	self.init();
	
	return self;
}
