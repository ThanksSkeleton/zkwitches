import { BigNumber } from "ethers";

export default function array2uri(array: Array<Array<any>>) {

    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    for (let k = 0; k < 16; k++) {
        let x = (k % 4) * 16;
        let y = (k / 4 >> 0) * 16;
        let idx = 0;
        let sliceArray = Array.from({ length: 16 }, e => Array.from({ length: 16 }, e => Array.from({ length: 4 }, e => 255)));
        //console.log(sliceArray);

        for (let j = 0; j < 16; j += 2) {
            for (let i = 0; i < 16; i += 2) {
                let tmp = BigNumber.from(array[k][idx]).toHexString().slice(2).padStart(30, '0');
                //console.log(tmp);

                sliceArray[j][i][0] = parseInt(tmp.slice(0, 2), 16);
                sliceArray[j][i][1] = parseInt(tmp.slice(2, 4), 16);
                sliceArray[j][i][2] = parseInt(tmp.slice(4, 6), 16);

                sliceArray[j][i + 1][0] = parseInt(tmp.slice(8, 10), 16);
                sliceArray[j][i + 1][1] = parseInt(tmp.slice(10, 12), 16);
                sliceArray[j][i + 1][2] = parseInt(tmp.slice(12, 14), 16);

                sliceArray[j + 1][i][0] = parseInt(tmp.slice(16, 18), 16);
                sliceArray[j + 1][i][1] = parseInt(tmp.slice(18, 20), 16);
                sliceArray[j + 1][i][2] = parseInt(tmp.slice(20, 22), 16);

                sliceArray[j + 1][i + 1][0] = parseInt(tmp.slice(24, 26), 16);
                sliceArray[j + 1][i + 1][1] = parseInt(tmp.slice(26, 28), 16);
                sliceArray[j + 1][i + 1][2] = parseInt(tmp.slice(28, 30), 16);

                idx++;
            }
        }
        let imageData = new ImageData(Uint8ClampedArray.from(sliceArray.flat().flat()), 16, 16);

        ctx.putImageData(imageData, x, y);
    }

    const dataURL = canvas.toDataURL("image/png");

    return dataURL;
}