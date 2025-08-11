export interface SDS {
  id: string;
  fileName: string | null;
  filePath: string | null;
  externalUrl: string | null;
  language: string;
  hazardClassification: string[];
  precautionaryStatement: string[];
  firstAidInhalation: string;
  firstAidSkin: string;
  firstAidEye: string;
  firstAidIngestio: string;
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
interface FirstAidMeasures {
  inhalation: string;
  skinContact: string;
  eyeContact: string;
  ingestion: string;
}

interface StorageInfo {
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
