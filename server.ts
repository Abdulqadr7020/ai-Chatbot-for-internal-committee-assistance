import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI if key is present
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback intelligent domain engine for ICC / POSH inquiries
function generateDomainFallbackResponse(prompt: string, role: string): string {
  const p = prompt.toLowerCase();

  if (p.includes('anonymous') || p.includes('identity') || p.includes('name')) {
    return `### Confidentiality & Anonymous Reporting

Under the **POSH Act, 2013 (Section 16 & 17)** and ICC guidelines:

1. **Strict Legal Confidentiality**: The identity of the aggrieved person, the respondent, witnesses, and all proceedings of the inquiry are protected by law. Any unauthorized disclosure by company personnel carries severe statutory penalties.
2. **Anonymous Complaints**: While a formal ICC inquiry requires establishing facts and serving a copy of the complaint to the respondent under the principles of *Natural Justice*, many modern organizations accept initial anonymous disclosures. 
3. **How ICC Handles Anonymous Tips**: The Presiding Officer / Committee reviews the information to determine if a preliminary fact-finding inquiry is warranted, or reaches out through a confidential proxy channel.
4. **Protective Measures**: You can request pseudonymization during internal reviews, or specify that your identity only be disclosed to the ICC panel and not to colleagues or department managers.
5. **Zero-Retaliation Policy**: The law and enterprise policy strictly prohibit any adverse employment action, retaliation, or intimidation against anyone reporting misconduct or assisting in an inquiry.`;
  }

  if (p.includes('timeline') || p.includes('time limit') || p.includes('days') || p.includes('how long')) {
    return `### Key ICC Timelines & Deadlines under POSH Act

- **Filing the Complaint (Section 9)**: Within **3 months (90 days)** from the date of the incident (or the date of the last incident in case of a series). 
  *Note:* The ICC can extend this by an additional 3 months (up to 180 days total) if satisfied that circumstances prevented timely filing.
- **Serving Notice to Respondent (Rule 7)**: Within **7 working days** of receiving the complaint, the ICC must send a copy to the respondent.
- **Respondent’s Reply**: The respondent must submit their formal written reply with supporting evidence and list of witnesses within **10 working days**.
- **Completion of Inquiry (Section 11)**: The ICC must conclude its inquiry within **90 calendar days**.
- **Submission of Report (Section 13)**: The ICC must submit its findings and recommendations to the Employer (and both parties) within **10 days** of completing the inquiry.
- **Employer Action (Section 13)**: The employer/management must act on the recommendations within **60 days** of receipt.
- **Appeal Period (Section 18)**: Any party aggrieved by the recommendations or non-implementation can appeal to the appellate authority/court within **90 days**.`;
  }

  if (p.includes('interim') || p.includes('transfer') || p.includes('leave') || p.includes('protection') || p.includes('relief')) {
    return `### Interim Relief & Protection Options (Section 12)

During the pendency of an ICC inquiry, the aggrieved individual can make a written request for interim relief:

1. **Paid Leave**: Leave up to **3 months** over and above standard accrued statutory leaves (this will not be deducted from your regular annual leave balance).
2. **Transfer**: Transfer of either the aggrieved person or the respondent to another department, branch, or office location.
3. **Restraint on Appraisal / Reporting**: Restraining the respondent from supervising, assigning tasks, or evaluating the work performance or confidential reports of the aggrieved person.
4. **Anti-Harassment Restraining Directive**: ICC issues an immediate formal warning to the respondent to cease all direct and indirect contact (physical, messaging, phone, email, or third-party intimidation).
5. **Work-from-Home (WFH) & Flexibility**: Adjustment in working shifts or remote work arrangements to eliminate workplace distress.
6. **Mental Health & Counselling Support**: Access to confidential Employee Assistance Programs (EAP) or specialized psychological counselling funded by the employer.`;
  }

  if (p.includes('conciliation') || p.includes('settlement') || p.includes('informal') || p.includes('mediation')) {
    return `### Conciliation vs. Formal Inquiry (Section 10)

- **Complainant-Led Only**: Conciliation can **only** be initiated if the aggrieved person specifically requests it in writing. The ICC or employer cannot coerce or suggest conciliation against the complainant's wishes.
- **No Monetary Settlement**: The POSH Act explicitly prohibits any monetary settlement or financial compensation as a basis for conciliation.
- **Formal Record**: If settled through conciliation, the ICC records the agreed terms, signs it with both parties, and forwards it to the employer for compliance.
- **No Inquiry Once Settled**: No formal inquiry is conducted after a successful conciliation settlement.
- **Breach of Terms**: If the respondent fails to comply with any agreed term of the conciliation, the ICC will immediately initiate or resume a full formal inquiry.`;
  }

  if (p.includes('evidence') || p.includes('proof') || p.includes('screenshot') || p.includes('witness')) {
    return `### Evidence & Standard of Proof in ICC Proceedings

- **Standard of Proof**: The standard in ICC proceedings is the **"Preponderance of Probability"** (civil standard — more likely than not), **NOT** the criminal standard of "beyond reasonable doubt".
- **Admissible Evidence**:
  * Digital records: WhatsApp/Slack/Teams messages, SMS, emails, call logs, voicemails.
  * Physical records: notes, gifts, letters, diary entries, calendar invites.
  * Electronic trails: badge swipe logs, CCTV footage requests (ask ICC to preserve immediately), shared drive edits.
  * Medical or psychological consultation notes/records.
- **Witnesses**: Colleagues who heard the remarks, witnessed non-verbal gestures, noticed distress immediately afterwards, or to whom you disclosed the incident contemporaneously (doctrine of res gestae).
- **Sole Testimony**: In cases with no third-party witnesses (which is common in harassment behind closed doors), the consistent, credible testimony of the complainant can be sufficient when evaluated contextually with surrounding conduct.`;
  }

  if (role === 'icc_member') {
    return `### ICC Panel Advisory & Procedural Integrity

As an Internal Complaints Committee member, maintain strict adherence to:
1. **Principles of Natural Justice**:
   - *Audi alteram partem* (hear both sides fairly).
   - *Nemo judex in causa sua* (no member with bias or conflict of interest can participate).
2. **Quorum Requirement**: Minimum 3 members must be present for any hearing, including the Presiding Officer and the External Member.
3. **No Legal Practitioners**: Parties are not permitted to bring advocates or lawyers to represent them in ICC hearings (ensuring a non-adversarial, psychologically safe forum).
4. **Recording of Minutes**: Audio/written recording of verbatim statements signed by the deponents on every page.
5. **Cross-Examination**: Cross-examination should be facilitated via written questions or mediated questions by the Committee to prevent re-traumatization of the aggrieved person.`;
  }

  return `### Internal Complaints Committee (ICC) Guidance

Welcome. As an ICC Assistance Advisor, I can help you with:

1. **Understanding Rights & Boundaries**: Clarify what qualifies under harassment laws (verbal, non-verbal, physical, digital, hostile work environment, quid pro quo).
2. **Drafting a Formal Complaint**: Guide you step-by-step through dates, chronologies, witnesses, evidence, and relief requests.
3. **Understanding the Inquiry Lifecycle**: Timelines (90 days for inquiry, 10 days for report, 60 days for action), natural justice rules, and rights during hearings.
4. **Interim Relief Requests**: Applying for protective leaves, team transfers, supervisor reassignments, and no-contact orders.
5. **Conciliation Guidelines**: Clarifying options for amicable resolution without monetary exchange.

Please feel free to describe your situation or ask any specific question. All interactions are strictly confidential and treated with empathy.`;
}

// Route: AI Chat for ICC Assistance
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages, userRole = 'complainant', incidentContext } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const latestMessage = messages[messages.length - 1];
    const userPrompt = latestMessage.text || latestMessage.content || '';

    // System prompt tailored for ICC / POSH guidance
    const systemPrompt = `You are "Sanskriti", an expert, empathetic, legally rigorous, trauma-informed AI advisor for the Internal Complaints Committee (ICC) and workplace grievance redressal under the POSH Act 2013 and workplace ethics policies.

Your primary duty is to provide safe, objective, confidential, and actionable advice to:
- Complainants/Aggrieved individuals: Validate concerns empathetically, explain rights, evidence gathering, conciliation vs formal inquiry, interim relief (leaves, transfers, no-contact directives), timelines (90-day filing, extendable by 3 months), and how to draft a structured complaint.
- ICC Committee Members: Guide on statutory compliance, natural justice principles (notice within 7 days, reply within 10 days, inquiry within 90 days), quorum (min 3 members with Presiding Officer + External member), standard of proof (preponderance of probabilities), witness handling without re-traumatization, balanced report writing.
- Witnesses & Managers: Advice on reporting obligations, zero-retaliation enforcement, immediate duty of care.

Current User Persona/Role: ${userRole.toUpperCase()}
${incidentContext ? `Incident / Context Details provided by user:\n${JSON.stringify(incidentContext, null, 2)}` : ''}

Key Guidelines:
1. Maintain high empathy, dignity, calm tone, and legal clarity.
2. Structure your answers with clear headings, bullet points, and timeline callouts.
3. Remind users of confidentiality protections (POSH Act Section 16/17 forbids disclosing identities or inquiry details).
4. If someone is in immediate physical danger, urge them to contact security, local authorities, or national emergency helplines.
5. Never discourage an aggrieved person from reporting or exercising their statutory rights.`;

    if (aiClient) {
      try {
        // Format previous turns for Gemini SDK
        const contents = messages.map((m: any) => ({
          role: m.role === 'model' || m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.text || m.content || '' }],
        }));

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: contents,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.4,
          },
        });

        const replyText = response.text;
        if (replyText) {
          return res.json({ reply: replyText });
        }
      } catch (geminiError: any) {
        console.warn('Gemini API call failed, using specialized legal engine fallback:', geminiError?.message || geminiError);
      }
    }

    // Fallback if no API key or call failed
    const fallbackText = generateDomainFallbackResponse(userPrompt, userRole);
    return res.json({ reply: fallbackText });
  } catch (error: any) {
    console.error('Error handling chat:', error);
    return res.status(500).json({ error: 'Failed to process request', details: error.message });
  }
});

// Route: Draft Formal ICC Complaint
app.post('/api/draft-complaint', async (req: Request, res: Response) => {
  try {
    const {
      complainantName,
      employeeId,
      department,
      contactEmail,
      respondentName,
      respondentDesignation,
      respondentDepartment,
      incidentTypes = [],
      incidentDates,
      incidentLocations,
      detailedNarrative,
      witnesses = [],
      evidence = [],
      impactDetails,
      requestedRelief = [],
      isAnonymous = false,
    } = req.body;

    const prompt = `Draft a formal, legally structured, dignified, and comprehensive Workplace Sexual Harassment & Grievance Complaint letter to the Internal Complaints Committee (ICC) under Section 9 of the Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013 and Company Code of Conduct.

Details Provided:
- Complainant: ${isAnonymous ? 'Confidential / Anonymous Discloser (via designated proxy)' : `${complainantName || 'Complainant'} (Emp ID: ${employeeId || 'N/A'}, Dept: ${department || 'N/A'}, Contact: ${contactEmail || 'N/A'})`}
- Respondent: ${respondentName || 'Named Respondent'} (Designation: ${respondentDesignation || 'N/A'}, Dept: ${respondentDepartment || 'N/A'})
- Nature of Incidents: ${incidentTypes.join(', ') || 'Workplace Misconduct / Harassment'}
- Chronology & Dates: ${incidentDates || 'Specified below'}
- Location(s): ${incidentLocations || 'Workplace premises & official digital communication channels'}
- Incident Narrative: ${detailedNarrative || 'Detailed account of events'}
- Witnesses: ${witnesses.join('; ') || 'None identified at this time / Colleagues present in vicinity'}
- Evidence Available: ${evidence.join('; ') || 'Digital communications, messages, and witness accounts'}
- Impact on Complainant: ${impactDetails || 'Severe mental distress, intimidation, and hostile working environment'}
- Requested Interim Relief: ${requestedRelief.join('; ') || 'Protective separation and anti-retaliation directives'}

Format Requirements:
1. Formal header addressed to "The Presiding Officer & Members of the Internal Complaints Committee (ICC)".
2. Formal Subject Line referencing Section 9 POSH Act 2013.
3. Complainant details & Respondent profile.
4. Chronological statement of facts with specific dates, places, actions, and verbatim remarks where available.
5. Legal categorization of the conduct (Hostile work environment, unwelcome physical/verbal advances, quid pro quo, or retaliatory harassment).
6. Evidence & Witness Schedule (List A: Digital/Documentary, List B: Witnesses).
7. Impact on Complainant.
8. Prayer / Specific requests for relief:
   a. Formal inquiry under Section 11 of the POSH Act.
   b. Interim relief under Section 12 (leave, transfer, restraint on appraisal/interaction).
   c. Enforcement of confidentiality under Section 16 & zero-retaliation directive.
9. Formal declaration / Statement of truth and signature line.`;

    if (aiClient) {
      try {
        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: 'You are a Senior Legal Specialist in POSH compliance, labor laws, and workplace grievance drafting. Produce a pristine, ready-to-print, formal complaint document.',
            temperature: 0.3,
          },
        });
        if (response.text) {
          return res.json({ complaintDocument: response.text });
        }
      } catch (err) {
        console.warn('Gemini draft failed, using structured template generator:', err);
      }
    }

    // High quality standard structured legal template fallback
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const fallbackComplaint = `FORMAL COMPLAINT OF WORKPLACE HARASSMENT
Under Section 9 of the Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013

Date: ${today}

TO:
The Presiding Officer & Members of the Internal Complaints Committee (ICC)
[Organization Name]

SUBJECT: Formal Complaint against ${respondentName || '[Respondent Name]'} for Workplace Harassment and Request for Immediate Interim Protection and Formal Inquiry

Respected Presiding Officer and Committee Members,

I am writing this formal complaint under Section 9 of the Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013, read alongside the Organization's Anti-Harassment & POSH Policy.

1. PARTICULARS OF THE PARTIES:
   a. Complainant: ${isAnonymous ? 'Confidential Discloser (Identified via Proxy Reference)' : `${complainantName || '[Your Name]'}, Employee ID: ${employeeId || '[ID]'}, Department: ${department || '[Department]'}`}
   b. Respondent: ${respondentName || '[Respondent Name]'}, Designation: ${respondentDesignation || '[Designation]'}, Department: ${respondentDepartment || '[Department]'}

2. NATURE OF COMPLAINT:
   The complaint pertains to: ${incidentTypes.length > 0 ? incidentTypes.join(', ') : 'Unwelcome verbal, non-verbal, and workplace harassment creating a hostile work environment'}.

3. CHRONOLOGY AND PARTICULARS OF INCIDENT(S):
   Dates / Timeline: ${incidentDates || '[Date/Timeline of Incidents]'}
   Location: ${incidentLocations || 'Workplace office premises and company communication platforms'}

   Narrative of Facts:
   ${detailedNarrative || 'On the aforementioned dates, the respondent engaged in unwelcome and impermissible conduct. Despite implicit or explicit disapproval, the behavior continued, thereby creating a hostile and intimidating environment.'}

4. IMPACT AND WORKPLACE DISTRESS:
   ${impactDetails || 'The respondent’s actions have severely disrupted my emotional well-being, sense of security at the workplace, and normal professional productivity.'}

5. WITNESSES:
   The following individuals have direct knowledge of the circumstances, witnessed key interactions, or were contemporaneously informed:
   ${witnesses.length > 0 ? witnesses.map((w: string, i: number) => `   (${i + 1}) ${w}`).join('\n') : '   - Witnesses can be furnished during preliminary hearings.'}

6. EVIDENCE ENCLOSED / TO BE PRESERVED:
   ${evidence.length > 0 ? evidence.map((e: string, i: number) => `   (${i + 1}) ${e}`).join('\n') : '   - Relevant emails, chat transcripts, and records to be submitted.'}

7. PRAYER AND REQUEST FOR RELIEF:
   In light of the above facts, I respectfully request the Internal Complaints Committee to:
   a. Initiate a formal and impartial inquiry into the complaint in accordance with Section 11 of the POSH Act.
   b. Grant immediate Interim Relief under Section 12: ${requestedRelief.length > 0 ? requestedRelief.join(', ') : 'Restraint against respondent from contacting complainant; reassignment of supervisory reporting; paid leave if necessary'}.
   c. Issue an explicit warning to the respondent regarding the zero-tolerance policy against any direct or indirect retaliation.
   d. Ensure strict adherence to statutory confidentiality under Section 16 & 17 of the Act.

STATEMENT OF TRUTH:
I declare that the statements made herein are true to the best of my knowledge, recollection, and belief.

Respectfully submitted,

____________________________
${isAnonymous ? '[Confidential Complainant]' : complainantName || '[Complainant Signature]'}
`;

    return res.json({ complaintDocument: fallbackComplaint });
  } catch (error: any) {
    console.error('Error in draft-complaint:', error);
    return res.status(500).json({ error: 'Failed to generate complaint draft', details: error.message });
  }
});

// Route: Incident Assessment Screener
app.post('/api/assess-incident', async (req: Request, res: Response) => {
  try {
    const { incidentText, relationship, frequency, channel, requestedAction } = req.body;

    const evaluationPrompt = `Analyze the following workplace situation under the Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013 and workplace ethical guidelines:

Incident Description: ${incidentText}
Parties Relationship: ${relationship || 'Colleague / Supervisor / Subordinate'}
Frequency: ${frequency || 'Single / Multiple occasions'}
Communication Channel: ${channel || 'In person / Digital chats / Work calls'}
User Goal: ${requestedAction || 'Guidance on what to do'}

Provide a structured, confidential legal and procedural assessment:
1. Jurisdiction Check: Does this prima facie fall within the purview of ICC / POSH?
2. Misconduct Classification: (e.g. Quid Pro Quo, Hostile Work Environment, Verbal Harassment, Electronic Harassment, Non-verbal gesture, Retaliation).
3. Recommended Redressal Pathway: (Informal discussion, Conciliation under Sec 10, Formal Inquiry under Sec 11, or HR Grievance).
4. Evidence Preservation Recommendations: Specific items to save immediately.
5. Immediate Protective Measures: Recommended interim protections to safeguard the complainant.`;

    if (aiClient) {
      try {
        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: evaluationPrompt,
          config: {
            systemInstruction: 'You are a POSH Compliance Legal Auditor providing an objective, empathetic prima facie assessment of workplace incidents.',
            temperature: 0.3,
          },
        });
        if (response.text) {
          return res.json({ assessment: response.text });
        }
      } catch (e) {
        console.warn('Gemini assessment fallback:', e);
      }
    }

    const fallbackAssessment = `### Prima Facie ICC & Redressal Assessment

1. **Jurisdiction & Applicability**:
   Based on the details provided, the scenario involves conduct within or connected to the workplace (including digital communication channels and official interactions), bringing it prima facie within the scope of the **Internal Complaints Committee (ICC)** under the POSH Act, 2013.

2. **Categorization of Conduct**:
   - The reported behavior constitutes unwelcome conduct of a personal, sexually colored, or hostile nature.
   - If a supervisor or manager conditioned work benefits or implied penalties, it also qualifies as **Quid Pro Quo Harassment**.
   - If pervasive conduct makes the environment intimidating or offensive, it constitutes a **Hostile Work Environment**.

3. **Recommended Immediate Redressal Pathway**:
   - **Formal Complaint to ICC (Section 9)**: Recommended if the behavior is severe, repeated, or involves abuse of authority.
   - **Conciliation (Section 10)**: You may request conciliation if you wish for a formal recorded settlement without a full inquiry (no financial compensation allowed).
   - **Right to File FIR**: If there is physical assault, stalking, or outraging of modesty, you also have the statutory right under Section 19 to request company assistance in filing an FIR under IPC/BNS.

4. **Evidence Preservation Action Plan**:
   - Take uncropped screenshots of text messages, Slack/Teams chats, and email headers.
   - Note down dates, timestamps, exact words spoken, and physical gestures.
   - Identify colleagues who witnessed the interaction or to whom you spoke shortly afterwards.

5. **Interim Safeguards**:
   - Request immediate separation from the respondent (reassignment of reporting lines, change of seating, or remote work).
   - Ask the ICC for an immediate anti-retaliation directive to the respondent.`;

    return res.json({ assessment: fallbackAssessment });
  } catch (error: any) {
    console.error('Error in incident assessment:', error);
    return res.status(500).json({ error: 'Assessment failed', details: error.message });
  }
});

// Mount Vite middleware in dev or static files in production
if (process.env.NODE_ENV !== 'production') {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(port, '0.0.0.0', () => {
  console.log(`ICC Assistant Server is running on http://0.0.0.0:${port}`);
});
