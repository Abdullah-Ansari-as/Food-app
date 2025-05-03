import cloudinary from "./cloudinary";

const uploadImageOnCloudinary = async (imageFile: Express.Multer.File) => {
	const base64Image = Buffer.from(imageFile.buffer).toString("base64");
	const dataURI = `data:${imageFile.mimetype};base64,${base64Image}`;

	const uploadResponse = await cloudinary.uploader.upload(dataURI);
	return uploadResponse.secure_url;
}

export default uploadImageOnCloudinary;