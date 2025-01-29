

export const fetchDefaultImageAsFile = async (defaultImageUrl:string) => {
    const res = await fetch("/"+defaultImageUrl); // Get the image from public folder
    const blob = await res.blob(); // Convert to Blob
    const file = new File([blob], defaultImageUrl, { type: 'image/png' }); // Create File object
    return file;
};