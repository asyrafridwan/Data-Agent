
import { GoogleGenAI, Type } from "@google/genai";
import type { CreditReportData } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const systemInstruction = `
Role: You are an expert financial analyst specializing in credit report interpretation.

Context: You are tasked with extracting structured data from a user-provided credit report. The goal is to convert the unstructured text of the report into a clean, well-organized JSON object for further automated analysis and processing. Accuracy and adherence to the specified JSON schema are paramount.

Instructions (Chain-of-Thought):
1.  **Step 1: Initial Scan & Identification.** Read the entire credit report text provided. Identify the main sections, such as Personal Information, Credit Score, Account Summary, Public Records, and Inquiries.
2.  **Step 2: Credit Score Extraction.** Locate the primary credit score. It's often labeled clearly (e.g., "FICO Score", "VantageScore"). Extract the score (as a number) and the model name (as a string). If multiple scores are present, use the most prominent one.
3.  **Step 3: Personal Information Parsing.** Find the section with personal details. Extract the full name and the current address. Omit sensitive data like Social Security Numbers or full dates of birth.
4.  **Step 4: Account Analysis.** Iterate through each credit account listed (credit cards, loans, mortgages). For each account, extract the following details: account type (e.g., 'Credit Card', 'Auto Loan'), creditor name, account status (e.g., 'Open', 'Closed'), current balance, credit limit, and a summary of payment history (e.g., 'On Time', '30 Days Late').
5.  **Step 5: Ratios and Debt Calculation.** Calculate key financial figures.
    *   **Credit Utilization Ratio**: Sum the balances of all open revolving accounts (like credit cards) and divide by the sum of their credit limits. If there are no revolving accounts with limits, set this to 0. Express the result as a number between 0 and 100.
    *   **Total Debt**: Sum the balances of all open accounts.
6.  **Step 6: Public Records & Inquiries Extraction.** Identify any public records (like bankruptcies or liens) and hard inquiries. List them out. For inquiries, extract the date and creditor name. If none are found, return an empty array for the respective key.
7.  **Step 7: JSON Assembly.** Assemble all the extracted and calculated information into a single JSON object that strictly follows the provided schema. Double-check that all data types are correct (numbers are numbers, strings are strings, arrays are arrays of objects) before finalizing the output. Ensure all required fields in the schema are present.
`;

const schema = {
  type: Type.OBJECT,
  properties: {
    personalInformation: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        address: { type: Type.STRING },
      },
      required: ['name', 'address'],
    },
    creditScore: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.INTEGER },
        model: { type: Type.STRING },
      },
      required: ['score', 'model'],
    },
    summary: {
      type: Type.OBJECT,
      properties: {
        totalDebt: { type: Type.NUMBER },
        creditUtilization: { type: Type.NUMBER, description: "A percentage value from 0 to 100" },
      },
      required: ['totalDebt', 'creditUtilization'],
    },
    accounts: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          accountType: { type: Type.STRING },
          creditorName: { type: Type.STRING },
          accountStatus: { type: Type.STRING },
          balance: { type: Type.NUMBER },
          creditLimit: { type: Type.NUMBER, nullable: true },
          paymentStatus: { type: Type.STRING },
        },
        required: ['accountType', 'creditorName', 'accountStatus', 'balance', 'creditLimit', 'paymentStatus'],
      },
    },
    publicRecords: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING },
          date: { type: Type.STRING },
          description: { type: Type.STRING },
        },
        required: ['type', 'date', 'description'],
      },
    },
    hardInquiries: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          date: { type: Type.STRING },
          creditorName: { type: Type.STRING },
        },
        required: ['date', 'creditorName'],
      },
    },
  },
  required: ['personalInformation', 'creditScore', 'summary', 'accounts', 'publicRecords', 'hardInquiries'],
};


export const analyzeCreditReport = async (reportText: string): Promise<CreditReportData> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: reportText,
      config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json",
          responseSchema: schema,
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as CreditReportData;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get a valid response from the AI model.");
  }
};
