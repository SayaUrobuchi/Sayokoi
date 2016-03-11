
var TARGET = {
	SELF: 0, 
	MATE: 1, 
	ENEMY: 2, 
	BOTH: 3, 
	GROUP_MASK: 3, 
	
	SINGLE: 0, 
	MULTIPLE: 4, 
	RANGE_MASK: 12, 
};

var EFFECT = {
	NONE: 0, 
	DAMAGE: 1, 
	HEAL: 2, 
};

var EFFECT_TEMPLATE = {
};

EFFECT_TEMPLATE.SINGLE_DAMAGE = function (param)
{
	var res = {
		type: EFFECT.DAMAGE, 
		target: TARGET.ENEMY, 
	};
	res.atk = param;
	return res;
}

EFFECT_TEMPLATE.SELF_HEAL = function (param)
{
	var res = {
		type: EFFECT.HEAL, 
		target: TARGET.ENEMY, 
	};
	res.atk = param;
	return res;
}
