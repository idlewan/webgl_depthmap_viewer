uniform sampler2D colorTexture;
uniform sampler2D depthTexture;
uniform bool showDepthMap;

varying vec2 vUv;

void main()
{
    gl_FragColor = texture2D(colorTexture, vUv);
    if (showDepthMap) {
        gl_FragColor = texture2D(depthTexture, vUv);
    }
}
