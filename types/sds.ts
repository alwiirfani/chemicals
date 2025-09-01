export interface SDS {
  id: string;
  fileName: string | null;
  filePath: string | null;
  externalUrl: string | null;
  language: string;
  createdByName: string;
  updatedByName: string;
  createdAt: Date;
  updatedAt: Date;
  chemical: {
    id: string;
    name: string;
    formula: string | null;
    form: string;
    characteristic: string;
  };
}

// Untuk data utama form
export interface SDSFormData {
  chemicalId: string;
  externalUrl: string;
  language: "ID" | "EN";
  fileInfo?: FileInfo;
}

interface FileInfo {
  name?: string;
  path?: string;
}

export type UploadType = "file" | "link";

// Interface untuk data SDS yang akan di-populate
export interface SDSData {
  id: string;
  chemicalId: string;
  language: string;
  uploadType: "file" | "link";
  externalUrl?: string;
}
