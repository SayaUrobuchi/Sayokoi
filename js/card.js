
var CARD = {};
var Card = {};

Card.SIDE_BATTLE = 1;
Card.SIDE_DISCOVER = 2;

Card.draw_hand = function (id, g, field)
{
	var c = CARD[id];
	var x = field.hand_draw_pos.real_x;
	var y = field.hand_draw_pos.real_y;
	var a = field.hand_draw_pos.real_a;
	var scale = field.hand_scale;
	var desc_a = field.hand_draw_pos.real_desc_a;
	var desc_h = field.hand_draw_pos.real_desc_h;
	var side = (field.state == HUNT_STATE.DISCOVER ? Card.SIDE_DISCOVER : Card.SIDE_BATTLE);
	var current = field.hand_is_current;
	var now_a = g.globalAlpha;
	g.globalAlpha *= a;
	g.translate(x, y);
	g.scale(scale, scale);
	// background
	var style = g.createLinearGradient(0, 0, UI.HAND.WIDTH, 0);
	style.addColorStop(0, COLOR.BLACK);
	style.addColorStop(.5, COLOR.RED);
	style.addColorStop(1, COLOR.DARK_RED);
	g.fillStyle = style;
	g.strokeStyle = "#CC00FF";
	g.fillRect(0, 0, UI.HAND.WIDTH, UI.HAND.HEIGHT);
	var w = 2;
	g.lineWidth = w;
	g.strokeRect(-w, 0, UI.HAND.WIDTH+w, UI.HAND.HEIGHT);
	if (current)
	{
		g.strokeStyle = COLOR.YELLOW;
		g.strokeRect(-w, 0, UI.HAND.WIDTH+w, UI.HAND.HEIGHT);
	}
	// text
	g.textAlign = "left";
	g.textBaseline = "middle";
	var text_y = y;
	var text_x = x;
	if (side == Card.SIDE_BATTLE)
	{
		// speed
		g.fillStyle = UI.HAND.TEXT_COLOR;
		g.font = UI.HAND.SPEED_FONT;
		text_x = 8;
		text_y = 12;
		g.fillText(num_format(c.speed, 2), text_x, text_y);
		// cost
		g.fillStyle = (c.cost > field.mp ? UI.HAND.UNUSABLE_COLOR : UI.HAND.USABLE_COLOR);
		g.font = UI.HAND.COST_FONT;
		text_x = 4;
		text_y = 32;
		g.fillText(num_format(c.cost, 2), text_x, text_y);
		// name
		g.fillStyle = UI.HAND.TEXT_COLOR;
		g.font = UI.HAND.TITLE_FONT;
		text_x = 36;
		text_y = UI.HAND.HEIGHT/2;
		g.fillText(c.name, text_x, text_y);
		// desc
		if (current)
		{
			var temp_a = g.globalAlpha;
			g.globalAlpha *= desc_a;
			// desc back
			text_x = 0;
			text_y = UI.HAND.HEIGHT;
			var h = UI.HAND.MAIN_HEIGHT-UI.HAND.HEIGHT;
			style = g.createLinearGradient(0, text_y, 0, text_y+h);
			style.addColorStop(0, COLOR.DARK_RED);
			style.addColorStop(1, COLOR.DARK_RED2);
			//style.addColorStop(1, COLOR.BLACK);
			g.fillStyle = style;
			g.fillRect(text_x-w, text_y, UI.HAND.WIDTH+w, desc_h);
			g.lineWidth = w;
			g.strokeRect(text_x-w, text_y, UI.HAND.WIDTH+w, desc_h);
			// desc
			g.fillStyle = UI.HAND.TEXT_COLOR;
			g.font = UI.HAND.TEXT_FONT;
			text_x = 8;
			text_y = UI.HAND.HEIGHT + 8;
			g.textBaseline = "top";
			g.fillText(c.desc, text_x, text_y);
			g.globalAlpha = temp_a;
		}
	}
	else
	{
	}
	g.globalAlpha = now_a;
	g.scale(1/scale, 1/scale);
	g.translate(-x, -y);
}

Card.is_usable = function (id, field)
{
	return field.mp >= CARD[id].cost;
}

Card.cost_mp = function (id, field)
{
	field.mp -= CARD[id].cost;
}

Card.recover_cost_mp = function (id, field)
{
	field.mp += CARD[id].cost;
}
