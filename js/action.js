
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
	
	self.start = function (field)
	{
		self.get_target(field);
		self.power = self.caster.atk;
		console.log(self.power);
		self.fcnt = 0;
		self.wait = 0;
		self.is_finished = false;
	}
	
	self.execute = function (field)
	{
		if (self.wait && self.fcnt > self.wait)
		{
			self.is_finished = true;
			return;
		}
		if (!self.wait)
		{
			self.wait = self.fcnt + 90;
			self.target[0].take_damage(field, self.power);
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
			for (var i=0; i<field.enemy.length; i++)
			{
				if (field.enemy[i].is_targetable(field))
				{
					self.target = [field.enemy[i]];
					break;
				}
			}
		}
	}
	
	self.is_finish = function ()
	{
		return self.is_finished;
	}
	
	self.init();
	
	return self;
}
