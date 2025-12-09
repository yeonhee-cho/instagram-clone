export const FILTER_OPTIONS = [
    {name: 'Original', filter: 'none'},
    {name: 'Grayscale', filter: 'grayscale(100%)'},
    {name: 'Sepia', filter: 'sepia(60%)'},
    {name: 'Warm', filter: 'sepia(30%) saturate(140%)'},
    {name: 'Cool', filter: 'hue-rotate(180deg) saturate(80%)'},
    {name: 'Brightness', filter: 'brightness(120%) contrast(110%)'},
    {name: 'Vintage', filter: 'sepia(40%) contrast(120%) saturate(80%)'},
];

/**
 * 원본 이미지 파일에 CSS 필터를 적용하여 새로운 파일로 변환
 * @param sourceImageFile 원본 이미지 파일
 * @param filter 적용할 CSS 필터 문자열
 * @returns {Promise<File>} 필터가 적용된 새로운 File 객체
 */
export const getFilteredFile = async (file, filter) => {
    // 필터가 없으면 원본 그대로 반환
    if(!filter || filter === 'none') return file;
    console.log("file", file);
    console.log("filter", filter);

    const img = new Image();
    console.log("img : ", img);
    const url = URL.createObjectURL(file);
    console.log("url : ", url);
    img.src = url;
    console.log("img.src : ", img.src);

    try {
        await img.decode(); // 이미지 로드 대기
        // URL.revokeObjectURL(url); // 메모리 해제 -- 너무 빨리 들어가면 오류!

        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        console.log("canvas : ",canvas);

        const ctx = canvas.getContext('2d');
        ctx.filter= filter;
        ctx.drawImage(img, 0, 0);
        console.log("ctx: ", ctx);

        URL.revokeObjectURL(url); // 메모리 해제

        // canvas -> file 변환
        return new Promise(resolve => {
            canvas.toBlob(blob => {
                resolve(new File([blob],
                                file.name,
                        {type: file.type, lastModified: new Date()}
                ));
            }, file.type,
                0.9
            );
        })
    } catch (err) {
        console.log(err);
        return file; // 문제 시 원본 반환
    }
}

/*
export const getFilteredFile = async (file, filter) => {

        // 필터가 없으면 원본 그대로 반환
        if (!filter || filter === 'none') return file;
        console.log("file", file);
        console.log("filter", filter);

        const img = new Image();
        console.log("img : ", img);
        const url = URL.createObjectURL(file);
        console.log("url : ", url);

    return new Promise(resolve => {

        img.onload = () => {
            console.log("promise 시작");
            try {
                // await img.decode(); // 이미지 로드 대기
                // URL.revokeObjectURL(url); // 메모리 해제 -- 너무 빨리 들어가면 오류!

                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                console.log("canvas : ", canvas);

                const ctx = canvas.getContext('2d');
                ctx.filter = filter;
                ctx.drawImage(img, 0, 0);
                console.log("ctx: ", ctx);

                URL.revokeObjectURL(url); // 메모리 해제

                // canvas -> file 변환
                canvas.toBlob(blob => {
                        resolve(new File([blob],
                            file.name,
                            {type: file.type, lastModified: new Date()}
                        ));
                    }, file.type,
                    0.9
                );

                img.src = url;
                console.log("img.src : ", img.src);
            } catch (err) {
                console.log(err);
                return file; // 문제 시 원본 반환
            }
        }
    })
}
*/