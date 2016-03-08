
function Action(id, group, is_preview)
{
	var self = {};
	group = group || GROUP.NONE;
	
	self.init = function ()
	{
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
	
	self.init();
	
	return self;
}
