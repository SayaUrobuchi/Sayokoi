
var PI2 = Math.PI * 2;

function DO_NOTHING()
{
}

function ALWAYS_RETURN(val)
{
	return function ()
	{
		return val;
	}
}

function is_ndef(v)
{
	return v === undefined;
}

function is_def(v)
{
	return !is_ndef(v);
}

function extend(p, q)
{
	var ret = {};
	for (var k in p)
	{
		ret[k] = p[k];
	}
	for (var k in q)
	{
		ret[k] = q[k];
	}
	return ret;
}

function rgba(r, g, b, a)
{
	return "rgba("+[r, g, b, a].join(",")+")";
}

function rgb(r, g, b)
{
	return rgba(r, g, b, 1.0);
}

function deg(ang)
{
	return ang*Math.PI/180;
}

function dice(x, y, z)
{
	var res = 0;
	while (x-- > 0)
	{
		res += Math.floor(Math.random()*y) + 1;
	}
	if (is_ndef(z))
	{
		return res;
	}
	return res+z;
}

function random(p, q)
{
	if (is_ndef(q))
	{
		return Math.floor(Math.random()*p);
	}
	return Math.floor(Math.random()*(q-p))+p;
}

function frandom(p, q)
{
	if (is_ndef(q))
	{
		return Math.random()*p;
	}
	return Math.random()*(q-p)+p;
}

function num_format(n, width, z)
{
	z = z || '0';
	n = n + '';
	return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function linear_f(st, ed, now)
{
	return st + (ed-st)*now;
}

function sqrt_f(st, ed, now)
{
	return st + (ed-st)*Math.sqrt(now);
}

function pow2_f(st, ed, now)
{
	return st + (ed-st)*(now*now);
}

function sin_f(st, ed, now)
{
	return st + (ed-st)*Math.sin(now*deg(90));
}

function cos_f(st, ed, now)
{
	return st + (ed-st)*(1-Math.cos(now*deg(90)));
}

function lerp(x, y, val)
{
	return x + (y-x) * val;
}

function is_collide(p, q)
{
	var dx = p.x - q.x;
	var dy = p.y - q.y;
	var r = p.r + q.r;
	return (dx*dx) + (dy*dy) < r*r;
}

