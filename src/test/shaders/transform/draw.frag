precision highp float;

void main(void) {
	if(distance(gl_PointCoord, vec2(.5)) > .5) discard;
    gl_FragColor = vec4(1.0);
}