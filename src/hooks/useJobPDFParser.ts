import { useState, useRef } from 'react';

interface ParsedJobData {
  title: string;
  department: string;
  location: string;
  workArrangement: string;
  employmentType: string;
  salaryMin: string;
  salaryMax: string;
  currency: string;
  experienceLevel: string;
  educationLevel: string;
  summary: string;
  description: string;
  responsibilities: string;
  requirements: string;
  niceToHave: string;
  benefits: string;
  interviewRounds: {
    'phone-screening': number;
    'technical-interview': number;
    'final-interview': number;
  };
}

interface UseJobPDFParserReturn {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  uploadedFile: File | null;
  isParsingPDF: boolean;
  parsedContent: ParsedJobData | null;
  showParsedData: boolean;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  applyParsedData: (onApply: (data: ParsedJobData) => void) => void;
  discardParsedData: () => void;
}

export function useJobPDFParser(): UseJobPDFParserReturn {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isParsingPDF, setIsParsingPDF] = useState(false);
  const [parsedContent, setParsedContent] = useState<ParsedJobData | null>(null);
  const [showParsedData, setShowParsedData] = useState(false);

  const parseJobDescription = async (_file: File) => {
    setIsParsingPDF(true);
    try {
      // Simulate AI parsing of PDF - in real app this would call an AI service
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock parsed content based on PDF
      const mockParsedData: ParsedJobData = {
        title: 'Senior Software Engineer',
        department: 'engineering',
        location: 'Toronto, ON',
        workArrangement: 'hybrid',
        employmentType: 'full-time',
        salaryMin: '120000',
        salaryMax: '160000',
        currency: 'CAD',
        experienceLevel: 'senior',
        educationLevel: 'bachelors',
        summary:
          "We're looking for a Senior Software Engineer to join our growing engineering team and help build scalable solutions.",
        description:
          "Join our dynamic engineering team and contribute to building cutting-edge software solutions. You'll work on challenging projects using modern technologies and collaborate with a talented team of developers.",
        responsibilities:
          '• Lead development of new features and improvements\n• Mentor junior developers and conduct code reviews\n• Collaborate with product managers and designers\n• Ensure code quality and best practices',
        requirements:
          '• 5+ years of software development experience\n• Strong proficiency in React, Node.js, and TypeScript\n• Experience with cloud platforms (AWS, Azure, or GCP)\n• Excellent problem-solving and communication skills',
        niceToHave:
          '• Experience with microservices architecture\n• Previous startup experience\n• Open source contributions\n• Knowledge of DevOps practices',
        benefits:
          '• Competitive salary and equity package\n• Comprehensive health and dental coverage\n• Flexible work arrangements\n• Professional development budget\n• Modern office with free snacks',
        interviewRounds: {
          'phone-screening': 1,
          'technical-interview': 2,
          'final-interview': 1
        }
      };

      setParsedContent(mockParsedData);
      setShowParsedData(true);
    } catch (error) {
      console.error('Error parsing PDF:', error);
    } finally {
      setIsParsingPDF(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file?.type === 'application/pdf') {
      setUploadedFile(file);
      parseJobDescription(file);
    }
  };

  const applyParsedData = (onApply: (data: ParsedJobData) => void) => {
    if (parsedContent) {
      onApply(parsedContent);
      setShowParsedData(false);
    }
  };

  const discardParsedData = () => {
    setParsedContent(null);
    setShowParsedData(false);
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return {
    fileInputRef,
    uploadedFile,
    isParsingPDF,
    parsedContent,
    showParsedData,
    handleFileUpload,
    applyParsedData,
    discardParsedData
  };
}
