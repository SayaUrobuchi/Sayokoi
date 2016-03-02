
var level = {};

var LEVEL_TEMPLATE = {
};

var LEVEL_EVENT_TEMPLATE = {
};

var LEVEL_TALK_TEMPLATE = extend(LEVEL_EVENT_TEMPLATE, {
	type: STGEVENT.TALK, 
	text_loc: STG_TALK.TEXT_MID, 
});

var LEVEL_ENEMY_TEMPLATE = extend(LEVEL_EVENT_TEMPLATE, {
	type: STGEVENT.ENEMY, 
});

var LEVEL_NEXT_TEMPLATE = extend(LEVEL_EVENT_TEMPLATE, {
	type: STGEVENT.NEXT, 
});

var LEVEL_BGM_TEMPLATE = extend(LEVEL_EVENT_TEMPLATE, {
	type: STGEVENT.BGM, 
});

var TACHIE_TEMPLATE = {
};

var TACHIE = {
	YOYO_ASK: extend(TACHIE_TEMPLATE, {
		img: image.YOYO_ASK, 
		w: 352, 
		h: 415, 
	}), 
	YOYO_SIL: extend(TACHIE_TEMPLATE, {
		img: image.YOYO_SIL, 
		w: 352, 
		h: 415, 
	}), 
	YOYO_LAUGH: extend(TACHIE_TEMPLATE, {
		img: image.YOYO_LAUGH, 
		w: 352, 
		h: 415, 
	}), 
	HUNTER_NORMAL: extend(TACHIE_TEMPLATE, {
		img: image.HUNTER_NORMAL, 
		w: 352, 
		h: 415, 
	}), 
	HUNTER_ANGRY: extend(TACHIE_TEMPLATE, {
		img: image.HUNTER_ANGRY, 
		w: 352, 
		h: 415, 
	}), 
};

