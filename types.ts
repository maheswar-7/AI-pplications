
export enum AppTab {
  MOCKUP = 'MOCKUP',
  EDITOR = 'EDITOR',
}

export interface Product {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
}

export interface UploadedFile {
    base64: string;
    mimeType: string;
    name: string;
}
