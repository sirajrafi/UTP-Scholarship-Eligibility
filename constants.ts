
import { Scholarship } from './types';

export const PROGRAMMES = [
  "Engineering",
  "Science",
  "Geoscience",
  "Information Technology",
  "Business Management",
  "Applied Chemistry",
  "Other"
];

export const YEARS = [
  "Foundation",
  "Year 1",
  "Year 2",
  "Year 3",
  "Year 4"
];

export const SCHOLARSHIPS: Scholarship[] = [
  {
    id: 'gamuda',
    name: 'Gamuda Scholarship',
    minCgpa: 3.4,
    maxIncome: 6000,
    minCocu: 7,
    allowedYears: ["All"],
    malaysianOnly: true,
    allowedProgrammes: ["Engineering", "Science", "Geoscience", "Information Technology", "Business Management"],
    applicationLink: "https://gamuda.com/yayasan-gamuda/scholarship/"
  },
  {
    id: 'petronas',
    name: 'Petronas Scholarship',
    minCgpa: 3.5,
    maxIncome: 5000,
    minCocu: 8,
    allowedYears: ["Year 1", "Year 2"],
    malaysianOnly: true,
    allowedProgrammes: ["All"],
    applicationLink: "https://educationsponsorship.petronas.com.my/OAS"
  },
  {
    id: 'yayasan-utp',
    name: 'Yayasan UTP',
    minCgpa: 3.5,
    maxIncome: 8000,
    minCocu: 6,
    allowedYears: ["All"],
    malaysianOnly: false,
    allowedProgrammes: ["All"],
    applicationLink: "https://www.utp.edu.my/Pages/The-University/YUTP/Types-of-Funds/Scholarship.aspx"
  },
  {
    id: 'khazanah',
    name: 'Khazanah Scholarship',
    minCgpa: 3.5,
    maxIncome: 7000,
    minCocu: 9,
    allowedYears: ["All"],
    malaysianOnly: true,
    allowedProgrammes: ["All"],
    applicationLink: "https://www.yayasankhazanah.com.my/scholarship-programmes/khazanah-global-scholarship-programme"
  },
  {
    id: 'jpa-pidn',
    name: 'JPA PIDN MARA',
    minCgpa: 3.3,
    maxIncome: undefined, 
    minCocu: 5,
    allowedYears: ["All"],
    malaysianOnly: true,
    allowedProgrammes: ["All"],
    applicationLink: "https://penajaan.jpa.gov.my/index.php/info-penajaan/latihan-sebelum-perkhidmatan/program-pelajar/program-ijazah-dalam-negara-pidn"
  },
  {
    id: 'maxis',
    name: 'Maxis Scholarship',
    minCgpa: 3.5,
    maxIncome: undefined, 
    minCocu: 7,
    allowedYears: ["All"],
    malaysianOnly: true,
    allowedProgrammes: ["Information Technology", "Engineering", "Business Management"],
    applicationLink: "https://www.maxis.com.my/en/about-maxis/career/maxis-scholarship-programme/"
  },
  {
    id: 'mara-tesp',
    name: 'TESP MARA Scholarship',
    minCgpa: 3.3,
    maxIncome: 6000,
    minCocu: 8,
    allowedYears: ["All"],
    malaysianOnly: true,
    allowedProgrammes: ["All"],
    applicationLink: "https://educationloan.mara.gov.my/V4/sa/#/Login"
  }
];