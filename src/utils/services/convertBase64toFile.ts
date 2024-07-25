export default function base64ToFile(
	base64: string | null | File,
	filename: string
) {
	if (!base64) return null;

	const arr = base64.split(",");
	const mime = arr[0].match(/:(.*?);/)?.[1];
	if (!mime) return null;

	const bstr = atob(arr[1]);
	let n = bstr.length;
	const u8arr = new Uint8Array(n);

	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}

	return new File([u8arr], filename, { type: mime });
}
