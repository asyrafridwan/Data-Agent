
export interface CreditAccount {
  accountType: string;
  creditorName: string;
  accountStatus: string;
  balance: number;
  creditLimit: number | null;
  paymentStatus: string;
}

export interface HardInquiry {
  date: string;
  creditorName: string;
}

export interface PublicRecord {
  type: string;
  date: string;
  description: string;
}

export interface CreditReportData {
  personalInformation: {
    name: string;
    address: string;
  };
  creditScore: {
    score: number;
    model: string;
  };
  summary: {
    totalDebt: number;
    creditUtilization: number;
  };
  accounts: CreditAccount[];
  publicRecords: PublicRecord[];
  hardInquiries: HardInquiry[];
}
