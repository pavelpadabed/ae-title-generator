if (typeof JSON === "undefined") {
    JSON = {};
}

if (typeof JSON.parse !== "function") {
    JSON.parse = function (str) {
        return eval("(" + str + ")");
    };
}

if (typeof JSON.stringify !== "function") {
    JSON.stringify = function (obj) {
        return obj.toSource();
    };
}

function loadJson(filename) {

    var scriptFile = new File($.fileName);
    var scriptDir  = scriptFile.parent;


    var dataDir = new Folder(scriptDir.fsName + "/data");

    var file = new File(dataDir.fsName + "/" + filename);

    if (!file.exists) {
        alert("File not found:\n" + file.fsName);
        return null;
    }

    if (!file.open("r")) {
        alert("Can't open file:\n" + file.fsName);
        return null;
    }

    var content = file.read();
    file.close();

    if (!content) {
        alert("JSON file is empty.");
        return null;
    }

    try {
        return JSON.parse(content);
    } catch (e) {
        alert("Failed to parse JSON:\n" + e.message);
        return null;
    }
}


function getTitlesDuration(titles) {
    var maxEnd = 0;

    for (var i = 0; i < titles.length; i++) {
        var end = titles[i].end;

        if (end > maxEnd) {
            maxEnd = end;
        }

    }
    return maxEnd;
}

function createTitleComp(cfg, titles) {

    var c = cfg.composition || cfg;

    var duration = getTitlesDuration(titles);

    var name = c.name || "Generated title";
    var width = c.width || 1920;
    var height = c.height || 1080;
    var fps = c.fps || 25;

    var comp = app.project.items.addComp(
        name,
        width,
        height,
        1.0,
        duration,
        fps
    );

    return comp;
}

function createTextLayer(comp, text, start, end, cfg) {

    if (!cfg) {
        alert("Text style config is missing!");
        return null;
    }

    var s = (typeof start === "number") ? start : 0;
    var e;
    if (typeof end === "number") {
        e = end;
    } else {
        e = Math.min(comp.duration, s + 3);
    }
    if (e <= s) {
        e = s + 3;
    }

    var layer = comp.layers.addText(text);
    var prop = layer.property("Source Text");
    var doc = prop.value;

    if (cfg.font) doc.font = cfg.font;

    if (cfg.fontSize !== undefined) doc.fontSize = cfg.fontSize;

    if (cfg.color) doc.fillColor = cfg.color;

    if (cfg.tracking !== undefined) doc.tracking = cfg.tracking;

    if (cfg.leading !== undefined) doc.leading = cfg.leading;

    doc.justification = ParagraphJustification.CENTER_JUSTIFY;

    prop.setValue(doc);

    layer.startTime = s;
    layer.outPoint = e;

    return layer;
}

function centerLayer(layer, comp) {
    var r = layer.sourceRectAtTime(0, false);
    var posX = (comp.width / 2) - (r.width / 2) - r.left;
    var posY = (comp.height / 2) - (r.height / 2) - r.top;
    layer.property("Position").setValue([posX, posY]);
}

function positionAbove(baseLayer, topLayer, gap) {
    gap = (typeof gap !== "undefined") ? gap : 40;

    if (!baseLayer || !topLayer) {
        alert("positionAbove: baseLayer or topLayer is undefined!");
        return;
    }

    var baseRect = baseLayer.sourceRectAtTime(0, false);
    var basePos = baseLayer.property("Position").value;
    var baseTop = basePos[1] + baseRect.top;

    var topRect = topLayer.sourceRectAtTime(0, false);
    var newTopY = baseTop - gap - topRect.top - topRect.height;
    var newX = basePos[0];
    topLayer.property("Position").setValue([newX, newTopY]);
}

function createBackground(comp, cfg) {

    alert("transparent = " + cfg.transparent);

    if (!cfg || cfg.transparent === true) {
        return null;
    }
    var color = cfg.color || [0, 0, 0];

    var name = cfg.name || "Background";

    var bg = comp.layers.addSolid(
        color,
        name,
        comp.width,
        comp.height,
        comp.pixelAspect,
        comp.duration
    );
    bg.moveToEnd();

    bg.locked = true;

    return bg;
}

function easeKeys(prop, k1, k2) {
    var e = new KeyframeEase(0, 33);
    prop.setTemporalEaseAtKey(k1, [e], [e]);
    prop.setTemporalEaseAtKey(k2, [e], [e]);
}

function fadeIn(layer, duration) {
    var p = layer.property("Opacity");
    var dur = duration || 0.5;
    var tStart = layer.inPoint;
    var tEnd = tStart + dur;

    p.setValueAtTime(tStart, 0);
    p.setValueAtTime(tEnd, 100);

    easeKeys(p, p.numKeys - 1, p.numKeys);
}

function fadeOut(layer, duration) {
    var p = layer.property("Opacity");
    var dur = duration || 0.5;
    var tEnd = layer.outPoint;
    var tStart = tEnd - dur

    p.setValueAtTime(tStart, 100);
    p.setValueAtTime(tEnd, 0);

    easeKeys(p, p.numKeys - 1, p.numKeys);
}

function timeToSeconds(t) {
    if (typeof t === "number") return t;

    var parts = t.split(":");
    var seconds = 0;

    while (parts.length) {
        seconds = seconds * 60 + parseFloat(parts.shift());
    }

    return seconds;
}

function createTitlePair(comp, item, config) {

    var start = item.start;
    var end   = item.end;

    var nameLayer = createTextLayer(
        comp,
        item.name,
        start,
        end,
        config.nameStyle
    );

    var roleLayer = createTextLayer(
        comp,
        item.role,
        start,
        end,
        config.roleStyle
    );

    if (!nameLayer || !roleLayer) {
        alert("Text layer creation failed — check styles in config");
        return;
    }

    centerLayer(nameLayer, comp);
    positionAbove(nameLayer, roleLayer, 40);

    fadeIn(nameLayer, 0.2);
    fadeIn(roleLayer, 0.2);

    fadeOut(nameLayer, 0.2);
    fadeOut(roleLayer, 0.2);

    nameLayer.startTime = start;
    nameLayer.outPoint  = end;

    roleLayer.startTime = start;
    roleLayer.outPoint  = end;
}


(function main() {

    var config = loadJson("config.json");
    if (!config) { alert("No config loaded"); return; }

    var data = loadJson("titles.json");
    if (!data || !data.titles) {
        alert("No titles loaded");
        return;
    }

    var titles = data.titles;

    for (var i = 0; i < titles.length; i++) {
        titles[i].start = timeToSeconds(titles[i].start);
        titles[i].end   = timeToSeconds(titles[i].end);

        if (titles[i].end <= titles[i].start) {
            alert("Invalid timing at title index " + i);
            return;
        }
    }

    var comp = createTitleComp(config, titles);

    for (var i = 0; i < titles.length; i++) {
        createTitlePair(comp, titles[i], config);
    }

    createBackground(comp, config.background);

    alert("All titles generated!");

})();
