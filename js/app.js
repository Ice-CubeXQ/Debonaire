(() => {
    "use strict";
    const modules_flsModules = {};
    function addLoadedClass() {
        if (!document.documentElement.classList.contains("loading")) window.addEventListener("load", (function() {
            setTimeout((function() {
                document.documentElement.classList.add("loaded");
            }), 0);
        }));
    }
    let bodyLockStatus = true;
    let bodyLockToggle = (delay = 500) => {
        if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
    };
    let bodyUnlock = (delay = 500) => {
        if (bodyLockStatus) {
            const lockPaddingElements = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                lockPaddingElements.forEach((lockPaddingElement => {
                    lockPaddingElement.style.paddingRight = "";
                }));
                document.body.style.paddingRight = "";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        if (bodyLockStatus) {
            const lockPaddingElements = document.querySelectorAll("[data-lp]");
            const lockPaddingValue = window.innerWidth - document.body.offsetWidth + "px";
            lockPaddingElements.forEach((lockPaddingElement => {
                lockPaddingElement.style.paddingRight = lockPaddingValue;
            }));
            document.body.style.paddingRight = lockPaddingValue;
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function menuInit() {
        if (document.querySelector(".icon-menu")) document.addEventListener("click", (function(e) {
            if (bodyLockStatus && e.target.closest(".icon-menu")) {
                bodyLockToggle();
                document.documentElement.classList.toggle("menu-open");
            }
        }));
    }
    function functions_FLS(message) {
        setTimeout((() => {
            if (window.FLS) console.log(message);
        }), 0);
    }
    function uniqArray(array) {
        return array.filter((function(item, index, self) {
            return self.indexOf(item) === index;
        }));
    }
    class ScrollWatcher {
        constructor(props) {
            let defaultConfig = {
                logging: true
            };
            this.config = Object.assign(defaultConfig, props);
            this.observer;
            !document.documentElement.classList.contains("watcher") ? this.scrollWatcherRun() : null;
        }
        scrollWatcherUpdate() {
            this.scrollWatcherRun();
        }
        scrollWatcherRun() {
            document.documentElement.classList.add("watcher");
            this.scrollWatcherConstructor(document.querySelectorAll("[data-watch]"));
        }
        scrollWatcherConstructor(items) {
            if (items.length) {
                this.scrollWatcherLogging(`Проснулся, слежу за объектами (${items.length})...`);
                let uniqParams = uniqArray(Array.from(items).map((function(item) {
                    if (item.dataset.watch === "navigator" && !item.dataset.watchThreshold) {
                        let valueOfThreshold;
                        if (item.clientHeight > 2) {
                            valueOfThreshold = window.innerHeight / 2 / (item.clientHeight - 1);
                            if (valueOfThreshold > 1) valueOfThreshold = 1;
                        } else valueOfThreshold = 1;
                        item.setAttribute("data-watch-threshold", valueOfThreshold.toFixed(2));
                    }
                    return `${item.dataset.watchRoot ? item.dataset.watchRoot : null}|${item.dataset.watchMargin ? item.dataset.watchMargin : "0px"}|${item.dataset.watchThreshold ? item.dataset.watchThreshold : 0}`;
                })));
                uniqParams.forEach((uniqParam => {
                    let uniqParamArray = uniqParam.split("|");
                    let paramsWatch = {
                        root: uniqParamArray[0],
                        margin: uniqParamArray[1],
                        threshold: uniqParamArray[2]
                    };
                    let groupItems = Array.from(items).filter((function(item) {
                        let watchRoot = item.dataset.watchRoot ? item.dataset.watchRoot : null;
                        let watchMargin = item.dataset.watchMargin ? item.dataset.watchMargin : "0px";
                        let watchThreshold = item.dataset.watchThreshold ? item.dataset.watchThreshold : 0;
                        if (String(watchRoot) === paramsWatch.root && String(watchMargin) === paramsWatch.margin && String(watchThreshold) === paramsWatch.threshold) return item;
                    }));
                    let configWatcher = this.getScrollWatcherConfig(paramsWatch);
                    this.scrollWatcherInit(groupItems, configWatcher);
                }));
            } else this.scrollWatcherLogging("Сплю, нет объектов для слежки. ZzzZZzz");
        }
        getScrollWatcherConfig(paramsWatch) {
            let configWatcher = {};
            if (document.querySelector(paramsWatch.root)) configWatcher.root = document.querySelector(paramsWatch.root); else if (paramsWatch.root !== "null") this.scrollWatcherLogging(`Эмм... родительского объекта ${paramsWatch.root} нет на странице`);
            configWatcher.rootMargin = paramsWatch.margin;
            if (paramsWatch.margin.indexOf("px") < 0 && paramsWatch.margin.indexOf("%") < 0) {
                this.scrollWatcherLogging(`йой, настройку data-watch-margin нужно задавать в PX или %`);
                return;
            }
            if (paramsWatch.threshold === "prx") {
                paramsWatch.threshold = [];
                for (let i = 0; i <= 1; i += .005) paramsWatch.threshold.push(i);
            } else paramsWatch.threshold = paramsWatch.threshold.split(",");
            configWatcher.threshold = paramsWatch.threshold;
            return configWatcher;
        }
        scrollWatcherCreate(configWatcher) {
            console.log(configWatcher);
            this.observer = new IntersectionObserver(((entries, observer) => {
                entries.forEach((entry => {
                    this.scrollWatcherCallback(entry, observer);
                }));
            }), configWatcher);
        }
        scrollWatcherInit(items, configWatcher) {
            this.scrollWatcherCreate(configWatcher);
            items.forEach((item => this.observer.observe(item)));
        }
        scrollWatcherIntersecting(entry, targetElement) {
            if (entry.isIntersecting) {
                !targetElement.classList.contains("_watcher-view") ? targetElement.classList.add("_watcher-view") : null;
                this.scrollWatcherLogging(`Я вижу ${targetElement.classList}, добавил класс _watcher-view`);
            } else {
                targetElement.classList.contains("_watcher-view") ? targetElement.classList.remove("_watcher-view") : null;
                this.scrollWatcherLogging(`Я не вижу ${targetElement.classList}, убрал класс _watcher-view`);
            }
        }
        scrollWatcherOff(targetElement, observer) {
            observer.unobserve(targetElement);
            this.scrollWatcherLogging(`Я перестал следить за ${targetElement.classList}`);
        }
        scrollWatcherLogging(message) {
            this.config.logging ? functions_FLS(`[Наблюдатель]: ${message}`) : null;
        }
        scrollWatcherCallback(entry, observer) {
            const targetElement = entry.target;
            this.scrollWatcherIntersecting(entry, targetElement);
            targetElement.hasAttribute("data-watch-once") && entry.isIntersecting ? this.scrollWatcherOff(targetElement, observer) : null;
            document.dispatchEvent(new CustomEvent("watcherCallback", {
                detail: {
                    entry
                }
            }));
        }
    }
    modules_flsModules.watcher = new ScrollWatcher({});
    class Parallax {
        constructor(elements) {
            if (elements.length) this.elements = Array.from(elements).map((el => new Parallax.Each(el, this.options)));
        }
        destroyEvents() {
            this.elements.forEach((el => {
                el.destroyEvents();
            }));
        }
        setEvents() {
            this.elements.forEach((el => {
                el.setEvents();
            }));
        }
    }
    Parallax.Each = class {
        constructor(parent) {
            this.parent = parent;
            this.elements = this.parent.querySelectorAll("[data-prlx]");
            this.animation = this.animationFrame.bind(this);
            this.offset = 0;
            this.value = 0;
            this.smooth = parent.dataset.prlxSmooth ? Number(parent.dataset.prlxSmooth) : 15;
            this.setEvents();
        }
        setEvents() {
            this.animationID = window.requestAnimationFrame(this.animation);
        }
        destroyEvents() {
            window.cancelAnimationFrame(this.animationID);
        }
        animationFrame() {
            const topToWindow = this.parent.getBoundingClientRect().top;
            const heightParent = this.parent.offsetHeight;
            const heightWindow = window.innerHeight;
            const positionParent = {
                top: topToWindow - heightWindow,
                bottom: topToWindow + heightParent
            };
            const centerPoint = this.parent.dataset.prlxCenter ? this.parent.dataset.prlxCenter : "center";
            if (positionParent.top < 30 && positionParent.bottom > -30) switch (centerPoint) {
              case "top":
                this.offset = -1 * topToWindow;
                break;

              case "center":
                this.offset = heightWindow / 2 - (topToWindow + heightParent / 2);
                break;

              case "bottom":
                this.offset = heightWindow - (topToWindow + heightParent);
                break;
            }
            this.value += (this.offset - this.value) / this.smooth;
            this.animationID = window.requestAnimationFrame(this.animation);
            this.elements.forEach((el => {
                const parameters = {
                    axis: el.dataset.axis ? el.dataset.axis : "v",
                    direction: el.dataset.direction ? el.dataset.direction + "1" : "-1",
                    coefficient: el.dataset.coefficient ? Number(el.dataset.coefficient) : 5,
                    additionalProperties: el.dataset.properties ? el.dataset.properties : ""
                };
                this.parameters(el, parameters);
            }));
        }
        parameters(el, parameters) {
            if (parameters.axis == "v") el.style.transform = `translate3D(0, ${(parameters.direction * (this.value / parameters.coefficient)).toFixed(2)}px,0) ${parameters.additionalProperties}`; else if (parameters.axis == "h") el.style.transform = `translate3D(${(parameters.direction * (this.value / parameters.coefficient)).toFixed(2)}px,0,0) ${parameters.additionalProperties}`;
        }
    };
    if (document.querySelectorAll("[data-prlx-parent]")) modules_flsModules.parallax = new Parallax(document.querySelectorAll("[data-prlx-parent]"));
    let addWindowScrollEvent = false;
    function headerScroll() {
        addWindowScrollEvent = true;
        const header = document.querySelector("header.header");
        const headerShow = header.hasAttribute("data-scroll-show");
        const headerShowTimer = header.dataset.scrollShow ? header.dataset.scrollShow : 500;
        const startPoint = header.dataset.scroll ? header.dataset.scroll : 1;
        let scrollDirection = 0;
        let timer;
        document.addEventListener("windowScroll", (function(e) {
            const scrollTop = window.scrollY;
            clearTimeout(timer);
            if (scrollTop >= startPoint) {
                !header.classList.contains("_header-scroll") ? header.classList.add("_header-scroll") : null;
                if (headerShow) {
                    if (scrollTop > scrollDirection) header.classList.contains("_header-show") ? header.classList.remove("_header-show") : null; else !header.classList.contains("_header-show") ? header.classList.add("_header-show") : null;
                    timer = setTimeout((() => {
                        !header.classList.contains("_header-show") ? header.classList.add("_header-show") : null;
                    }), headerShowTimer);
                }
            } else {
                header.classList.contains("_header-scroll") ? header.classList.remove("_header-scroll") : null;
                if (headerShow) header.classList.contains("_header-show") ? header.classList.remove("_header-show") : null;
            }
            scrollDirection = scrollTop <= 0 ? 0 : scrollTop;
        }));
    }
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P ? value : new P((function(resolve) {
                resolve(value);
            }));
        }
        return new (P || (P = Promise))((function(resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        }));
    }
    typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };
    function getDefaultExportFromCjs(x) {
        return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
    }
    var fastDeepEqual = function equal(a, b) {
        if (a === b) return true;
        if (a && b && typeof a == "object" && typeof b == "object") {
            if (a.constructor !== b.constructor) return false;
            var length, i, keys;
            if (Array.isArray(a)) {
                length = a.length;
                if (length != b.length) return false;
                for (i = length; i-- !== 0; ) if (!equal(a[i], b[i])) return false;
                return true;
            }
            if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
            if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
            if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();
            keys = Object.keys(a);
            length = keys.length;
            if (length !== Object.keys(b).length) return false;
            for (i = length; i-- !== 0; ) if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
            for (i = length; i-- !== 0; ) {
                var key = keys[i];
                if (!equal(a[key], b[key])) return false;
            }
            return true;
        }
        return a !== a && b !== b;
    };
    var isEqual = getDefaultExportFromCjs(fastDeepEqual);
    const DEFAULT_ID = "__googleMapsScriptId";
    var LoaderStatus;
    (function(LoaderStatus) {
        LoaderStatus[LoaderStatus["INITIALIZED"] = 0] = "INITIALIZED";
        LoaderStatus[LoaderStatus["LOADING"] = 1] = "LOADING";
        LoaderStatus[LoaderStatus["SUCCESS"] = 2] = "SUCCESS";
        LoaderStatus[LoaderStatus["FAILURE"] = 3] = "FAILURE";
    })(LoaderStatus || (LoaderStatus = {}));
    class Loader {
        constructor({apiKey, authReferrerPolicy, channel, client, id = DEFAULT_ID, language, libraries = [], mapIds, nonce, region, retries = 3, url = "https://maps.googleapis.com/maps/api/js", version}) {
            this.callbacks = [];
            this.done = false;
            this.loading = false;
            this.errors = [];
            this.apiKey = apiKey;
            this.authReferrerPolicy = authReferrerPolicy;
            this.channel = channel;
            this.client = client;
            this.id = id || DEFAULT_ID;
            this.language = language;
            this.libraries = libraries;
            this.mapIds = mapIds;
            this.nonce = nonce;
            this.region = region;
            this.retries = retries;
            this.url = url;
            this.version = version;
            if (Loader.instance) {
                if (!isEqual(this.options, Loader.instance.options)) throw new Error(`Loader must not be called again with different options. ${JSON.stringify(this.options)} !== ${JSON.stringify(Loader.instance.options)}`);
                return Loader.instance;
            }
            Loader.instance = this;
        }
        get options() {
            return {
                version: this.version,
                apiKey: this.apiKey,
                channel: this.channel,
                client: this.client,
                id: this.id,
                libraries: this.libraries,
                language: this.language,
                region: this.region,
                mapIds: this.mapIds,
                nonce: this.nonce,
                url: this.url,
                authReferrerPolicy: this.authReferrerPolicy
            };
        }
        get status() {
            if (this.errors.length) return LoaderStatus.FAILURE;
            if (this.done) return LoaderStatus.SUCCESS;
            if (this.loading) return LoaderStatus.LOADING;
            return LoaderStatus.INITIALIZED;
        }
        get failed() {
            return this.done && !this.loading && this.errors.length >= this.retries + 1;
        }
        createUrl() {
            let url = this.url;
            url += `?callback=__googleMapsCallback&loading=async`;
            if (this.apiKey) url += `&key=${this.apiKey}`;
            if (this.channel) url += `&channel=${this.channel}`;
            if (this.client) url += `&client=${this.client}`;
            if (this.libraries.length > 0) url += `&libraries=${this.libraries.join(",")}`;
            if (this.language) url += `&language=${this.language}`;
            if (this.region) url += `&region=${this.region}`;
            if (this.version) url += `&v=${this.version}`;
            if (this.mapIds) url += `&map_ids=${this.mapIds.join(",")}`;
            if (this.authReferrerPolicy) url += `&auth_referrer_policy=${this.authReferrerPolicy}`;
            return url;
        }
        deleteScript() {
            const script = document.getElementById(this.id);
            if (script) script.remove();
        }
        load() {
            return this.loadPromise();
        }
        loadPromise() {
            return new Promise(((resolve, reject) => {
                this.loadCallback((err => {
                    if (!err) resolve(window.google); else reject(err.error);
                }));
            }));
        }
        importLibrary(name) {
            this.execute();
            return google.maps.importLibrary(name);
        }
        loadCallback(fn) {
            this.callbacks.push(fn);
            this.execute();
        }
        setScript() {
            var _a, _b;
            if (document.getElementById(this.id)) {
                this.callback();
                return;
            }
            const params = {
                key: this.apiKey,
                channel: this.channel,
                client: this.client,
                libraries: this.libraries.length && this.libraries,
                v: this.version,
                mapIds: this.mapIds,
                language: this.language,
                region: this.region,
                authReferrerPolicy: this.authReferrerPolicy
            };
            Object.keys(params).forEach((key => !params[key] && delete params[key]));
            if (!((_b = (_a = window === null || window === void 0 ? void 0 : window.google) === null || _a === void 0 ? void 0 : _a.maps) === null || _b === void 0 ? void 0 : _b.importLibrary)) (g => {
                let h, a, k, p = "The Google Maps JavaScript API", c = "google", l = "importLibrary", q = "__ib__", m = document, b = window;
                b = b[c] || (b[c] = {});
                const d = b.maps || (b.maps = {}), r = new Set, e = new URLSearchParams, u = () => h || (h = new Promise(((f, n) => __awaiter(this, void 0, void 0, (function*() {
                    var _a;
                    yield a = m.createElement("script");
                    a.id = this.id;
                    e.set("libraries", [ ...r ] + "");
                    for (k in g) e.set(k.replace(/[A-Z]/g, (t => "_" + t[0].toLowerCase())), g[k]);
                    e.set("callback", c + ".maps." + q);
                    a.src = this.url + `?` + e;
                    d[q] = f;
                    a.onerror = () => h = n(Error(p + " could not load."));
                    a.nonce = this.nonce || ((_a = m.querySelector("script[nonce]")) === null || _a === void 0 ? void 0 : _a.nonce) || "";
                    m.head.append(a);
                })))));
                d[l] ? console.warn(p + " only loads once. Ignoring:", g) : d[l] = (f, ...n) => r.add(f) && u().then((() => d[l](f, ...n)));
            })(params);
            const libraryPromises = this.libraries.map((library => this.importLibrary(library)));
            if (!libraryPromises.length) libraryPromises.push(this.importLibrary("core"));
            Promise.all(libraryPromises).then((() => this.callback()), (error => {
                const event = new ErrorEvent("error", {
                    error
                });
                this.loadErrorCallback(event);
            }));
        }
        reset() {
            this.deleteScript();
            this.done = false;
            this.loading = false;
            this.errors = [];
            this.onerrorEvent = null;
        }
        resetIfRetryingFailed() {
            if (this.failed) this.reset();
        }
        loadErrorCallback(e) {
            this.errors.push(e);
            if (this.errors.length <= this.retries) {
                const delay = this.errors.length * Math.pow(2, this.errors.length);
                console.error(`Failed to load Google Maps script, retrying in ${delay} ms.`);
                setTimeout((() => {
                    this.deleteScript();
                    this.setScript();
                }), delay);
            } else {
                this.onerrorEvent = e;
                this.callback();
            }
        }
        callback() {
            this.done = true;
            this.loading = false;
            this.callbacks.forEach((cb => {
                cb(this.onerrorEvent);
            }));
            this.callbacks = [];
        }
        execute() {
            this.resetIfRetryingFailed();
            if (this.loading) return;
            if (this.done) this.callback(); else {
                if (window.google && window.google.maps && window.google.maps.version) {
                    console.warn("Google Maps already loaded outside @googlemaps/js-api-loader. " + "This may result in undesirable behavior as options and script parameters may not match.");
                    this.callback();
                    return;
                }
                this.loading = true;
                this.setScript();
            }
        }
    }
    const BREAKPOINTS = {
        tablet: 991.98,
        mobile: 767.98,
        smallMobile: 479.98,
        xsMobile: 320
    };
    const MAP_STYLES = [ {
        featureType: "administrative",
        elementType: "labels.text.fill",
        stylers: [ {
            color: "#B1AEAE"
        } ]
    }, {
        featureType: "landscape",
        elementType: "all",
        stylers: [ {
            color: "#E5E2E2"
        } ]
    }, {
        featureType: "poi",
        elementType: "labels.icon",
        stylers: [ {
            saturation: -100
        }, {
            lightness: 45
        } ]
    }, {
        featureType: "poi",
        elementType: "labels.text",
        stylers: [ {
            visibility: "off"
        } ]
    }, {
        featureType: "road",
        elementType: "geometry.fill",
        stylers: [ {
            color: "#D6D3D3"
        } ]
    }, {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [ {
            color: "#CECBCB"
        } ]
    }, {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [ {
            color: "#B0AEAE"
        } ]
    }, {
        featureType: "road",
        elementType: "labels.text.stroke",
        stylers: [ {
            color: "#E4E1E1"
        } ]
    }, {
        featureType: "road.highway",
        elementType: "all",
        stylers: [ {
            visibility: "simplified"
        }, {
            saturation: -100
        } ]
    }, {
        featureType: "road.arterial",
        elementType: "labels.icon",
        stylers: [ {
            visibility: "off"
        } ]
    }, {
        featureType: "transit",
        elementType: "all",
        stylers: [ {
            visibility: "on"
        }, {
            saturation: -100
        }, {
            lightness: 50
        } ]
    }, {
        featureType: "water",
        elementType: "all",
        stylers: [ {
            color: "#D0CDCD"
        }, {
            visibility: "on"
        } ]
    } ];
    (() => {
        const SELECTORS = {
            section: ".js-map-section",
            marker: ".js-map-marker",
            map: ".js-map"
        };
        const $sections = document.querySelectorAll(SELECTORS.section);
        if (!$sections.length) return;
        const loadMap = async onLoad => {
            const loader = new Loader({
                apiKey: "YOUR_API_KEY",
                version: "weekly",
                libraries: [ "places" ]
            });
            try {
                const {Map} = await loader.importLibrary("maps");
                const {Marker} = await loader.importLibrary("marker");
                const Core = await loader.importLibrary("core");
                onLoad({
                    Map,
                    Marker,
                    Core
                });
            } catch (e) {
                console.log("google map error");
                console.log(e);
            }
        };
        const initMap = ({api, lng, lat, markersData, zoom, maxZoom, $map}) => {
            const mapOptions = {
                maxZoom,
                zoom,
                mapTypeControl: false,
                styles: MAP_STYLES,
                center: {
                    lat,
                    lng
                },
                disableDefaultUI: true
            };
            const map = new api.Map($map, mapOptions);
            const markerDesktopSize = {
                width: 40,
                height: 57
            };
            const markerMobileSize = {
                width: 30,
                height: 42
            };
            const markerSize = window.innerWidth < BREAKPOINTS.tablet ? markerMobileSize : markerDesktopSize;
            const markers = markersData.map((({lat, lng, icon}) => {
                const marker = new api.marker.AdvancedMarkerElement({
                    map,
                    position: new api.Core.LatLng(lat, lng),
                    icon: {
                        url: icon,
                        anchor: new api.Core.Point(markerSize.width / 2, markerSize.height),
                        scaledSize: new api.Core.Size(markerSize.width, markerSize.height)
                    }
                });
                api.Core.event.addListener(marker, "click", (() => {
                    markers.forEach((m => m.setIcon({
                        url: m.icon.url,
                        anchor: new api.Core.Point(markerSize.width / 2, markerSize.height),
                        scaledSize: new api.Core.Size(markerSize.width, markerSize.height)
                    })));
                    marker.setIcon({
                        url: marker.icon.url,
                        anchor: new api.Core.Point(markerSize.width / 2, markerSize.height),
                        scaledSize: new api.Core.Size(markerSize.width, markerSize.height)
                    });
                    map.panTo(marker.getPosition());
                }));
                return marker;
            }));
            return map;
        };
        loadMap((api => {
            $sections.forEach(($section => {
                const $maps = $section.querySelectorAll(SELECTORS.map);
                if (!$maps.length) return;
                $maps.forEach(($map => {
                    const $markers = $map.parentElement.querySelectorAll(SELECTORS.marker);
                    const markersData = Array.from($markers).map(($marker => ({
                        lng: parseFloat($marker.dataset.lng) || 0,
                        lat: parseFloat($marker.dataset.lat) || 0,
                        icon: $marker.dataset.icon
                    })));
                    initMap({
                        api,
                        $map,
                        lng: parseFloat($map.dataset.lng) || 0,
                        lat: parseFloat($map.dataset.lat) || 0,
                        zoom: parseFloat($map.dataset.zoom) || 6,
                        maxZoom: parseFloat($map.dataset.maxZoom) || 18,
                        markersData
                    });
                }));
            }));
        }));
    })();
    window["FLS"] = true;
    addLoadedClass();
    menuInit();
    headerScroll();
})();