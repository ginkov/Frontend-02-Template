// khronos -- webgl
// ecma
// WHATWG - HTML
// W3C

let names = Object.getOwnPropertyNames(window);

/**
 *
 * @param {string[]} names
 * @param {string[]} props
 */
function filterOut(names, props) {
    props = props.reduce(
        (previous, current) => {
            previous.add(current.toLowerCase());
            return previous;
        }, new Set()
    );
    return names.filter(e => !props.has(e.toLowerCase()));
}

// ecma 262 // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects
{
    var ecma262Objects = ['AggregateError', 'Array', 'ArrayBuffer', 'AsyncFunction', 'Atomics', 'BigInt', 'BigInt64Array', 'BigUint64Array', 'Boolean', 'DataView', 'Date', 'Error', 'EvalError', 'FinalizationRegistry', 'Float32Array', 'Float64Array', 'Function', 'Generator', 'GeneratorFunction', 'Infinity', 'Int16Array', 'Int32Array', 'Int8Array', 'InternalError', 'Intl', 'JSON', 'Map', 'Math', 'NaN', 'Number', 'Object', 'Promise', 'Proxy', 'RangeError', 'ReferenceError', 'Reflect', 'RegExp', 'Set', 'SharedArrayBuffer', 'String', 'Symbol', 'SyntaxError', 'TypeError', 'TypedArray', 'URIError', 'Uint16Array', 'Uint32Array', 'Uint8Array', 'Uint8ClampedArray', 'WeakMap', 'WeakRef', 'WeakSet', 'WebAssembly', 'decodeURI', 'decodeURIComponent', 'encodeURI', 'encodeURIComponent', 'escape', 'eval', 'globalThis', 'isFinite', 'isNaN', 'null', 'parseFloat', 'parseInt', 'undefined', 'unescape', 'uneval'];
    names = filterOut(names, ecma262Objects)
}

// https://spec.whatwg.org/
{
    {
        // https://console.spec.whatwg.org/
        //https://developer.mozilla.org/en-US/docs/Web/API/console
        let console = ['console'];
        names = filterOut(names, console)
    }
    {
        // https://streams.spec.whatwg.org/
        // https://developer.mozilla.org/en-US/docs/Web/API/Streams_API
        let streams = ['ByteLengthQueuingStrategy', 'CountQueuingStrategy', 'ReadableByteStreamController', 'ReadableStream', 'ReadableStreamBYOBReader', 'ReadableStreamBYOBRequest', 'ReadableStreamDefaultController', 'ReadableStreamDefaultReader', 'WritableStream', 'WritableStreamDefaultController', 'WritableStreamDefaultWriter'];
        names = filterOut(names, streams)
    }
    //https://developer.mozilla.org/en-US/docs/Web/API/Encoding_API
    //https://encoding.spec.whatwg.org/
    {
        let encoding = ['TextDecoder', 'TextEncoder', 'TextDecoderStream', 'TextEncoderStream'];
        names = filterOut(names, encoding)
    }
    //https://fetch.spec.whatwg.org/
    {
        let fetch = ['fetch']
        names = filterOut(names, fetch)

    }
    {
        //https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
        let xmlHttpRequest = ['FormData', 'XMLHttpRequest', 'XMLHttpRequestEventTarget', 'XMLHttpRequestUpload']
        names = filterOut(names, xmlHttpRequest)
    }
    {
        //https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API
        // let fullscreen
    }
    {
        //https://notifications.spec.whatwg.org/
        let notifications = ['Notification', 'NotificationEvent'];
        names = filterOut(names, notifications)
    }
    {
        //https://developer.mozilla.org/en-US/docs/Web/API/Storage_API
        let storages = ['StorageManager', 'NavigatorStorage', 'StorageEstimate']
        names = filterOut(names, storages)
        {
            let idb = ['IDBCursor', 'IDBCursorSync', 'IDBCursorWithValue', 'IDBDatabase', 'IDBDatabaseException', 'IDBDatabaseSync', 'IDBEnvironment', 'IDBEnvironmentSync', 'IDBFactory', 'IDBFactorySync', 'IDBIndex', 'IDBIndexSync', 'IDBKeyRange', 'IDBObjectStore', 'IDBObjectStoreSync', 'IDBOpenDBRequest', 'IDBRequest', 'IDBTransaction', 'IDBTransactionSync', 'IDBVersionChangeEvent', 'IDBVersionChangeRequest'];
            names = filterOut(names, idb)
        }

    }
    {
        // https://developer.mozilla.org/en-US/docs/Web/API/URL_API
        let urls = ['URL', 'URLSearchParams', 'HTMLHyperlinkElementUtils', 'URLUtilsReadOnly']
        names = filterOut(names, urls)
    }

    {
        // https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model
        let domObjects = ['AbortController', 'AbortSignal', 'AbstractRange', 'Attr', 'ByteString', 'CDATASection', 'CharacterData', 'ChildNode', 'CSSPrimitiveValue', 'CSSValue', 'CSSValueList', 'Comment', 'CustomEvent', 'Document', 'DocumentFragment', 'DocumentType', 'DOMConfiguration', 'DOMError', 'DOMErrorHandler', 'DOMException', 'DOMImplementation', 'DOMImplementationList', 'DOMImplementationRegistry', 'DOMImplementationSource', 'DOMLocator', 'DOMObject', 'DOMParser', 'DOMPoint', 'DOMPointInit', 'DOMPointReadOnly', 'DOMRect', 'DOMString', 'DOMTimeStamp', 'DOMTokenList', 'DOMUserData', 'Element', 'ElementTraversal', 'Entity', 'EntityReference', 'Event', 'EventTarget', 'HTMLCollection', 'MutationObserver', 'Node', 'NodeFilter', 'NodeIterator', 'NodeList', 'NonDocumentTypeChildNode', 'ProcessingInstruction', 'PromiseResolver', 'Range', 'StaticRange', 'Text', 'TimeRanges', 'TreeWalker', 'TypeInfo', 'UserDataHandler', 'USVString', 'XMLDocument'];
        names = filterOut(names, domObjects)
    }
    {
        // https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API
        let htmlDOM = ['BeforeUnloadEvent', 'DOMStringMap', 'ErrorEvent', 'GlobalEventHandlers', 'HashChangeEvent', 'ImageData', 'HTMLAnchorElement', 'HTMLAreaElement', 'HTMLAudioElement', 'HTMLBaseElement', 'HTMLBaseFontElement', 'HTMLBodyElement', 'HTMLBRElement', 'HTMLButtonElement', 'HTMLCanvasElement', 'HTMLContentElement', 'HTMLDataElement', 'HTMLDataListElement', 'HTMLDialogElement', 'HTMLDivElement', 'HTMLDListElement', 'HTMLDocument', 'HTMLElement', 'HTMLEmbedElement', 'HTMLFieldSetElement', 'HTMLFormControlsCollection', 'HTMLFormElement', 'HTMLFrameSetElement', 'HTMLHeadElement', 'HTMLHeadingElement', 'HTMLHRElement', 'HTMLHtmlElement', 'HTMLIFrameElement', 'HTMLImageElement', 'HTMLInputElement', 'HTMLIsIndexElement', 'HTMLKeygenElement', 'HTMLLabelElement', 'HTMLLegendElement', 'HTMLLIElement', 'HTMLLinkElement', 'HTMLMapElement', 'HTMLMediaElement', 'HTMLMetaElement', 'HTMLMeterElement', 'HTMLModElement', 'HTMLObjectElement', 'HTMLOListElement', 'HTMLOptGroupElement', 'HTMLOptionElement', 'HTMLOptionsCollection', 'HTMLOutputElement', 'HTMLParagraphElement', 'HTMLParamElement', 'HTMLPictureElement', 'HTMLPreElement', 'HTMLProgressElement', 'HTMLQuoteElement', 'HTMLScriptElement', 'HTMLSelectElement', 'HTMLShadowElement', 'HTMLSourceElement', 'HTMLSpanElement', 'HTMLStyleElement', 'HTMLTableCaptionElement', 'HTMLTableCellElement', 'HTMLTableColElement', 'HTMLTableDataCellElement', 'HTMLTableElement', 'HTMLTableHeaderCellElement', 'HTMLTableRowElement', 'HTMLTableSectionElement', 'HTMLTextAreaElement', 'HTMLTemplateElement', 'HTMLTimeElement', 'HTMLTitleElement', 'HTMLTrackElement', 'HTMLUListElement', 'HTMLUnknownElement', 'HTMLVideoElement', 'History', 'Location', 'MessageChannel', 'MessageEvent', 'MessagePort', 'Navigator', 'NavigatorGeolocation', 'NavigatorID', 'NavigatorLanguage', 'NavigatorOnLine', 'NavigatorPlugins', 'PageTransitionEvent', 'Plugin', 'PluginArray', 'PopStateEvent', 'PortCollection', 'PromiseRejectionEvent', 'RadioNodeList', 'Transferable', 'ValidityState', 'Window', 'WindowBase64', 'WindowEventHandlers', 'WindowTimers'];
        names = filterOut(names, htmlDOM)
        let integration = ['BarProp', 'Navigator', 'Window', 'External', 'ApplicationCache', 'Plugin', 'PluginArray'];
        names = filterOut(names, integration)
        let form = ['FormDataEvent', 'HTMLFormControlsCollection', 'HTMLOptionsCollection', 'RadioNodeList', 'ValidityState']
        names = filterOut(names, form)
        let image = ['CanvasGradient', 'CanvasPattern', 'CanvasRenderingContext2D', 'ImageBitmap', 'ImageBitmapRenderingContext', 'ImageData', 'OffscreenCanvas', 'OffscreenCanvasRenderingContext2D', 'Path2D', 'TextMetrics']
        names = filterOut(names, image)
        let drag = ['DataTransfer', 'DataTransferItem', 'DataTransferItemList', 'DragEvent']
        names = filterOut(names, drag)
        let webComponents = ['CustomElementRegistry'];
        names = filterOut(names, webComponents)
        let miscellaneous = ['DOMStringList', 'DOMStringMap', 'ErrorEvent', 'HTMLAllCollection', 'MimeType', 'MimeTypeArray', 'PromiseRejectionEvent']
        names = filterOut(names, miscellaneous)
        // https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API
        let storage = ['Storage', 'StorageEvent', 'sessionStorage', 'localStorage']
        names = filterOut(names, storage)
        let webWorkers = ['BroadcastChannel', 'DedicatedWorkerGlobalScope', 'MessageChannel', 'MessageEvent', 'MessagePort', 'SharedWorker', 'SharedWorkerGlobalScope', 'Worker', 'WorkerGlobalScope', 'WorkerLocation', 'WorkerNavigator']
        names = filterOut(names, webWorkers)
        let webSocket = ['CloseEvent', 'WebSocket']
        let eventSource = ['EventSource']
        names = filterOut(names, [...webSocket, ...eventSource])
    }

    //https://developer.mozilla.org/en-US/docs/Web/API/TimeEvent
    //https://svgwg.org/svg2-draft/linking.html
    let svgObject = ['SVGAltGlyphElement', 'SVGAngle', 'SVGAnimateColorElement', 'SVGAnimateElement', 'SVGAnimateMotionElement', 'SVGAnimateTransformElement', 'SVGAnimatedAngle', 'SVGAnimatedBoolean', 'SVGAnimatedEnumeration', 'SVGAnimatedInteger', 'SVGAnimatedLength', 'SVGAnimatedLengthList', 'SVGAnimatedNumber', 'SVGAnimatedNumberList', 'SVGAnimatedPathData', 'SVGAnimatedPoints', 'SVGAnimatedPreserveAspectRatio', 'SVGAnimatedRect', 'SVGAnimatedString', 'SVGAnimatedTransformList', 'SVGAnimationElement', 'SVGCircleElement', 'SVGClipPathElement', 'SVGComponentTransferFunctionElement', 'SVGCursorElement', 'SVGDefsElement', 'SVGDescElement', 'SVGDocument', 'SVGElement', 'SVGEllipseElement', 'SVGFEBlendElement', 'SVGFEColorMatrixElement', 'SVGFEComponentTransferElement', 'SVGFECompositeElement', 'SVGFEConvolveMatrixElement', 'SVGFEDiffuseLightingElement', 'SVGFEDisplacementMapElement', 'SVGFEDistantLightElement', 'SVGFEDropShadowElement', 'SVGFEFloodElement', 'SVGFEFuncAElement', 'SVGFEFuncBElement', 'SVGFEFuncGElement', 'SVGFEFuncRElement', 'SVGFEGaussianBlurElement', 'SVGFEImageElement', 'SVGFEMergeElement', 'SVGFEMergeNodeElement', 'SVGFEMorphologyElement', 'SVGFEOffsetElement', 'SVGFEPointLightElement', 'SVGFESpecularLightingElement', 'SVGFESpotLightElement', 'SVGFETileElement', 'SVGFETurbulenceElement', 'SVGFilterElement', 'SVGFilterPrimitiveStandardAttributes', 'SVGFitToViewBox', 'SVGFontElement', 'SVGFontFaceElement', 'SVGFontFaceFormatElement', 'SVGFontFaceNameElement', 'SVGFontFaceSrcElement', 'SVGFontFaceUriElement', 'SVGForeignObjectElement', 'SVGGElement', 'SVGGlyphElement', 'SVGGradientElement', 'SVGGraphicsElement', 'SVGHKernElement', 'SVGImageElement', 'SVGLength', 'SVGLengthList', 'SVGLineElement', 'SVGLinearGradientElement', 'SVGMPathElement', 'SVGMarkerElement', 'SVGMaskElement', 'SVGMatrix', 'SVGMetadataElement', 'SVGMissingGlyphElement', 'SVGNumber', 'SVGNumberList', 'SVGPathElement', 'SVGPathSeg', 'SVGPathSegArcAbs', 'SVGPathSegArcRel', 'SVGPathSegClosePath', 'SVGPathSegCurvetoCubicAbs', 'SVGPathSegCurvetoCubicRel', 'SVGPathSegCurvetoCubicSmoothAbs', 'SVGPathSegCurvetoCubicSmoothRel', 'SVGPathSegCurvetoQuadraticAbs', 'SVGPathSegCurvetoQuadraticRel', 'SVGPathSegCurvetoQuadraticSmoothAbs', 'SVGPathSegCurvetoQuadraticSmoothRel', 'SVGPathSegLinetoAbs', 'SVGPathSegLinetoHorizontalAbs', 'SVGPathSegLinetoHorizontalRel', 'SVGPathSegLinetoRel', 'SVGPathSegLinetoVerticalAbs', 'SVGPathSegLinetoVerticalRel', 'SVGPathSegList', 'SVGPathSegMovetoAbs', 'SVGPathSegMovetoRel', 'SVGPatternElement', 'SVGPoint', 'SVGPointList', 'SVGPolygonElement', 'SVGPolylineElement', 'SVGPreserveAspectRatio', 'SVGRadialGradientElement', 'SVGRect', 'SVGRectElement', 'SVGSVGElement', 'SVGScriptElement', 'SVGSetElement', 'SVGStopElement', 'SVGStringList', 'SVGStylable', 'SVGStyleElement', 'SVGSwitchElement', 'SVGSymbolElement', 'SVGTRefElement', 'SVGTSpanElement', 'SVGTests', 'SVGTextContentElement', 'SVGTextElement', 'SVGTextPathElement', 'SVGTextPositioningElement', 'SVGTitleElement', 'SVGTransform', 'SVGTransformList', 'SVGTransformable', 'SVGURIReference', 'SVGUnitTypes', 'SVGUseElement', 'SVGVKernElement', 'SVGViewElement', 'SVGZoomAndPan', 'SVGZoomEvent', 'TimeEvent'];
    names = filterOut(names, svgObject)
}

//w3c
{
    // webAudio
    // https://webaudio.github.io/web-audio-api/
    {
        let webAudio = ['AnalyserNode', 'AudioBuffer', 'AudioBufferSourceNode', 'AudioContext', 'AudioContextOptions', 'AudioDestinationNode', 'AudioListener', 'AudioNode', 'AudioNodeOptions', 'AudioParam', 'AudioProcessingEvent', 'AudioScheduledSourceNode', 'AudioWorklet', 'AudioWorkletGlobalScope', 'AudioWorkletNode', 'AudioWorkletProcessor', 'BaseAudioContext', 'BiquadFilterNode', 'ChannelMergerNode', 'ChannelSplitterNode', 'ConstantSourceNode', 'ConvolverNode', 'DelayNode', 'DynamicsCompressorNode', 'GainNode', 'IIRFilterNode', 'MediaElementAudioSourceNode', 'MediaStreamAudioDestinationNode', 'MediaStreamAudioSourceNode', 'OfflineAudioCompletionEvent', 'OfflineAudioContext', 'OscillatorNode', 'PannerNode', 'PeriodicWave', 'WaveShaperNode', 'StereoPannerNode']
        names = filterOut(names, webAudio)
    }

    //https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API
    {
        let webRTC = ['RTCPeerConnection', 'RTCSessionDescription', 'RTCIceCandidate', 'RTCPeerConnectionIceEvent', 'RTCPeerConnectionIceErrorEvent', 'RTCCertificate', 'RTCRtpSender', 'RTCRtpReceiver', 'RTCRtpTransceiver', 'RTCDtlsTransport', 'RTCIceTransport', 'RTCTrackEvent', 'RTCSctpTransport', 'RTCDataChannel', 'RTCDataChannelEvent', 'RTCDTMFSender', 'RTCDTMFToneChangeEvent', 'RTCStatsReport', 'RTCErrorEvent'];
        names = filterOut(names, webRTC)

    }

    //https://w3c.github.io/ServiceWorker/
    {
        let serviceWorker = ['Cache', 'CacheStorage', 'Client', 'Clients', 'ExtendableEvent', 'FetchEvent', 'InstallEvent', 'Navigator.serviceWorker', 'NotificationEvent', 'PeriodicSyncEvent', 'PeriodicSyncManager', 'PeriodicSyncRegistration', 'ServiceWorker', 'ServiceWorkerContainer', 'ServiceWorkerGlobalScope', 'ServiceWorkerRegistration', 'SyncEvent', 'SyncManager', 'SyncRegistration', 'WindowClient'];
        names = filterOut(names, serviceWorker)
    }
    {
        // https://w3c.github.io/mediacapture-main/
        let media = ['AudioStreamTrack', 'BlobEvent', 'CanvasCaptureMediaStream', 'MediaDevices', 'MediaStream', 'MediaStreamTrack', 'MediaStreamTrackEvent', 'MediaTrackCapabilities', 'MediaTrackConstraints', 'MediaTrackSettings', 'MediaTrackSupportedConstraints', 'NavigatorUserMedia', 'NavigatorUserMediaError', 'VideoStreamTrack', 'DoubleRange', 'ConstrainDouble', 'LongRange', 'ConstrainLong', 'ConstrainBoolean', 'ConstrainDOMString']
        names = filterOut(names, media)
        //
        let outOfDate = ['MediaStreamEvent']
        //https://w3c.github.io/mediacapture-image/
        let mediacaptureImage = ['MediaSettingsRange', 'ImageCapture', 'PhotoCapabilities']
        names = filterOut(names, [...outOfDate, ...mediacaptureImage])
    }
}

// khronos
{
    // webgl
    // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API
    {

        let webglInterface = ['WebGLRenderingContext', 'WebGL2RenderingContext', 'WebGLActiveInfo', 'WebGLBuffer', 'WebGLContextEvent', 'WebGLFramebuffer', 'WebGLProgram', 'WebGLQuery', 'WebGLRenderbuffer', 'WebGLSampler', 'WebGLShader', 'WebGLShaderPrecisionFormat', 'WebGLSync', 'WebGLTexture', 'WebGLTransformFeedback', 'WebGLUniformLocation', 'WebGLVertexArrayObject'];
        names = filterOut(names, webglInterface)

    }
}

// subclass of Node DOM API// https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model
{
    names = names.filter(e => e != 'Node').filter(
        e => {
            try {
                return !(window[e].prototype instanceof Node)
            } catch (error) {
                return true;
            }
        }
    )
}

{
    //events

    names = names.filter(e => !e.startsWith('on'))

    //webkit

    names = names.filter(e => !e.startsWith('webkit'))

}

console.log(names)
