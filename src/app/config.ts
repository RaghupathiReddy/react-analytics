const config = {
  HOST_NAME: process.env.REACT_APP_API_URL,
  BLOB_STORAGE_SAS_TOKEN:
    "?sv=2020-08-04&ss=bfqt&srt=sco&sp=rwdlacupitfx&se=2023-02-21T21:48:07Z&st=2022-02-21T13:48:07Z&spr=https,http&sig=k0Mk0c5hj3QYkmrRXG0fVA4K%2Fw92Lx7WULxZnlAHXv8%3D",
  BLOB_STORAGE_CONTAINER_NAME: "plainxdata",
  BLOB_STORAGE_ACCOUNT_NAME: "plainxblob",
  AZURE_CONNECTION_STR:
    "Endpoint=sb://plainxai-channel.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=ej+qQy1iN9NAl+KM68W0QvOpyagvwprfTDE4j3SP2g8=",
};

export default config;
