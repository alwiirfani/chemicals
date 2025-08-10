export interface SDS {
  id: string;
  fileName: string | null;
  filePath: string | null;
  externalUrl: string | null;
  language: string;
  hazardClassification: string;
  precautionaryStatement: string;
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

export interface SDSFormData {
  chemicalId: string;
  fileName: string;
  filePath: string;
  externalUrl: string;
  language: string;
  hazardClassification: string;
  precautionaryStatement: string;
  firstAidInhalation: string;
  firstAidSkin: string;
  firstAidEye: string;
  firstAidIngestio: string;
  storageConditions: string;
  disposalInfo: string;
}
