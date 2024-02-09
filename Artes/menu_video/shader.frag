precision mediump float;

uniform sampler2D uMainSampler;
varying vec2 outTexCoord;

void main(void) {
    // Get the current pixel color
    vec4 color = texture2D(uMainSampler, outTexCoord);

    // Reduce the brightness by multiplying the color by a factor
    float brightnessFactor = 0.5; // Adjust this value to change brightness
    gl_FragColor = color * brightnessFactor;
}