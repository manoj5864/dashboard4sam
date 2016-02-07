function downloadURI(uri, name) {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    link.click();
}

export function svgElementToImage(element, fileName, {type = 'png'} = {}) {
    let svgData = new XMLSerializer().serializeToString( svg );
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');

    let img = document.createElement('img');
    img.setAttribute('src', `data:image/svg+xml;base64,${btoa(svgData)}`)
    img.onload = function() {
        ctx.drawImage(img, 0, 0);
        let dataUrl = canvas.toDataURL(`image/${type}`);
        downloadURI(dataUrl, `${fileName}.${type}`)
    }
}