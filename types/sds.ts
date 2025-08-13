export interface SDS {
  id: string;
  fileName: string | null;
  filePath: string | null;
  externalUrl: string;
  language: string;
  hazardClassification: string[];
  precautionaryStatement: string[];
  firstAidInhalation: string;
  firstAidSkin: string;
  firstAidEyes: string;
  firstAidIngestion: string;
  storageConditions: string;
  disposalInfo: string;
  downloadCount: number;
  createdByName: string;
  updatedByName: string;
  createdAt: Date;
  updatedAt: Date;
  chemical: {
    id: string;
    name: string;
    formula: string;
    casNumber: string;
    form: string;
  };
}

// Untuk data utama form
export interface SDSFormData {
  chemicalId: string;
  externalUrl: string;
  language: "ID" | "EN";
  firstAidMeasures: FirstAidMeasures;
  storageInfo: StorageInfo;
  hazardInfo: HazardInfo;
  fileInfo?: FileInfo;
}

// Sub-interfaces
export interface FirstAidMeasures {
  inhalation: string;
  skinContact: string;
  eyeContact: string;
  ingestion: string;
}

export interface StorageInfo {
  conditions: string;
  disposal: string;
}

interface HazardInfo {
  classifications: string[];
  statements: string[];
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
  hazardClassifications: string[];
  precautionaryStatements: string[];
  firstAidMeasures: {
    inhalation: string;
    skinContact: string;
    eyeContact: string;
    ingestion: string;
  };
  storageInfo: {
    conditions: string;
    disposal: string;
  };
}
