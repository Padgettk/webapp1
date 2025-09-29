import { BlobSASPermissions, SASProtocol, StorageSharedKeyCredential, generateBlobSASQueryParameters } from '@azure/storage-blob';

export function getUploadSasUrl(filename: string) {
  const accountName = process.env.AZURE_STORAGE_ACCOUNT!;
  const containerName = process.env.AZURE_STORAGE_CONTAINER!;
  const accountKey = process.env.AZURE_STORAGE_KEY!;

  const creds = new StorageSharedKeyCredential(accountName, accountKey);
  const expiresOn = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
  const sas = generateBlobSASQueryParameters(
    {
      containerName,
      blobName: filename,
      permissions: BlobSASPermissions.parse('cw'),
      startsOn: new Date(),
      expiresOn,
      protocol: SASProtocol.Https,
    },
    creds
  ).toString();

  const uploadUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${encodeURIComponent(filename)}?${sas}`;
  return uploadUrl;
}
