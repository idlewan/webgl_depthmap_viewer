uniform sampler2D depthTexture;
uniform float displacementAmount;
uniform int depthFunction;

varying vec2 vUv;

void main()	{
    vUv = uv;

    vec4 depthVec = texture2D(depthTexture, uv);
    float depth = max(max(depthVec.r, depthVec.g), depthVec.b);

    if (depthFunction == 1) {
        depth = exp(depth);
    }
    if (depthFunction == 2) {
        depth = exp2(depth);
    }
    if (depthFunction == 3) {
        depth = log(max(0.0000001, depth));
    }
    if (depthFunction == 4) {
        depth = log(max(0.0000001, depth))/2. + exp(depth);
    }


    gl_Position = projectionMatrix * modelViewMatrix * vec4(
        position.xy,
        position.z + depth*displacementAmount,
        1.0 );
}
