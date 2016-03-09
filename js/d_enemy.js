
var ENEMY_TEMPLATE = {
	w: 250, 
	cw: 0, 
	sy: 20, 
	draw: ENEMY_FUNC.DRAW_NORMAL, 
	die: ENEMY_FUNC.DIE_DISAPPEAR, 
};

ENEMY[ENEMY.TEST0 = 999] = extend(ENEMY_TEMPLATE, {
	name: "赤血妖瞳", 
	img: image.ENEMY_TEST0, 
	w: 220, 
	hp: 70, 
	atk: 8, 
});

ENEMY[ENEMY.TEST1 = 998] = extend(ENEMY_TEMPLATE, {
	name: "龍兒", 
	img: image.ENEMY_TEST1, 
	w: 340, 
	cw: -90, 
	sy: 10, 
	hp: 50, 
	atk: 12, 
});

ENEMY[ENEMY.TEST2 = 997] = extend(ENEMY_TEMPLATE, {
	name: "魔狼『芬里兒』", 
	img: image.ENEMY_TEST2, 
	w: 180, 
	hp: 90, 
	atk: 4, 
});
