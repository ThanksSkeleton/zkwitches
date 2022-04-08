export default function img2array(id: string) {

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const img = document.getElementById(id) as any;
    canvas.width = 1024;
    canvas.height = 1024;
    console.log(img.width, img.height, img.naturalWidth, img.naturalHeight, canvas.width, canvas.height);
    if (img.naturalHeight === img.naturalWidth) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    } else if (img.naturalHeight > img.naturalWidth) {
        const sy = (img.naturalHeight-img.naturalWidth) / 2 >> 0;
        ctx.drawImage(img, 0, sy, img.naturalWidth, img.naturalWidth, 0, 0, canvas.width, canvas.height);
    } else {
        const sx = (img.naturalWidth-img.naturalHeight) / 2 >> 0;
        ctx.drawImage(img, sx, 0, img.naturalHeight, img.naturalHeight, 0, 0, canvas.width, canvas.height);
    }
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const dataURL = canvas.toDataURL("image/png");

    const data = imageData.data;

    let array: Array<Array<Array<number>>>;
    array = [];
    let tmp: Array<Array<number>>;
    tmp = [];

    for (var i = 0; i < data.length; i += 4) {
        if ((i % (canvas.width * 4) === 0) && (i > 0)) {
            array.push(tmp);
            tmp = [];
        }
        tmp.push([data[i], data[i + 1], data[i + 2]]);
    }
    array.push(tmp);

    let slicedArray = sliceArray(array);

    return ({
        'dataURL': dataURL,
        'data': slicedArray
    })
}

function sliceArray(array: Array<Array<Array<number>>>) {
    let slicedArray: Array<Array<Array<number>>>;
    slicedArray = [];
    for (var k = 0; k < 16; k++) {
        var x = (k % 4) * 256;
        var y = (k / 4 >> 0) * 256;
        let tmp: Array<Array<number>>;
        tmp = [];
        for (var j = 0; j < 256; j++) {
            for (var i = 0; i < 256; i++) {
                tmp.push(array[y + j][x + i]);
            }
        }
        slicedArray.push(tmp);
    }
    return slicedArray;
}