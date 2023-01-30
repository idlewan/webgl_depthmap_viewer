import React, { useState }  from 'react';
import { createRoot } from 'react-dom/client';

import App from './app';


// check webgl support. If not supported, show error message, otherwise init
try {
    let canvas = document.createElement('canvas')
    let webgl_support = !! window.WebGLRenderingContext && (
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl'))
    if (!webgl_support) {
        throw "NO_WEBGL";
    }
    init();
} catch (e) {
    if (e == "NO_WEBGL") {
        document.getElementById("no-webgl")!.classList.remove("hidden");
    } else {
        document.getElementById("generic-error")!.classList.remove("hidden");
    }
    throw e;
}

async function init() {
    const response = await fetch("color/list.txt");
    const pregenerated_list = (await response.text()).trim().split('\n')
        .map(line => line.substring(0, line.length - 4)); // remove file extension

    createRoot(document.getElementById('root')!).render(
        <App pregenerated={pregenerated_list}/>
    );
}
