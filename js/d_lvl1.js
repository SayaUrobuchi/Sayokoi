
var HUNTER_SHOT_TEMPLATE = extend(SHOT_TEMPLATE, {
	r: 4, 
	dr: 6, 
	color: COLOR.GRAY, 
	out_color: COLOR.RED, 
	target: GROUP.MIKATA, 
});
var HUNTER_FLOWER_SHOT_TEMPLATE = extend(HUNTER_SHOT_TEMPLATE, {
	r: 4, 
	dr: 6, 
	img: image.SHOT_FLOWER, 
	img_w: 16, 
	img_h: 16, 
	target: GROUP.MIKATA, 
});
var HUNTER_LETTER_SHOT_TEMPLATE = extend(HUNTER_SHOT_TEMPLATE, {
	r: 4, 
	dr: 6, 
	img: image.SHOT_LETTER, 
	img_w: 32, 
	img_h: 32, 
	target: GROUP.MIKATA, 
});
var HUNTER_CHOCO_SHOT_TEMPLATE = extend(HUNTER_SHOT_TEMPLATE, {
	r: 4, 
	dr: 6, 
	img: image.SHOT_CHOCOLATE, 
	img_w: 32, 
	img_h: 32, 
	target: GROUP.MIKATA, 
});

var hunter_spell0 = function(field, self)
{
	switch (self.state)
	{
	case 0:
		self.st_ang = 36;
		self.div = 5;
		self.div_ang = 360 / self.div;
		self.ldiv = 4;
		self.int_a = 12;
		self.int_b = self.div_ang - self.int_a * self.ldiv;
		self.int_c = self.int_a * 2 / 3;
		self.circle = 4;
		self.cir_rad = 20;
		self.cir_int = 18;
		self.shot_int = 4;
		self.cwait = 28;
		self.sspd = 2;
		self.aspd = 60;
		
		self.acnt = 0;
		self.bcnt = 0;
		self.ccnt = 0;
		self.state = 1;
		break;
	case 1:
		self.acnt++;
		if (self.acnt >= self.shot_int)
		{
			self.acnt = 0;
			self.bcnt++;
			if (self.bcnt >= self.ldiv)
			{
				self.bcnt = 0;
				self.ccnt++;
				if (self.ccnt >= self.circle)
				{
					self.acnt = 0;
					self.bcnt = 0;
					self.ccnt = 0;
					self.state = 2;
					self.st_ang += fdice(4, 48, 0);
					break;
				}
			}
			var st_ang = self.st_ang + self.int_c * self.ccnt;
			var r = self.cir_rad + self.cir_int * self.ccnt;
			for (var i=0; i<self.div; i++)
			{
				var ang = deg(st_ang + self.div_ang * i + self.int_a * self.bcnt);
				self.fire(field, [
					extend(HUNTER_FLOWER_SHOT_TEMPLATE, {
						ox: Math.cos(ang) * r, 
						oy: Math.sin(ang) * r, 
						dx: Math.cos(ang), 
						dy: Math.sin(ang), 
						spd: 0, 
						
						wait: self.ldiv * self.circle * self.shot_int + (self.circle-self.ccnt) * self.cwait, 
						rspd: self.sspd, 
						aspd: self.aspd, 
						timer: 0, 
						move: function (field, self) {
							var shot = self.data;
							if (shot.wait > 0)
							{
								shot.wait--;
								return;
							}
							shot.timer++;
							var real_prog = Math.min(1, shot.timer/shot.aspd);
							real_prog = Math.sin(real_prog * Math.PI / 2);
							shot.spd = shot.rspd * real_prog;
							SHOT.MOVE_LINE(field, self);
						}, 
					}), 
				]);
			}
		}
		break;
	case 2:
		self.bcnt++;
		if (self.bcnt >= 160)
		{
			self.acnt = 0;
			self.bcnt = 0;
			self.state = 1;
		}
		break;
	}
};

var hunter_spell1 = function(field, self)
{	switch (self.state)
	{
	case 0:
		self.acnt = 0;
		self.aang = fdice(4, 90, 0);
		self.bcnt = 0;
		self.ccnt = 0;
		self.dcnt = 0;
		self.delay = 48;
		self.state = 1;
		
		self.as_div = 5;
		self.as_ang = 17;
		self.as_div_ang = 360 / self.as_div;
		self.as_int = 40;
		self.as_spd = 4;
		
		self.bs_sang = 24;
		self.bs_ast = 48;
		self.bs_aint = 36;
		self.bs_bst = 100;
		self.bs_cnt0 = 5;
		self.bs_cnt1 = 4;
		self.bs_int = 150;
		self.bs_int2 = 24;
		self.bs_spd = 5;
		break;
	case 1:
		self.delay--;
		if (self.delay <= 0)
		{
			self.state = 2;
		}
		break;
	case 2:
		if (self.acnt++ >= self.as_int)
		{
			self.acnt = 0;
			for (var i=0; i<self.as_div; i++)
			{
				var ang = deg(self.aang + self.as_div_ang * i);
				self.fire(field, [
					extend(HUNTER_LETTER_SHOT_TEMPLATE, {
						dx: Math.cos(ang), 
						dy: Math.sin(ang), 
						spd: self.as_spd, 
					}), 
				]);
			}
			self.aang += self.as_ang;
		}
		if (self.bcnt++ >= self.bs_int)
		{
			var exec = true;
			self.ccnt++;
			if (self.ccnt >= self.bs_int2)
			{
				self.dcnt++;
				self.ccnt = 0;
				if (self.dcnt >= self.bs_cnt1)
				{
					self.bcnt = 0;
					self.dcnt = 0;
					exec = false;
				}
				if (exec)
				{
					var ang = [deg(180-self.bs_sang), deg(self.bs_sang)];
					var move = function(field, self) {
						var shot = self.data;
						if (shot.mc++ > shot.mt && !is_def(shot.mf))
						{
							if (shot.spd != 0)
							{
								shot.tspd = shot.spd;
								shot.spd = 0;
								var mc = field.get_mchara();
								var mang = deg(0);
								if (is_def(mc))
								{
									mang = self.angle_to(mc);
								}
								shot.dx = Math.cos(mang);
								shot.dy = Math.sin(mang);
							}
							if (shot.wait-- <= 0)
							{
								shot.mf = true;
								shot.spd = shot.tspd;
							}
						}
						SHOT.MOVE_LINE(field, self);
					};
					for (var i=0; i<self.bs_cnt0; i++)
					{
						var dis = self.bs_ast + self.bs_aint * i;
						for (var j=0; j<2; j++)
						{
							self.fire(field, [
								extend(HUNTER_LETTER_SHOT_TEMPLATE, {
									dx: Math.cos(ang[j]), 
									dy: Math.sin(ang[j]), 
									mc: 0, 
									mt: dis / self.bs_spd, 
									wait: self.bs_bst - self.dcnt * self.bs_int2 * .7, 
									spd: self.bs_spd, 
									move: move, 
								}), 
							]);
						}
					}
				}
			}
		}
		break;
	}

};

var hunter_spell2 = function(field, self)
{
	switch (self.state)
	{
	case 0:
		self.acnt = 0;
		self.a_int = 60;
		self.delay = 64;
		self.state = 1;
		break;
	case 1:
		self.delay--;
		if (self.delay <= 0)
		{
			self.state = 2;
		}
		break;
	case 2:
		if (self.acnt++ >= self.a_int)
		{
			self.acnt = 0;
			var ox = fdice(1, 500, -250);
			var oy = fdice(4, 16, -32);
			var spd = fdice(3, 1, .5);
			var r = fdice(5, 4, 0);
			var num = fdice(3, 4, 10);
			var aint = 360 / num;
			var stang = fdice(1, 360, 0);
			for (var i=0; i<num; i++)
			{
				var ang = deg(stang + aint * i);
				self.fire(field, [
					extend(HUNTER_CHOCO_SHOT_TEMPLATE, {
						ox: ox + Math.cos(ang) * r, 
						oy: oy + Math.sin(ang) * r, 
						dx: Math.cos(ang), 
						dy: Math.sin(ang), 
						spd: spd, 
					}), 
				]);
			}
		}
		break;
	}
};

var hunter_spell3 = function(field, self)
{
	switch (self.state)
	{
	case 0:
		self.acnt = 0;
		self.a_int = 20;
		self.delay = 64;
		self.state = 1;
		break;
	case 1:
		self.delay--;
		if (self.delay <= 0)
		{
			self.state = 2;
		}
		break;
	case 2:
		if (self.acnt++ >= self.a_int)
		{
			self.acnt = 0;
			self.a_int = fdice(4, 3, 0);
			var ox = fdice(1, 500, -250);
			var oy = fdice(4, 16, -32);
			var spd = fdice(3, 1, .5);
			var type = fdice(1, 3, 0);
			var shot = HUNTER_FLOWER_SHOT_TEMPLATE;
			if (type > 2)
			{
				shot = HUNTER_CHOCO_SHOT_TEMPLATE;
			}
			else if (type > 1)
			{
				shot = HUNTER_LETTER_SHOT_TEMPLATE;
			}
			self.fire(field, [
				extend(shot, {
					ox: ox, 
					oy: oy, 
					dx: 0, 
					dy: 1, 
					spd: spd, 
				}), 
			]);
		}
		break;
	}
};

enemy.hunter = extend(ENEMY_TEMPLATE, {
	img: image.HUNTER_BATTLE, 
	sx: 64, 
	sy: 0, 
	lvl_name: [
		"宅男散花", 
		"飛鴿傳情", 
		"甜食溶心", 
		"落華有意　綿情似雪", 
	], 
	shot: function (field, self)
	{
		switch (self.lvl)
		{
		case 0:
			hunter_spell0(field, self);
			break;
		case 1:
			hunter_spell1(field, self);
			break;
		case 2:
			hunter_spell2(field, self);
			break;
		case 3:
			hunter_spell3(field, self);
			break;
		}
	}, 
});

level[1] = extend(LEVEL_TEMPLATE, {
	events: {
		start: [
			extend(LEVEL_TALK_TEMPLATE, {
				name: "男子", 
				text: [
					"請留步，這位美麗的少女。", 
				], 
				text_loc: STG_TALK.TEXT_BOT, 
				img: TACHIE.HUNTER_NORMAL, 
				img_loc: STG_TALK.TACHIE_RIGHT, 
			}), 
			extend(LEVEL_TALK_TEMPLATE, {
				name: "少女？", 
				text: [
					"嗯？你誰啊？", 
				], 
				text_loc: STG_TALK.TEXT_TOP, 
				img: TACHIE.YOYO_ASK, 
				img_loc: STG_TALK.TACHIE_LEFT, 
			}), 
			extend(LEVEL_TALK_TEMPLATE, {
				name: "男子", 
				text: [
					"我是狩獵少女心的獵人。在這情人佳節，", 
					"特地為捕獲我的女神祐祐的芳心而來！", 
				], 
				text_loc: STG_TALK.TEXT_BOT, 
				img: TACHIE.HUNTER_NORMAL, 
				img_loc: STG_TALK.TACHIE_RIGHT, 
			}), 
			extend(LEVEL_TALK_TEMPLATE, {
				name: "祐祐", 
				text: [
					"…蛤？", 
				], 
				text_loc: STG_TALK.TEXT_TOP, 
				img: TACHIE.YOYO_NOTGOOD, 
				img_loc: STG_TALK.TACHIE_LEFT, 
			}), 
			extend(LEVEL_TALK_TEMPLATE, {
				name: "獵人", 
				text: [
					"請收下我傾注心血、琢磨數日，", 
					"手工精心製作的卡片與巧克力吧！！", 
				], 
				text_loc: STG_TALK.TEXT_BOT, 
				img: TACHIE.HUNTER_NORMAL, 
				img_loc: STG_TALK.TACHIE_RIGHT, 
			}), 
			extend(LEVEL_TALK_TEMPLATE, {
				name: "祐祐", 
				text: [
					"哇、這量怎麼回事！？", 
				], 
				text_loc: STG_TALK.TEXT_TOP, 
				img: TACHIE.YOYO_NOTGOOD, 
				img_loc: STG_TALK.TACHIE_LEFT, 
			}), 
			extend(LEVEL_TALK_TEMPLATE, {
				name: "祐祐", 
				text: [
					"雖然感謝你的心意，但要是收了，", 
					"『那傢伙』肯定會不高興的。", 
				], 
				text_loc: STG_TALK.TEXT_TOP, 
				img: TACHIE.YOYO_NOTGOOD, 
				img_loc: STG_TALK.TACHIE_LEFT, 
			}), 
			extend(LEVEL_TALK_TEMPLATE, {
				name: "獵人", 
				text: [
					"什麼！？『那傢伙』是誰！！", 
				], 
				text_loc: STG_TALK.TEXT_BOT, 
				img: TACHIE.HUNTER_ANGRY, 
				img_loc: STG_TALK.TACHIE_RIGHT, 
			}), 
			extend(LEVEL_TALK_TEMPLATE, {
				name: "獵人", 
				text: [
					"…對了，那就讓他不高興自己退吧！", 
					"這樣女神祐祐就是我的了！！", 
				], 
				text_loc: STG_TALK.TEXT_BOT, 
				img: TACHIE.HUNTER_ANGRY, 
				img_loc: STG_TALK.TACHIE_RIGHT, 
			}), 
			extend(LEVEL_TALK_TEMPLATE, {
				name: "祐祐", 
				text: [
					"…稍微也顧慮下我的心情啊喂。", 
					"請回吧，我是不會收的。", 
				], 
				text_loc: STG_TALK.TEXT_TOP, 
				img: TACHIE.YOYO_SIL, 
				img_loc: STG_TALK.TACHIE_LEFT, 
			}), 
			extend(LEVEL_TALK_TEMPLATE, {
				name: "獵人", 
				text: [
					"愛之道上是沒有退路的。", 
					"接受我所有愛的彈幕吧！！", 
				], 
				text_loc: STG_TALK.TEXT_BOT, 
				img: TACHIE.HUNTER_ANGRY, 
				img_loc: STG_TALK.TACHIE_RIGHT, 
			}), 
			extend(LEVEL_TALK_TEMPLATE, {
				name: "祐祐", 
				text: [
					"…這心意還真夠擾人的啊。", 
					"沒辦法，只好邊迴避禮物邊回絕你了！", 
				], 
				text_loc: STG_TALK.TEXT_TOP, 
				img: TACHIE.YOYO_LAUGH, 
				img_loc: STG_TALK.TACHIE_LEFT, 
			}), 
			extend(LEVEL_BGM_TEMPLATE, {
				audio: audio.MASUPA, 
			}), 
			extend(LEVEL_ENEMY_TEMPLATE, {
				enemy: enemy.hunter, 
			}), 
		], 
		clear: [
			extend(LEVEL_TALK_TEMPLATE, {
				name: "獵人", 
				text: [
					"竟、竟然如此對待我的心血…", 
					"我的愛…！唔唔、我不甘心…！", 
				], 
				text_loc: STG_TALK.TEXT_BOT, 
				img: TACHIE.HUNTER_ANGRY, 
				img_loc: STG_TALK.TACHIE_RIGHT, 
			}), 
			extend(LEVEL_TALK_TEMPLATE, {
				name: "祐祐", 
				text: [
					"真是不好意思，", 
					"但恕我無法接受。", 
				], 
				text_loc: STG_TALK.TEXT_TOP, 
				img: TACHIE.YOYO_LAUGH, 
				img_loc: STG_TALK.TACHIE_LEFT, 
			}), 
			extend(LEVEL_TALK_TEMPLATE, {
				name: "祐祐", 
				text: [
					"好好珍惜下個女孩吧，", 
					"祝你幸福！", 
				], 
				text_loc: STG_TALK.TEXT_TOP, 
				img: TACHIE.YOYO_LAUGH, 
				img_loc: STG_TALK.TACHIE_LEFT, 
			}), 
			extend(LEVEL_NEXT_TEMPLATE, {
				id: 1, 
			}), 
		], 
	}, 
});

