
var ENEMY_TEMPLATE = {
	w: 250, 
	cw: 0, 
	sy: 0, 
	draw: ENEMY_FUNC.DRAW_NORMAL, 
	die: ENEMY_FUNC.DIE_DISAPPEAR, 
};

ENEMY[ENEMY.TEST0 = 999] = extend(ENEMY_TEMPLATE, {
	name: "赤血妖瞳", 
	img: image.ENEMY_TEST0, 
	w: 220, 
	hp: 700, 
	atk: 80, 
});

ENEMY[ENEMY.TEST1 = 998] = extend(ENEMY_TEMPLATE, {
	name: "龍兒", 
	img: image.ENEMY_TEST1, 
	w: 340, 
	cw: -90, 
	sy: -30, 
	hp: 500, 
	atk: 120, 
});

ENEMY[ENEMY.TEST2 = 997] = extend(ENEMY_TEMPLATE, {
	name: "魔狼『芬里兒』", 
	img: image.ENEMY_TEST2, 
	w: 180, 
	hp: 900, 
	atk: 40, 
});
