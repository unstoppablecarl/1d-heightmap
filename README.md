# 1d-heightmap

Procedurally generate and manipulate 1 dimensional heightmaps

## Examples

[http://unstoppablecarl.github.io/1d-heightmap/](http://unstoppablecarl.github.io/1d-heightmap/)

## Example Usage

```js
var canvas = document.createElement('canvas');
canvas.width = 400;
canvas.height = 200;
var ctx = canvas.getContext('2d');

// make a heightmap
var hm = oneDHeightmap.create({
    length:    400,
});

// generate height map data
hm.generate.rough({
    startHeight:       1,
    endHeight:         1,
    variance:          3,
    edgeDeflectMargin: 0.25,
    deviationChance:   0.9,
    endTaperMargin:    10,
    startTaperMargin:  20,
});

// draw heightmap to canvas
oneDHeightmap.draw({
    heightmap: hm,
    ctx:       ctx,
    x:         0,
    y:         0,
    direction: 'up',
    color:     'blue',
});

document.body.appendChild(canvas);
```