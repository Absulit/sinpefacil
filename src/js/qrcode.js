export const defaultImage = '/icons/512x512.png';

export const styleOptions = {
    width: 300,
    height: 300,
    type: 'svg',
    data: null,
    image: defaultImage, // link to image
    qrOptions: {
        errorCorrectionLevel: 'L',
        typeNumber: 0
    },
    dotsOptions: {
        color: '#156683',
        type: 'rounded',
        roundSize: true
    },
    backgroundOptions: {
        color: '#e9ebee',
    },
    imageOptions: {
        margin: 2,
        imageSisize: .4,
    },
    cornersSquareOptions: {
        type: "extra-rounded",
        color: "#00000"
    },

    cornersDotOptions: {
        color: "#000000",
        type: 'extra-rounded'
    },

}

export const styleOptionsHistory = {
    width: 300,
    height: 300,
    type: 'svg',
    data: null,
    image: defaultImage, // link to image
    dotsOptions: {
        color: '#ff5500',
        type: 'rounded',
        roundSize: true
    },
    backgroundOptions: {
        color: '#e9ebee',
    },
    imageOptions: {
        margin: 2,
        imageSisize: .4,
    },
    cornersSquareOptions: {
        type: "extra-rounded",
        color: "#00000"
    },

    cornersDotOptions: {
        color: "#000000",
        type: 'extra-rounded'
    },

}
