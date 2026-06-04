import apiClient from './client';

export interface ParsedResumeEntity {
  data: string[];
  confidence_scores: number[];
}

export interface ParsedResumeData {
  NAME?: ParsedResumeEntity;
  EMAIL?: ParsedResumeEntity;
  PHONE?: ParsedResumeEntity;
  ADDRESS?: ParsedResumeEntity;
  JOB_TITLE?: ParsedResumeEntity;
  PROFILE?: ParsedResumeEntity;
  SKILL?: ParsedResumeEntity;
  EXP_COMPANY?: ParsedResumeEntity;
  EXP_ROLE?: ParsedResumeEntity;
  EXP_START_DATE?: ParsedResumeEntity;
  EXP_END_DATE?: ParsedResumeEntity;
  EXP_RESPONSIBILITY?: ParsedResumeEntity;
  EDU_SCHOOL?: ParsedResumeEntity;
  EDU_COURSE?: ParsedResumeEntity;
  EDU_START_DATE?: ParsedResumeEntity;
  EDU_END_DATE?: ParsedResumeEntity;
}

export interface ParsedResumeMetadata {
  page_count: number;
  total_words: number;
  average_confidence: number;
  entity_count: number;
}

export interface ParseResumeResponse {
  success: boolean;
  parsed_data: ParsedResumeData;
  metadata: ParsedResumeMetadata;
}

export interface ResumeParserError {
  error: string;
  details?: string;
}

/**
 * Parse a resume PDF file using the backend AI service
 * @param file - The PDF file to parse
 * @param minConfidence - Optional minimum confidence threshold (default: 0.5)
 * @returns Parsed resume data with entities and metadata
 */
export async function parseResume(
  file: File,
  minConfidence: number = 0.5
): Promise<ParseResumeResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('min_confidence', minConfidence.toString());

  const response = await apiClient.request('/candidates/parse-resume/', {
    method: 'POST',
    body: formData,
    skipAuth: false,
  });

  if (!response.ok) {
    const errorData: ResumeParserError = await response.json();
    throw new Error(errorData.error || 'Failed to parse resume');
  }

  return await response.json();
}

/**
 * Map parsed resume data to form field values
 * @param parsedData - The parsed resume data from the API
 * @returns Object with mapped form field values
 */
export interface EducationEntry {
  institution: string;
  course_name: string;
  edu_start_date: string;
  edu_end_date: string;
}

export interface WorkHistoryEntry {
  company: string;
  role: string;
  responsibility: string;
  exp_start_date: string;
  exp_end_date: string;
}

export interface MappedFormFields {
  jobTitle: string;
  company: string;
  experience: string;
  location: string;
  phone: string;
  bio: string;
  skills: string;
  firstName: string;
  lastName: string;
  email: string;
  education: EducationEntry[];
  work_history: WorkHistoryEntry[];
}

function calculateExperienceLevel(expStartDates?: ParsedResumeEntity): string {
  if (!expStartDates?.data?.length) return '';
  const startYear = Number.parseInt(expStartDates.data[0].split('-')[0] || '0');
  if (startYear <= 0) return '';
  const years = new Date().getFullYear() - startYear;
  if (years <= 2) return 'L1';
  if (years <= 4) return 'L2';
  if (years <= 7) return 'L3';
  if (years <= 10) return 'L4';
  return 'L5';
}

function buildEducationList(parsedData: ParsedResumeData): EducationEntry[] {
  const schools = parsedData.EDU_SCHOOL?.data || [];
  const courses = parsedData.EDU_COURSE?.data || [];
  const startDates = parsedData.EDU_START_DATE?.data || [];
  const endDates = parsedData.EDU_END_DATE?.data || [];
  const maxEntries = Math.max(schools.length, courses.length, startDates.length, endDates.length);
  const result: EducationEntry[] = [];
  for (let i = 0; i < maxEntries; i++) {
    if (schools[i] || courses[i]) {
      result.push({
        institution: schools[i] || '',
        course_name: courses[i] || '',
        edu_start_date: startDates[i] || '',
        edu_end_date: endDates[i] || ''
      });
    }
  }
  return result;
}

function buildWorkHistoryList(parsedData: ParsedResumeData): WorkHistoryEntry[] {
  const companies = parsedData.EXP_COMPANY?.data || [];
  const roles = parsedData.EXP_ROLE?.data || [];
  const responsibilities = parsedData.EXP_RESPONSIBILITY?.data || [];
  const startDates = parsedData.EXP_START_DATE?.data || [];
  const endDates = parsedData.EXP_END_DATE?.data || [];
  const maxEntries = Math.max(companies.length, roles.length, startDates.length, endDates.length);
  const result: WorkHistoryEntry[] = [];
  for (let i = 0; i < maxEntries; i++) {
    if (companies[i] || roles[i]) {
      result.push({
        company: companies[i] || '',
        role: roles[i] || '',
        responsibility: responsibilities[i] || '',
        exp_start_date: startDates[i] || '',
        exp_end_date: endDates[i] || ''
      });
    }
  }
  return result;
}

export function mapParsedDataToFormFields(parsedData: ParsedResumeData): MappedFormFields {
  const getFirstValue = (entity?: ParsedResumeEntity): string => entity?.data?.[0] || '';

  const fullName = getFirstValue(parsedData.NAME);
  const nameParts = fullName.split(' ').filter(Boolean);

  return {
    jobTitle: getFirstValue(parsedData.JOB_TITLE),
    company: getFirstValue(parsedData.EXP_COMPANY),
    experience: calculateExperienceLevel(parsedData.EXP_START_DATE),
    location: getFirstValue(parsedData.ADDRESS),
    phone: getFirstValue(parsedData.PHONE),
    bio: getFirstValue(parsedData.PROFILE),
    skills: parsedData.SKILL?.data?.join(', ') || '',
    firstName: nameParts[0] || '',
    lastName: nameParts.slice(1).join(' ') || '',
    email: getFirstValue(parsedData.EMAIL),
    education: buildEducationList(parsedData),
    work_history: buildWorkHistoryList(parsedData),
  };
}
