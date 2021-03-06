
var game = {
	stg_stage: 1, 
};

var GROUP = {
	NONE: 0, 
	MATE: 1, 
	ENEMY: 2, 
};

var image = {};
var audio = {};

var IMAGE = {
	YOYO_ASK: "p/yoyo_ask.png", 
	YOYO_NOTGOOD: "p/yoyo_notgood.png", 
	YOYO_SIL: "p/yoyo_sil.png", 
	YOYO_LAUGH: "p/yoyo_laugh.png", 
	YOYO_BATTLE: "p/yoyo.png", 
	YOYO_SP: "p/yoyo_sp.png", 
	HUNTER_NORMAL: "p/hunter_normal.png", 
	HUNTER_ANGRY: "p/hunter_angry.png", 
	HUNTER_BATTLE: "p/hunter.png", 
	SHOT_FLOWER: "p/flower_shot.png", 
	SHOT_LETTER: "p/letter_shot.png", 
	SHOT_CHOCOLATE: "p/chocolate_shot.png", 
	
	TACHIE_YOYO_NORMAL: "p/tachie_yoyo_normal.png", 
	TACHIE_SAKO_NORMAL: "p/tachie_sako_normal.png", 
	
	BG_FOREST_TWILIGHT: "p/bg_forest_yu.jpg", 
	
	ENEMY_TEST0: "p/184_vanp_tinasi.png", 
	ENEMY_TEST1: "p/198_doragon.png", 
	ENEMY_TEST2: "p/251_kikimora.png", 
};
var AUDIO = {
	MASUPA: "a/masupa.mp3", 
};

function is_preload_complete()
{
	return image.__cnt == image.__max_cnt && audio.__cnt >= audio.__max_cnt;
}

function after_preload()
{
}

var KEY = {
	LEFT: 37, 
	UP: 38, 
	RIGHT: 39, 
	DOWN: 40, 
	Z: 90, 
	X: 88, 
	C: 67, 
	V: 86, 
	A: 65, 
	S: 83, 
	R: 82, 
	SHIFT: 16, 
};

var INPUT = {
	UNKNOWN: 0, 
	LEFT: 1, 
	DOWN: 2, 
	UP: 3, 
	RIGHT: 4, 
	DECIDE: 5, 
	CANCEL: 6, 
	MENU: 7, 
	SUB: 8, 
	PAGEUP: 9, 
	PAGEDOWN: 10, 
	
	VERTICAL: 128, 
	HORIZONTAL: 129, 
	ARROW: 130, 
};

function parse_key(key)
{
	switch (key)
	{
	case KEY.LEFT:
		return INPUT.LEFT;
	case KEY.RIGHT:
		return INPUT.RIGHT;
	case KEY.UP:
		return INPUT.UP;
	case KEY.DOWN:
		return INPUT.DOWN;
	case KEY.C:
		return INPUT.DECIDE;
	case KEY.X:
		return INPUT.CANCEL;
	case KEY.V:
		return INPUT.MENU;
	case KEY.Z:
		return INPUT.SUB;
	case KEY.A:
		return INPUT.PAGEUP;
	case KEY.S:
		return INPUT.PAGEDOWN;
	}
	return INPUT.UNKNOWN;
}

var COLOR = {
	WHITE: "white", 
	GRAY: "#CCCCCC", 
	BLACK: "#000", 
	RED: "#FF0000", 
	DARK_RED: "#AA0000", 
	DARK_RED2: "#440000", 
	PINK: "#FF6699", 
	GREEN: "#00FF00", 
	DARK_GREEN: "#00CC00", 
	DARK_GREEN2: "#009900", 
	DARK_GREEN3: "#004D00", 
	BLUE: "#0000FF", 
	BRIGHT_BLUE: "#00CCFF", 
	PURPLE: "#FF00FF", 
	YELLOW: "#FFFF66", 
	BRIGHT_COFFEE: "#996633", 
	TRANSPARENT: rgba(0, 0, 0, 0), 
};

COLOR.TEXT = COLOR.GRAY;
COLOR.TALK_BACK = COLOR.DARK_RED;
COLOR.TALK_BACK_INACTIVE = COLOR.DARK_RED2;

var UI = {
	//DEFAULT_FONT: "DFKai-SB", 
	DEFAULT_FONT: "NotoSans", 
	DEFAULT_SMALL_FONT: "NotoSans", 
	DEFAULT_ASCII_FONT: "monospace", 
	DEFAULT_NUMBER_FONT: "Arial", 
};

UI.SCREEN = {
	WIDTH: 1280, 
	HEIGHT: 720, 
};

UI.GENERAL = {
	SUB_TITLE_FONT: "28px "+UI.DEFAULT_FONT, 
	DAMAGE_FONT: "bold 100px "+UI.DEFAULT_NUMBER_FONT, 
	DAMAGE_PREVIEW_FONT: "800 28px "+UI.DEFAULT_NUMBER_FONT, 
	CHAIN_FONT: "italic 36px "+UI.DEFAULT_FONT, 
	CHAIN_NUMBER_FONT: "900 80px "+UI.DEFAULT_NUMBER_FONT, 
};

// ---- loading

UI.LOADING = {
	TEXT: "少女開店中", 
	TEXT_COLOR: COLOR.TEXT, 
	FONT: "60px "+UI.DEFAULT_FONT, 
	ANI_IN_FCNT: 24, 
	ANI_OUT_FCNT: 8, 
};

// ---- hunt

UI.HAND = {
	HEIGHT: 50, 
	MAIN_HEIGHT: 140, 
	WIDTH: 280, 
	WIDTH_REDUCE: 20, 
	DISPLAY_COUNT: 8, 
	TITLE_FONT: "24px "+UI.DEFAULT_FONT, 
	SPEED_FONT: "bold 20px "+UI.DEFAULT_ASCII_FONT, 
	COST_FONT: "bold 28px "+UI.DEFAULT_ASCII_FONT, 
	TEXT_FONT: "16px "+UI.DEFAULT_SMALL_FONT, 
	TEXT_COLOR: COLOR.TEXT, 
	USABLE_COLOR: COLOR.BRIGHT_BLUE, 
	UNUSABLE_COLOR: COLOR.RED, 
};

UI.HP_BAR = {
	TEXT: "生命", 
	SEP_TEXT: "/", 
	FONT_SIZE: 24, 
	HEIGHT: 30, 
	FRONT_COLOR: COLOR.RED, 
	BACK_COLOR: COLOR.DARK_RED, 
	PREVIEW_COLOR: COLOR.YELLOW, 
	TEXT_FONT: "20px "+UI.DEFAULT_FONT, 
	VALUE_FONT: "bold 24px "+UI.DEFAULT_ASCII_FONT, 
};

UI.HP_BAR.X = 400;
UI.HP_BAR.NOW_X = UI.HP_BAR.X + 100;
UI.HP_BAR.SEP_X = UI.HP_BAR.NOW_X + 80;
UI.HP_BAR.MAX_X = UI.HP_BAR.SEP_X + 20;
UI.HP_BAR.PREVIEW_X = UI.HP_BAR.MAX_X + 100;

UI.MP_BAR = extend(UI.HP_BAR, {
	TEXT: "魔力", 
	FRONT_COLOR: COLOR.BLUE, 
});

UI.TIMELINE = {
	FONT: "24px "+UI.DEFAULT_FONT, 
};

UI.SUB = {
	OFFSET_X: 500, 
	OFFSET_Y: 0, 
	WIDTH: 300, 
	HEIGHT: UI.SCREEN.HEIGHT, 
	BACKGROUND_COLOR: rgb(0x44, 0x44, 0xAA), 
	FONT: "24px "+UI.DEFAULT_FONT, 
	COLOR: COLOR.TEXT, 
	ZANKI_TEXT: "殘機", 
	ZANKI_X: 10, 
	ZANKI_Y: 10, 
	MANA_TEXT: "魔力", 
	MANA_X: 10, 
	MANA_Y: 44, 
	MANA_BAR_WIDTH: 128, 
	MANA_BAR_HEIGHT: 20, 
	MANA_COLOR: [COLOR.DARK_RED, COLOR.YELLOW, COLOR.GREEN], 
	CTRL_TEXT: [
		"閃避：←↓↑→", 
		"回絕：Z", 
		"威嚇：X", 
		"謹慎：SHIFT", 
	], 
	CTRL_X: 10, 
	CTRL_Y: 470, 
	CTRL_H: 30, 
};

UI.MIKATA = {
	MESS_FONT: "14px "+UI.DEFAULT_ASCII_FONT, 
	MESS_SX: 0, 
	MESS_SY: 0, 
	MESS_EX: 0, 
	MESS_EY: -20, 
	MESS_COLOR: COLOR.RED, 
	MESS_DEAD: "RECEIVED!", 
	MESS_BOMB: "REJECT!", 
	MESS_FSPD: 0.04, 
	MESS_SFCNT: 48, 
	MESS_ASPD: 0.03, 
};

UI.ENEMY = {
	NAME_FONT: "24px "+UI.DEFAULT_FONT, 
};

UI.TALK = {
	X: 16, 
	TOP_Y: 16, 
	MID_Y: 232, 
	BOT_Y: 452, 
	CORN_SIZE: 16, 
	WIDTH: 436, 
	HEIGHT: 100, 
	FROM_X0: 240, 
	FROM_X1: 264, 
	FROM_OX: 64, 
	FROM_OY: 64, 
	TACHIE_LEFT_X: 120, 
	TACHIE_RIGHT_X: 380, 
	TACHIE_Y: 300, 
	FONT: "20px "+UI.DEFAULT_FONT, 
	NAME_X: 20, 
	NAME_Y: 20, 
	TEXT_X: 40, 
	TEXT_Y: 50, 
	TEXT_HEIGHT: 24, 
};

UI.GAMEOVER = {
	FONT: "80px "+UI.DEFAULT_FONT, 
	COLOR: COLOR.TEXT, 
	X: UI.SCREEN.WIDTH/2, 
	Y: UI.SCREEN.HEIGHT/2, 
	TEXT: "那傢伙不開心惹", 
	FONT2: "24px "+UI.DEFAULT_FONT, 
	COLOR2: COLOR.RED, 
	X2: UI.SCREEN.WIDTH/2, 
	Y2: UI.SCREEN.HEIGHT/2+60, 
	TEXT2: "按R投幣重試", 
};

UI.CLEAR = {
	FONT: "80px "+UI.DEFAULT_ASCII_FONT, 
	COLOR: COLOR.TEXT, 
	X: UI.SCREEN.WIDTH/2, 
	Y: UI.SCREEN.HEIGHT/2, 
	TEXT: "CONGRATULATIONS!!", 
	FONT2: "24px "+UI.DEFAULT_ASCII_FONT, 
	COLOR2: COLOR.RED, 
	X2: UI.SCREEN.WIDTH/2, 
	Y2: UI.SCREEN.HEIGHT/2+60, 
	TEXT2: "PRESS X TO CONTINUE", 
};

