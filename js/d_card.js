
var CARD_TEMPLATE = {
};

CARD[997] = extend(CARD_TEMPLATE, {
	cost: 6, 
	speed: 8, 
	name: "火球炸裂", 
	desc: "向目標發射高度壓縮的火球，命中時將猛烈炸開。威力 150%ATK 火。", 
	effect: [
		EFFECT_TEMPLATE.SINGLE_DAMAGE(150), 
	], 
});

CARD[998] = extend(CARD_TEMPLATE, {
	cost: 5, 
	speed: 4, 
	name: "幽影斬", 
	desc: "於闇系魔力上附加撕裂意念，具現為暗影的利刃，無聲無息斬向目標。威力 90%ATK 風。", 
	effect: [
		EFFECT_TEMPLATE.SINGLE_DAMAGE(30), 
		EFFECT_TEMPLATE.SINGLE_DAMAGE(30), 
		EFFECT_TEMPLATE.SINGLE_DAMAGE(30), 
	], 
});

CARD[999] = extend(CARD_TEMPLATE, {
	cost: 12, 
	speed: 14, 
	name: "聖癒之光", 
	desc: "召來神聖的治癒之光，治療自身。威力 60%ATK。", 
	effect: [
		EFFECT_TEMPLATE.SELF_HEAL(60), 
	], 
});
