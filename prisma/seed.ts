import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Admin user
  const adminHash = await bcrypt.hash("changeme", 12);
  await prisma.user.upsert({
    where: { email: "admin@election.in" },
    update: {},
    create: {
      email: "admin@election.in",
      name: "Admin",
      passwordHash: adminHash,
      role: "admin",
      state: "Delhi",
      voterType: "returning",
    },
  });

  // Eligibility rules
  const rules = [
    {
      region: "INDIA",
      rulesJson: {
        voting_age: 18,
        citizenship_required: true,
        id_accepted: ["Voter ID Card", "Aadhaar", "PAN Card", "Passport", "MNREGA Job Card", "Bank Passbook with Photo"],
        disqualifiers: ["not_citizen", "under_18", "disqualified_by_court", "unsound_mind"],
        registration_deadline_days_before_election: 25,
        registration_url: "https://voters.eci.gov.in",
        help_url: "https://eci.gov.in/voter-helpline",
      },
    },
    {
      region: "Maharashtra",
      rulesJson: {
        voting_age: 18,
        citizenship_required: true,
        id_accepted: ["Voter ID Card", "Aadhaar", "PAN Card", "Passport"],
        disqualifiers: ["not_citizen", "under_18", "disqualified_by_court"],
        registration_deadline_days_before_election: 25,
        registration_url: "https://ceo.maharashtra.gov.in",
        special_provisions: { nri_voting: "NRIs can vote in person with passport at registered constituency" },
      },
    },
    {
      region: "Rajasthan",
      rulesJson: {
        voting_age: 18,
        citizenship_required: true,
        id_accepted: ["Voter ID Card", "Aadhaar", "PAN Card", "Passport", "MNREGA Job Card"],
        disqualifiers: ["not_citizen", "under_18", "disqualified_by_court"],
        registration_deadline_days_before_election: 25,
        registration_url: "https://ceorajasthan.nic.in",
      },
    },
    {
      region: "Tamil Nadu",
      rulesJson: {
        voting_age: 18,
        citizenship_required: true,
        id_accepted: ["Voter ID Card", "Aadhaar", "PAN Card", "Passport"],
        disqualifiers: ["not_citizen", "under_18", "disqualified_by_court"],
        registration_deadline_days_before_election: 25,
        registration_url: "https://www.elections.tn.gov.in",
      },
    },
    {
      region: "Uttar Pradesh",
      rulesJson: {
        voting_age: 18,
        citizenship_required: true,
        id_accepted: ["Voter ID Card", "Aadhaar", "PAN Card", "Passport", "MNREGA Job Card"],
        disqualifiers: ["not_citizen", "under_18", "disqualified_by_court"],
        registration_deadline_days_before_election: 25,
        registration_url: "https://ceouttarpradesh.nic.in",
      },
    },
  ];

  for (const rule of rules) {
    await prisma.eligibilityRule.upsert({
      where: { region: rule.region },
      update: { rulesJson: rule.rulesJson },
      create: rule,
    });
  }

  // Election phases
  const phases = [
    {
      phaseKey: "notification",
      phaseNumber: 1,
      title: "Election Notification",
      shortDescription: "ECI issues formal notification announcing election schedule",
      fullDescription: "The Election Commission of India issues the official notification under Section 30 of the Representation of the People Act, 1951. This sets the election schedule in motion and triggers the Model Code of Conduct.",
      authoritiesInvolved: ["Election Commission of India", "President of India", "Governor"],
      legalBasis: "RPA 1951, Section 30",
      realWorldExample: "In 2024 Lok Sabha elections, ECI announced the schedule on March 16, 2024 with 7 phases.",
      iconName: "bell",
      colorHex: "#6366f1",
    },
    {
      phaseKey: "mcc",
      phaseNumber: 2,
      title: "Model Code of Conduct",
      shortDescription: "MCC comes into force — restricts government action",
      fullDescription: "The Model Code of Conduct (MCC) is a set of guidelines issued by the ECI for political parties and candidates. It kicks in from the date of announcement and remains in force until the conclusion of election process. Government cannot announce new schemes or make transfers during this period.",
      authoritiesInvolved: ["Election Commission of India", "All Political Parties", "Government Ministries"],
      legalBasis: "ECI Advisory, Article 324",
      realWorldExample: "MCC was enforced from March 16, 2024 until June 4, 2024 (results day) for Lok Sabha 2024.",
      iconName: "shield",
      colorHex: "#f59e0b",
    },
    {
      phaseKey: "nominations",
      phaseNumber: 3,
      title: "Filing of Nominations",
      shortDescription: "Candidates file nomination papers with Returning Officer",
      fullDescription: "Candidates intending to contest elections must file nomination papers before the Returning Officer within the prescribed time. Each nomination must be accompanied by a security deposit and supported by at least one elector from the constituency.",
      authoritiesInvolved: ["Returning Officer", "District Magistrate", "Candidates"],
      legalBasis: "RPA 1951, Sections 33-35",
      realWorldExample: "For Phase 1 of Lok Sabha 2024, nominations were filed between March 20-27, 2024.",
      iconName: "file-text",
      colorHex: "#10b981",
    },
    {
      phaseKey: "scrutiny",
      phaseNumber: 4,
      title: "Scrutiny & Withdrawal",
      shortDescription: "Returning Officer scrutinizes nominations; candidates may withdraw",
      fullDescription: "The Returning Officer scrutinizes all nomination papers for validity. Candidates have the option to withdraw their candidature within a specified period after scrutiny. Final list of contesting candidates is published after the withdrawal deadline.",
      authoritiesInvolved: ["Returning Officer", "Election Commission of India"],
      legalBasis: "RPA 1951, Sections 36-37",
      realWorldExample: "Scrutiny for Phase 1 Lok Sabha 2024 was held on March 28, 2024.",
      iconName: "search",
      colorHex: "#3b82f6",
    },
    {
      phaseKey: "campaigning",
      phaseNumber: 5,
      title: "Election Campaigning",
      shortDescription: "Candidates campaign across constituencies; MCC strictly enforced",
      fullDescription: "The campaign period allows candidates and parties to reach out to voters through rallies, door-to-door canvassing, and media. Campaigning must stop 48 hours before polling (silent period). Paid news and illegal inducements are monitored by ECI flying squads.",
      authoritiesInvolved: ["Election Commission of India", "Political Parties", "Media Certification Committees"],
      legalBasis: "RPA 1951, Section 126 (silent period)",
      realWorldExample: "PM Modi addressed over 200 rallies across India during the 2024 campaign period.",
      iconName: "megaphone",
      colorHex: "#ec4899",
    },
    {
      phaseKey: "polling",
      phaseNumber: 6,
      title: "Polling Day",
      shortDescription: "Voters cast their votes at designated booths using EVMs",
      fullDescription: "On polling day, voters visit their designated polling stations (assigned by EPIC number) to cast votes using Electronic Voting Machines (EVMs). Voter Verifiable Paper Audit Trail (VVPAT) machines provide a paper receipt for verification. Polling hours are typically 7 AM to 6 PM.",
      authoritiesInvolved: ["Presiding Officer", "Polling Officers", "Central Armed Police Forces", "Micro-observers"],
      legalBasis: "RPA 1951, Section 62; Conduct of Election Rules 1961",
      realWorldExample: "Lok Sabha 2024 Phase 1 saw 66.14% turnout across 102 constituencies on April 19, 2024.",
      iconName: "vote",
      colorHex: "#8b5cf6",
    },
    {
      phaseKey: "counting",
      phaseNumber: 7,
      title: "Counting of Votes",
      shortDescription: "Votes counted at designated counting centres under strict vigilance",
      fullDescription: "Vote counting takes place at designated counting centres on the declared counting day. EVMs are opened and votes tallied round by round. Postal ballots are counted first. Returning Officers declare results constituency-wise as each count concludes.",
      authoritiesInvolved: ["Returning Officer", "Counting Supervisors", "Election Commission Observers"],
      legalBasis: "Conduct of Elections Rules 1961, Rule 56",
      realWorldExample: "Counting for all 543 Lok Sabha seats was held on June 4, 2024.",
      iconName: "calculator",
      colorHex: "#14b8a6",
    },
    {
      phaseKey: "results",
      phaseNumber: 8,
      title: "Declaration of Results",
      shortDescription: "Winners declared; elected members notified to take oath",
      fullDescription: "Once all votes are counted, the Returning Officer declares the winning candidate. The result is transmitted to ECI and published in the official gazette. Elected members receive formal notification and proceed to take oath before the Speaker/President.",
      authoritiesInvolved: ["Returning Officer", "Election Commission of India", "President of India", "Speaker of Lok Sabha"],
      legalBasis: "RPA 1951, Section 67A; Constitution Article 99",
      realWorldExample: "BJP-led NDA won 293 seats in Lok Sabha 2024. Results declared June 4, 2024.",
      iconName: "trophy",
      colorHex: "#f97316",
    },
  ];

  for (const phase of phases) {
    await prisma.electionPhase.upsert({
      where: { phaseKey: phase.phaseKey },
      update: phase,
      create: phase,
    });
  }

  // Election timeline — 2024 Lok Sabha
  const timelineData = [
    { state: "NATIONAL", electionCycle: "Lok Sabha 2024", phaseName: "Schedule Announcement", phaseNumber: 1, startDate: new Date("2024-03-16"), endDate: new Date("2024-03-16"), description: "ECI announced 7-phase election schedule", isCurrent: false },
    { state: "NATIONAL", electionCycle: "Lok Sabha 2024", phaseName: "Phase 1 Polling", phaseNumber: 2, startDate: new Date("2024-04-19"), endDate: new Date("2024-04-19"), description: "102 constituencies across 21 states", isCurrent: false },
    { state: "NATIONAL", electionCycle: "Lok Sabha 2024", phaseName: "Phase 2 Polling", phaseNumber: 3, startDate: new Date("2024-04-26"), endDate: new Date("2024-04-26"), description: "89 constituencies across 13 states", isCurrent: false },
    { state: "NATIONAL", electionCycle: "Lok Sabha 2024", phaseName: "Phase 3 Polling", phaseNumber: 4, startDate: new Date("2024-05-07"), endDate: new Date("2024-05-07"), description: "94 constituencies across 12 states", isCurrent: false },
    { state: "NATIONAL", electionCycle: "Lok Sabha 2024", phaseName: "Phase 4 Polling", phaseNumber: 5, startDate: new Date("2024-05-13"), endDate: new Date("2024-05-13"), description: "96 constituencies across 10 states", isCurrent: false },
    { state: "NATIONAL", electionCycle: "Lok Sabha 2024", phaseName: "Phase 5 Polling", phaseNumber: 6, startDate: new Date("2024-05-20"), endDate: new Date("2024-05-20"), description: "49 constituencies across 8 states", isCurrent: false },
    { state: "NATIONAL", electionCycle: "Lok Sabha 2024", phaseName: "Phase 6 Polling", phaseNumber: 7, startDate: new Date("2024-05-25"), endDate: new Date("2024-05-25"), description: "58 constituencies across 7 states", isCurrent: false },
    { state: "NATIONAL", electionCycle: "Lok Sabha 2024", phaseName: "Phase 7 Polling", phaseNumber: 8, startDate: new Date("2024-06-01"), endDate: new Date("2024-06-01"), description: "57 constituencies across 8 states", isCurrent: false },
    { state: "NATIONAL", electionCycle: "Lok Sabha 2024", phaseName: "Vote Counting & Results", phaseNumber: 9, startDate: new Date("2024-06-04"), endDate: new Date("2024-06-04"), description: "Counting for all 543 seats. NDA wins 293 seats.", isCurrent: false },
    // Next election (upcoming)
    { state: "NATIONAL", electionCycle: "Lok Sabha 2029", phaseName: "Voter Registration Open", phaseNumber: 1, startDate: new Date("2028-01-01"), endDate: new Date("2029-01-31"), description: "Continuous voter registration via voters.eci.gov.in", isCurrent: true },
  ];

  for (const t of timelineData) {
    await prisma.electionTimeline.create({ data: t }).catch(() => {});
  }

  // Polling stations — realistic Indian booth data
  const booths = [
    { name: "Government Primary School, Connaught Place", address: "Block A, Connaught Place, New Delhi 110001", state: "Delhi", district: "Central Delhi", constituency: "New Delhi", latitude: 28.6315, longitude: 77.2167, isWheelchairAccessible: true, boothNumber: "NDE-001", totalVoters: 1200 },
    { name: "Municipal Corporation Office, Karol Bagh", address: "Pusa Road, Karol Bagh, New Delhi 110005", state: "Delhi", district: "West Delhi", constituency: "Karol Bagh", latitude: 28.6520, longitude: 77.1897, isWheelchairAccessible: false, boothNumber: "WDE-045", totalVoters: 980 },
    { name: "Rajkiya Sarvodaya Vidyalaya, Lajpat Nagar", address: "Ring Road, Lajpat Nagar, New Delhi 110024", state: "Delhi", district: "South Delhi", constituency: "Greater Kailash", latitude: 28.5676, longitude: 77.2340, isWheelchairAccessible: true, boothNumber: "SDE-112", totalVoters: 1450 },
    { name: "DAV Public School, Rohini", address: "Sector 14, Rohini, Delhi 110085", state: "Delhi", district: "North West Delhi", constituency: "Rohini", latitude: 28.7451, longitude: 77.0771, isWheelchairAccessible: true, boothNumber: "NWD-078", totalVoters: 1100 },
    { name: "Kendriya Vidyalaya, Janakpuri", address: "Block C, Janakpuri, New Delhi 110058", state: "Delhi", district: "West Delhi", constituency: "Janakpuri", latitude: 28.6219, longitude: 77.0878, isWheelchairAccessible: false, boothNumber: "WDE-091", totalVoters: 870 },
    { name: "BMC School, Andheri East", address: "J.B. Nagar, Andheri East, Mumbai 400059", state: "Maharashtra", district: "Mumbai Suburban", constituency: "Andheri East", latitude: 19.1136, longitude: 72.8697, isWheelchairAccessible: true, boothNumber: "MUM-234", totalVoters: 1350 },
    { name: "Marathi Shala, Dadar", address: "Dadar West, Mumbai 400028", state: "Maharashtra", district: "Mumbai City", constituency: "Dadar", latitude: 19.0221, longitude: 72.8437, isWheelchairAccessible: false, boothNumber: "MUM-156", totalVoters: 1050 },
    { name: "Govt Higher Secondary School, T Nagar", address: "Pondy Bazaar, T Nagar, Chennai 600017", state: "Tamil Nadu", district: "Chennai", constituency: "T Nagar", latitude: 13.0418, longitude: 80.2341, isWheelchairAccessible: true, boothNumber: "CHN-067", totalVoters: 1180 },
    { name: "Corporation School, Adyar", address: "LB Road, Adyar, Chennai 600020", state: "Tamil Nadu", district: "Chennai", constituency: "Adyar", latitude: 13.0012, longitude: 80.2565, isWheelchairAccessible: true, boothNumber: "CHN-089", totalVoters: 990 },
    { name: "Govt Boys School, MG Road", address: "MG Road, Bangalore 560001", state: "Karnataka", district: "Bangalore Urban", constituency: "Bangalore Central", latitude: 12.9716, longitude: 77.6099, isWheelchairAccessible: true, boothNumber: "BLR-023", totalVoters: 1400 },
    { name: "Primary School, Indiranagar", address: "100 Feet Road, Indiranagar, Bangalore 560038", state: "Karnataka", district: "Bangalore Urban", constituency: "Bangalore East", latitude: 12.9784, longitude: 77.6408, isWheelchairAccessible: false, boothNumber: "BLR-145", totalVoters: 1200 },
    { name: "Govt Inter College, Hazratganj", address: "Hazratganj, Lucknow 226001", state: "Uttar Pradesh", district: "Lucknow", constituency: "Lucknow", latitude: 26.8467, longitude: 80.9462, isWheelchairAccessible: true, boothNumber: "LKO-034", totalVoters: 1100 },
    { name: "Primary Vidyalaya, Gomti Nagar", address: "Viraj Khand, Gomti Nagar, Lucknow 226010", state: "Uttar Pradesh", district: "Lucknow", constituency: "Lucknow East", latitude: 26.8553, longitude: 81.0025, isWheelchairAccessible: false, boothNumber: "LKO-067", totalVoters: 950 },
    { name: "Govt School, Baner", address: "Baner Road, Pune 411045", state: "Maharashtra", district: "Pune", constituency: "Pune North", latitude: 18.5679, longitude: 73.7897, isWheelchairAccessible: true, boothNumber: "PUN-112", totalVoters: 1300 },
    { name: "Municipal School, Koramangala", address: "80 Feet Road, Koramangala, Bangalore 560034", state: "Karnataka", district: "Bangalore Urban", constituency: "Bangalore South", latitude: 12.9352, longitude: 77.6245, isWheelchairAccessible: true, boothNumber: "BLR-201", totalVoters: 1150 },
  ];

  for (const booth of booths) {
    await prisma.pollingStation.create({ data: booth }).catch(() => {});
  }

  // Election steps
  const steps = [
    { state: "ALL", voterType: "first_time", stepNumber: 1, title: "Check Your Eligibility", description: "Confirm you are 18+ years old, an Indian citizen, and not disqualified by a court. Use our eligibility checker to verify instantly.", officialUrl: "https://voters.eci.gov.in", deadlineLabel: "Before registration" },
    { state: "ALL", voterType: "first_time", stepNumber: 2, title: "Gather Required Documents", description: "Collect proof of age (birth certificate, Class 10 marksheet), proof of address (Aadhaar, utility bill), and one passport-size photograph.", officialUrl: "https://eci.gov.in/voter/voter-id-card/", deadlineLabel: "Before applying" },
    { state: "ALL", voterType: "first_time", stepNumber: 3, title: "Register as a Voter (Form 6)", description: "Apply online at voters.eci.gov.in or visit your nearest ERO/AERO office. Fill Form 6 (for new registration). Online process takes ~10 minutes.", officialUrl: "https://voters.eci.gov.in/register-as-voter", deadlineLabel: "25 days before election" },
    { state: "ALL", voterType: "first_time", stepNumber: 4, title: "Track Your Application", description: "Use your reference number to track application status at voters.eci.gov.in/track-application. Verification usually takes 2-4 weeks.", officialUrl: "https://voters.eci.gov.in/track-application", deadlineLabel: "Within 4 weeks" },
    { state: "ALL", voterType: "first_time", stepNumber: 5, title: "Download Your Voter ID (EPIC)", description: "Once approved, download your e-EPIC (digital voter ID) from voters.eci.gov.in. You can also use Aadhaar or PAN at the booth.", officialUrl: "https://voters.eci.gov.in/e-epic", deadlineLabel: "After approval" },
    { state: "ALL", voterType: "first_time", stepNumber: 6, title: "Find Your Polling Booth", description: "Use the booth finder on this platform or voters.eci.gov.in to locate your assigned polling station. Note the booth number on your voter ID slip.", officialUrl: "https://voters.eci.gov.in/pollingstation", deadlineLabel: "1 week before election" },
    { state: "ALL", voterType: "first_time", stepNumber: 7, title: "Vote on Election Day!", description: "Carry one approved photo ID. Visit your booth between 7 AM and 6 PM. Follow the queue, verify your name, receive the ballot slip, and cast your vote on the EVM. Ink mark on finger confirms your vote.", officialUrl: "https://eci.gov.in", deadlineLabel: "Election day" },
    { state: "ALL", voterType: "returning", stepNumber: 1, title: "Verify Your Name on Electoral Roll", description: "Search for your name at voters.eci.gov.in/search-your-name. If found and details are correct, you're ready to vote.", officialUrl: "https://voters.eci.gov.in/search-your-name", deadlineLabel: "1 month before election" },
    { state: "ALL", voterType: "returning", stepNumber: 2, title: "Update Details if Needed (Form 8)", description: "If your address, name, or photo needs updating, file Form 8 online at voters.eci.gov.in. Changes take 2-3 weeks to reflect.", officialUrl: "https://voters.eci.gov.in/correction-in-entries", deadlineLabel: "30 days before election" },
    { state: "ALL", voterType: "returning", stepNumber: 3, title: "Find Your Polling Booth", description: "Your polling booth may have changed. Re-confirm your booth using our Booth Finder or at voters.eci.gov.in/pollingstation.", officialUrl: "https://voters.eci.gov.in/pollingstation", deadlineLabel: "1 week before election" },
    { state: "ALL", voterType: "returning", stepNumber: 4, title: "Vote on Election Day!", description: "Carry one approved photo ID (Voter ID, Aadhaar, PAN, Passport, etc.). Vote at your designated booth between 7 AM and 6 PM.", officialUrl: "https://eci.gov.in", deadlineLabel: "Election day" },
  ];

  for (const step of steps) {
    await prisma.electionStep.create({ data: step }).catch(() => {});
  }

  // Analytics data — 2014, 2019, 2024 Lok Sabha
  const analytics = [
    { state: "Maharashtra", year: 2024, electionType: "Lok Sabha", eligibleVoters: 91000000n, registeredVoters: 89000000n, votesCast: 54000000n, turnoutPercentage: 60.67 },
    { state: "Maharashtra", year: 2019, electionType: "Lok Sabha", eligibleVoters: 87000000n, registeredVoters: 85000000n, votesCast: 51000000n, turnoutPercentage: 60.0 },
    { state: "Maharashtra", year: 2014, electionType: "Lok Sabha", eligibleVoters: 83000000n, registeredVoters: 81000000n, votesCast: 48000000n, turnoutPercentage: 59.26 },
    { state: "Uttar Pradesh", year: 2024, electionType: "Lok Sabha", eligibleVoters: 151000000n, registeredVoters: 149000000n, votesCast: 84000000n, turnoutPercentage: 57.79 },
    { state: "Uttar Pradesh", year: 2019, electionType: "Lok Sabha", eligibleVoters: 146000000n, registeredVoters: 143000000n, votesCast: 85000000n, turnoutPercentage: 59.11 },
    { state: "Uttar Pradesh", year: 2014, electionType: "Lok Sabha", eligibleVoters: 139000000n, registeredVoters: 136000000n, votesCast: 78000000n, turnoutPercentage: 57.56 },
    { state: "Tamil Nadu", year: 2024, electionType: "Lok Sabha", eligibleVoters: 61000000n, registeredVoters: 60000000n, votesCast: 43000000n, turnoutPercentage: 71.77 },
    { state: "Tamil Nadu", year: 2019, electionType: "Lok Sabha", eligibleVoters: 59000000n, registeredVoters: 58000000n, votesCast: 42000000n, turnoutPercentage: 72.41 },
    { state: "Tamil Nadu", year: 2014, electionType: "Lok Sabha", eligibleVoters: 57000000n, registeredVoters: 56000000n, votesCast: 40000000n, turnoutPercentage: 73.67 },
    { state: "Karnataka", year: 2024, electionType: "Lok Sabha", eligibleVoters: 53000000n, registeredVoters: 52000000n, votesCast: 33000000n, turnoutPercentage: 69.42 },
    { state: "Karnataka", year: 2019, electionType: "Lok Sabha", eligibleVoters: 51000000n, registeredVoters: 50000000n, votesCast: 34000000n, turnoutPercentage: 68.0 },
    { state: "Delhi", year: 2024, electionType: "Lok Sabha", eligibleVoters: 15000000n, registeredVoters: 14800000n, votesCast: 9400000n, turnoutPercentage: 63.51 },
    { state: "Delhi", year: 2019, electionType: "Lok Sabha", eligibleVoters: 14200000n, registeredVoters: 14000000n, votesCast: 8960000n, turnoutPercentage: 64.0 },
    { state: "Rajasthan", year: 2024, electionType: "Lok Sabha", eligibleVoters: 51000000n, registeredVoters: 50000000n, votesCast: 32000000n, turnoutPercentage: 64.0 },
    { state: "West Bengal", year: 2024, electionType: "Lok Sabha", eligibleVoters: 75000000n, registeredVoters: 73000000n, votesCast: 60000000n, turnoutPercentage: 80.0 },
    { state: "West Bengal", year: 2019, electionType: "Lok Sabha", eligibleVoters: 72000000n, registeredVoters: 70000000n, votesCast: 57000000n, turnoutPercentage: 81.43 },
  ];

  for (const a of analytics) {
    await prisma.analyticsData.upsert({
      where: { state_year_electionType: { state: a.state, year: a.year, electionType: a.electionType } },
      update: {},
      create: a,
    });
  }

  console.log("✅ Seed complete!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
