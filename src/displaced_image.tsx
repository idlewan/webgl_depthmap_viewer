import React, { useRef } from 'react';

import {
    Mesh, Vector2, Vector3, Matrix4,
    ShaderMaterial, ShaderMaterialParameters, DoubleSide,
} from 'three';
import { useThree, ThreeElements } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { useControls } from 'leva';

import vertexShader from './displaced_image.vert';
import fragmentShader from './displaced_image.frag';

export function DisplacedImage(
    props: ThreeElements['mesh'] & { link: string }
) {
    const mesh = useRef<Mesh>(null);
    const materialRef = useRef<ShaderMaterial>(null);

    const link = encodeURIComponent(props.link);
    const uniformRef = useRef<ShaderMaterialParameters>({
        uniforms: {
            colorTexture: { value: useTexture(
                `color/${link}.png`,
                (colorTexture) => {
                    const uniforms = uniformRef.current!.uniforms!;
                    uniforms.colorTexture.value = colorTexture;
                }
            ) },
            depthTexture: { value: useTexture(
                `depth/${link}-dpt_beit_large_512.png`,
                (depthTexture) => {
                    const uniforms = uniformRef.current!.uniforms!;
                    uniforms.depthTexture.value = depthTexture;
                }
            ) },
            displacementAmount: { value: 60 },
            showDepthMap: { value: false },
            depthFunction: { value: 0 },
        }
    });
    const depthOptions = ["linear", "exp", "exp2", "log", "log + exp"];
    useControls({
        displacementAmount: {
            value: 60, min: 0, max: 512, step: 1,
            label: "amount displacement",
            onChange: (value) => {
                const uniforms = uniformRef.current!.uniforms!;
                uniforms.displacementAmount.value = value;
            },
        },
        showDepthMap: {
            value: false,
            label: "Show depth",
            onChange: (value) => {
                const uniforms = uniformRef.current!.uniforms!;
                uniforms.showDepthMap.value = value;
            }
        },
        depthFunction: {
            value: "log + exp",
            label: "depth",
            options: depthOptions,
            onChange: (value, second, third) => {
                const depthFunction = depthOptions.indexOf(value);
                const uniforms = uniformRef.current!.uniforms!;
                uniforms.depthFunction.value = depthFunction;
            },
        },
    });

    return <mesh ref={mesh} scale={0.01} {...props}>
        <planeGeometry args={[512, 512, 512, 512]} />
        <shaderMaterial ref={materialRef}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniforms={uniformRef.current.uniforms}
            side={DoubleSide}
        />
    </mesh>;
}
