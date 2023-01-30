import React, { useState }  from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import c from 'classnames'

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Stats, Environment, } from '@react-three/drei';
import { useControls } from 'leva';

import { DisplacedImage } from './displaced_image';


type ErrorInfo = { error: Error, info: {componentStack: string} };
function ShowError(props: ErrorInfo) {
    return <p className="error">
        {'' + props.error}
        <br />
        {props.info.componentStack}
    </p>;
}

export default function App(props: { pregenerated: string[] }) {
    const [error, setError] = useState({} as ErrorInfo);
    if (error.error) {
        return <ShowError error={error.error} info={error.info}/>;
    }

    const [selected, setSelected] = useState({
        index: 0,
        filename: props.pregenerated[0],
    });

    const controlData = useControls({
        autoRotate: true,
    });

    return <>

    <div className="column">
        <div className="column-inner">
        {props.pregenerated.map((filename, index) =>
            <div key={index}
            className={c('thumbnail', { selected: selected.index == index })}
            style={{
                backgroundImage: `url("color/${filename}.png")`,
            }}
                onClick={() => {
                    setSelected({ index, filename });
                }}
            />
        )}
        </div>
    </div>

    <Canvas camera={{ position: [-5, 0, 4] }} dpr={1}>
        <ErrorBoundary
            fallbackRender={() => <></>}
            onError={(error, info) => setError({error, info})}
        >

            <DisplacedImage link={selected.filename} />

            {/* // useful objects to debug if unsure how camera/things are moving/updating
                // notably autoRotate

            <axesHelper />
            <Grid renderOrder={-1} infiniteGrid
                position={[0, -1.85, 0]}
                cellSize={0.5} sectionSize={2.5}
                sectionColor={0xffffff}
                cellThickness={0.5} sectionThickness={1.5}
                fadeDistance={30} />
            */}

            <Environment preset="sunset" background blur={0.65} />

            <OrbitControls makeDefault
                autoRotate={controlData.autoRotate}
                autoRotateSpeed={0.75} enableZoom={true}
            />
            <Stats className="stats"/>

        </ErrorBoundary>
    </Canvas>
    </>;
}
