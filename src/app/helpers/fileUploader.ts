import { FileDetails } from "../pages/CreateProject/Models/Project";
import uploadFileToBlob from "./azureblob";

export const getFileDetails = async (file: File) => {
    return uploadFileToBlob(file).then((dataUrl) => {
        let fileDetails: FileDetails = {
            fileURL: dataUrl,
            fileSize: file.size,
            fileName: file.name
        }
        return fileDetails
    })
}