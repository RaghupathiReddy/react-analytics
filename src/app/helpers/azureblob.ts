// THIS IS SAMPLE CODE ONLY - NOT MEANT FOR PRODUCTION USE
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import crypto from 'crypto';
import config from '../config'

const sasToken = config.BLOB_STORAGE_SAS_TOKEN; // Fill string with your SAS token
const storageAccountName = config.BLOB_STORAGE_ACCOUNT_NAME; // Fill string with your Storage resource name
const containerName = config.BLOB_STORAGE_CONTAINER_NAME || 'plainxblob';

const createBlobInContainer = async (containerClient: any, file: File) => {
    const token = crypto.randomBytes(20).toString('hex');
    const blobClient = containerClient.getBlockBlobClient(`${token}_${file.name}`);
    const options = { blobHTTPHeaders: { blobContentType: file.type }, onProgress: (ev: any) => console.log(ev) };
    try {
        await blobClient.uploadBrowserData(file, options);
        await blobClient.setMetadata({ status: 'inprogress' });
        return blobClient;
    } catch (error) {
        console.log({ error });
    }
};

const uploadFileToBlob = async (file: File) => {
    // get BlobService = notice `?` is pulled out of sasToken - if created in Azure portal
    const blobService = new BlobServiceClient(`https://${storageAccountName}.blob.core.windows.net/?${sasToken}`);
    // get Container - full public read access
    const containerClient = blobService.getContainerClient(containerName);
    // upload file
    try {
        const blobClient = await createBlobInContainer(containerClient, file);
        if (!!blobClient) {
            return `https://${storageAccountName}.blob.core.windows.net/${containerName}/${blobClient.name}`;
        }
    } catch (error) {
        console.log(error);
    }
};

export default uploadFileToBlob;
