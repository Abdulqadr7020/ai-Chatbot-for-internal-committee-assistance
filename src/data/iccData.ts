import { LegalFAQ, TimelineStage, DocumentTemplate } from '../types';

export const EMERGENCY_CONTACTS = [
  {
    name: 'National Commission for Women (NCW) 24x7 Helpline',
    number: '7827170170',
    type: 'National Statutory Support',
    description: 'Round-the-clock national helpline for women in distress or facing workplace harassment.',
  },
  {
    name: 'Women in Distress National Emergency',
    number: '1091',
    type: 'Police & Emergency Assistance',
    description: 'Direct national emergency police dispatch for immediate safety concerns.',
  },
  {
    name: 'National Emergency Number',
    number: '112',
    type: 'Unified Emergency Services',
    description: 'Immediate police, medical, and ambulance response.',
  },
  {
    name: 'Internal Complaints Committee (Company ICC Desk)',
    number: 'icc-helpdesk@organization.internal',
    type: 'Confidential Internal Channel',
    description: 'Direct, encrypted email channel routed solely to the Presiding Officer & Committee Members.',
  },
  {
    name: 'Confidential Employee Assistance Program (EAP)',
    number: '1800-EAP-CARE (Toll Free)',
    type: 'Psychological & Emotional Support',
    description: 'Independent licensed therapists available 24/7 for trauma counselling and confidential guidance.',
  },
];

export const TIMELINE_STAGES: TimelineStage[] = [
  {
    id: 'stage-1',
    dayRange: 'Day 0 to Day 90',
    title: 'Incident Occurrence & Complaint Filing',
    statutoryReference: 'Section 9(1), POSH Act 2013',
    description: 'The complaint must be filed within 3 months (90 days) from the date of the incident or last incident in a series.',
    partiesInvolved: ['Aggrieved Person', 'ICC Presiding Officer'],
    criticalRules: [
      'ICC has discretion to extend by another 3 months (total 180 days) if satisfied with reasons for delay.',
      'Must be in writing. If the aggrieved person cannot write, ICC members must provide all reasonable assistance.',
      '6 copies of the complaint along with supporting documents and witness lists are customarily submitted (or encrypted digital equivalent).',
    ],
  },
  {
    id: 'stage-2',
    dayRange: 'Day 1 to Day 7',
    title: 'Notice & Service to Respondent',
    statutoryReference: 'Rule 7(1), POSH Rules 2013',
    description: 'Within 7 working days of receiving the complaint, the ICC must serve a formal notice and a copy of the complaint to the respondent.',
    partiesInvolved: ['ICC Committee', 'Respondent'],
    criticalRules: [
      'Respondent is informed of the allegations and furnished with copies of documents.',
      'No contact or intimidation directive is immediately enforced against the respondent.',
    ],
  },
  {
    id: 'stage-3',
    dayRange: 'Day 8 to Day 17',
    title: 'Respondent Written Reply',
    statutoryReference: 'Rule 7(2), POSH Rules 2013',
    description: 'The respondent must file a formal written response to the allegations with supporting evidence and list of witnesses within 10 working days.',
    partiesInvolved: ['Respondent', 'ICC Committee'],
    criticalRules: [
      'Failure to respond within time can lead to ex-parte proceedings after a minimum 15-day prior notice.',
      'A copy of the respondent’s reply is shared with the complainant.',
    ],
  },
  {
    id: 'stage-4',
    dayRange: 'Optional Window',
    title: 'Conciliation (Only on Complainant Request)',
    statutoryReference: 'Section 10, POSH Act 2013',
    description: 'Before initiating inquiry, the ICC may, at the written request of the aggrieved person, take steps to settle the matter through conciliation.',
    partiesInvolved: ['Aggrieved Person', 'Respondent', 'ICC Facilitator'],
    criticalRules: [
      'NO monetary settlement can be made as a basis of conciliation.',
      'Terms are documented and signed by both parties and forwarded to the employer.',
      'If respondent breaches any conciliation condition, formal inquiry is immediately launched.',
    ],
  },
  {
    id: 'stage-5',
    dayRange: 'Throughout Inquiry',
    title: 'Interim Relief Recommendation',
    statutoryReference: 'Section 12, POSH Act 2013',
    description: 'During pendency of the inquiry, the ICC may recommend immediate protective interim orders to the employer.',
    partiesInvolved: ['Aggrieved Person', 'ICC', 'Employer'],
    criticalRules: [
      'Paid leave up to 3 months (over and above standard statutory leaves).',
      'Transfer of either the aggrieved person or respondent to another workplace/department.',
      'Restraining the respondent from reporting on or evaluating the complainant’s work.',
    ],
  },
  {
    id: 'stage-6',
    dayRange: 'Within 90 Days',
    title: 'Inquiry Proceedings & Witness Examination',
    statutoryReference: 'Section 11, POSH Act 2013',
    description: 'Full formal inquiry conducted adhering strictly to Natural Justice principles. Quorum of at least 3 members (including Presiding Officer & External Member).',
    partiesInvolved: ['ICC Panel', 'Complainant', 'Respondent', 'Witnesses'],
    criticalRules: [
      'No legal practitioners/lawyers allowed to represent either party.',
      'Cross-examination can be routed through the Committee to avoid re-traumatization.',
      'Standard of proof: Preponderance of probability (civil standard).',
    ],
  },
  {
    id: 'stage-7',
    dayRange: 'Within 10 Days of Completion',
    title: 'Inquiry Report & Recommendations',
    statutoryReference: 'Section 13, POSH Act 2013',
    description: 'ICC provides a detailed written report with findings, reasoning, and disciplinary recommendations to both the employer and both parties.',
    partiesInvolved: ['ICC Panel', 'Employer', 'Parties'],
    criticalRules: [
      'If allegations are substantiated, ICC recommends service rules penalties (written apology, reprimand, withholding promotion/increment, termination, financial deduction).',
      'If allegations are not substantiated, no action is taken against complainant unless malicious intent with forged evidence is proven.',
    ],
  },
  {
    id: 'stage-8',
    dayRange: 'Within 60 Days of Report',
    title: 'Employer Implementation & Action',
    statutoryReference: 'Section 13(4), POSH Act 2013',
    description: 'The employer or district officer must implement the recommendations of the ICC within 60 days of receiving the report.',
    partiesInvolved: ['Employer', 'Disciplinary Authority'],
    criticalRules: [
      'Compliance report must be issued by the management.',
      'Parties have 90 days to file an appeal before the statutory appellate authority if aggrieved.',
    ],
  },
];

export const LEGAL_FAQS: LegalFAQ[] = [
  {
    id: 'faq-1',
    category: 'Definitions',
    question: 'What behaviors legally qualify as Sexual Harassment at workplace?',
    sectionRef: 'Section 2(n) & Section 3, POSH Act 2013',
    shortAnswer: 'Any unwelcome physical, verbal, non-verbal, or digital sexual conduct, or creating a hostile environment.',
    detailedExplanation: `Under Section 2(n), sexual harassment includes any one or more of the following unwelcome acts or behavior (whether directly or by implication):
1. Physical contact and advances.
2. A demand or request for sexual favors (Quid Pro Quo).
3. Making sexually colored remarks or off-color jokes.
4. Showing pornography or unsolicited suggestive media.
5. Any other unwelcome physical, verbal, or non-verbal conduct of a sexual nature.

Furthermore, Section 3 specifies that implied or explicit promises of preferential treatment, threats of detrimental treatment, or creating an intimidating, offensive, or hostile work environment also constitute sexual harassment.`,
  },
  {
    id: 'faq-2',
    category: 'Confidentiality',
    question: 'Can my identity or complaint details be leaked or published?',
    sectionRef: 'Section 16 & 17, POSH Act 2013',
    shortAnswer: 'Strictly prohibited by law. Violators face monetary penalties and disciplinary termination.',
    detailedExplanation: `Section 16 strictly prohibits the publication or making known to the public, press, or social media:
- The contents of the complaint.
- The identity and address of the aggrieved woman, respondent, and witnesses.
- Any information relating to conciliation and inquiry proceedings or recommendations of the ICC.

Under Section 17, any person (including committee members, HR, or witnesses) who breaches confidentiality is liable to statutory penalties and service disciplinary action under service rules.`,
  },
  {
    id: 'faq-3',
    category: 'Timelines',
    question: 'What is the limitation period for filing an ICC complaint?',
    sectionRef: 'Section 9(1), POSH Act 2013',
    shortAnswer: 'Within 3 months (90 days) from the last incident, extendable by another 3 months.',
    detailedExplanation: `The complaint should normally be filed within 3 months of the date of the incident. In cases involving a continuous series of incidents, the 3 months runs from the date of the LAST incident.

The ICC is empowered to extend this time limit by up to an additional 3 months if it is satisfied that grave circumstances (such as trauma, physical disability, fear of reprisal, or medical treatment) prevented the complainant from filing earlier.`,
  },
  {
    id: 'faq-4',
    category: 'Interim Relief',
    question: 'What immediate protection can I ask for while the inquiry is ongoing?',
    sectionRef: 'Section 12, POSH Act 2013',
    shortAnswer: 'Up to 3 months paid leave, department/office transfer, and supervisor reassignment.',
    detailedExplanation: `During the pendency of the inquiry, on a written request by the aggrieved woman, the ICC can recommend to the employer:
- Granting paid leave up to 3 months (this leave is additional to regular earned/sick leaves and will not be deducted).
- Transferring the complainant or the respondent to any other workplace or office.
- Restraining the respondent from reporting on the complainant's work performance or writing confidential appraisal reports.
- Ordering the respondent to strictly avoid all direct and indirect contact.`,
  },
  {
    id: 'faq-5',
    category: 'Inquiry Process',
    question: 'What happens if there are no witnesses or physical proof?',
    sectionRef: 'Section 11, POSH Act 2013 & Supreme Court Jurisprudence',
    shortAnswer: 'The standard of proof is "Preponderance of Probability". The complainant’s consistent testimony is given vital weight.',
    detailedExplanation: `Harassment often takes place in private spaces without eyewitnesses. The legal standard applied by the ICC is the civil standard of 'Preponderance of Probability' (is it more likely to have happened than not), unlike criminal courts where 'Beyond Reasonable Doubt' is needed.

The ICC examines surrounding circumstantial evidence:
- Contemporaneous disclosures (messages to friends or colleagues immediately after).
- Sudden changes in work dynamics, appraisal scoring, or communication tone.
- Digital breadcrumbs (chat timestamps, call frequency, door access swipe logs).
- The credibility, consistency, and demeanor of the parties.`,
  },
  {
    id: 'faq-6',
    category: 'Inquiry Process',
    question: 'Will I be penalized if the committee does not find sufficient proof?',
    sectionRef: 'Section 14, POSH Act 2013',
    shortAnswer: 'No. Mere inability to substantiate an allegation does NOT attract any penalty.',
    detailedExplanation: `Section 14 contains an explicit safeguard: Mere inability to substantiate a complaint or provide adequate proof does NOT mean the complaint was false or malicious.

Disciplinary action for a false complaint is ONLY initiated if there is concrete evidence that the complainant knowingly made a false allegation or produced forged/fabricated documents with deliberate malicious intent. Good-faith reporting is completely protected.`,
  },
];

export const DOCUMENT_TEMPLATES: DocumentTemplate[] = [
  {
    id: 'tpl-notice-respondent',
    title: 'Statutory Notice to Respondent (Rule 7)',
    targetRole: 'ICC Committee Member',
    legalBasis: 'Rule 7 of POSH Rules, 2013',
    description: 'Official notice issued to the respondent containing complaint details and 10-day deadline to reply.',
    content: `CONFIDENTIAL
INTERNAL COMPLAINTS COMMITTEE (ICC)
[Organization Name]

Ref No: ICC/NOT/[YEAR]/[CASE_NO]
Date: [DATE]

TO:
[Respondent Name]
[Designation & Employee ID]
[Department]

SUBJECT: Notice of Complaint under Section 9 of the POSH Act, 2013 and Opportunity to Submit Written Reply

1. You are hereby notified that a formal complaint alleging workplace harassment has been filed against you with the Internal Complaints Committee (ICC).
2. In accordance with Rule 7(1) of the Sexual Harassment of Women at Workplace Rules, 2013, a full copy of the complaint along with supporting documents is enclosed herewith for your review.
3. You are required to submit your formal written reply to the allegations, accompanied by all supporting documents, evidence, and a list of witnesses (with contact details), within TEN (10) WORKING DAYS of receipt of this notice, failing which the Committee may proceed ex-parte in accordance with law.
4. DIRECTIVE ON CONFIDENTIALITY & NON-RETALIATION:
   - Under Section 16 and 17 of the Act, strict confidentiality must be maintained. You must not discuss or disclose any details of this notice or complaint to colleagues, third parties, or media.
   - Any attempt to contact, intimidate, harass, or retaliate against the complainant, witnesses, or committee members directly or indirectly will be treated as grave misconduct and reported immediately for exemplary disciplinary action.

By Order of the Internal Complaints Committee,

_________________________
[Presiding Officer Name]
Presiding Officer, ICC
Encl: Copy of Complaint & Annexures`,
  },
  {
    id: 'tpl-witness-summons',
    title: 'Confidential Summons to Witness',
    targetRole: 'ICC Committee Member',
    legalBasis: 'Section 11(3) POSH Act (Powers of Civil Court)',
    description: 'Summons summoning an employee to appear before the ICC to provide witness testimony.',
    content: `CONFIDENTIAL - STRICTLY PRIVILEGED
INTERNAL COMPLAINTS COMMITTEE (ICC)
[Organization Name]

Ref: ICC/SUM/[CASE_NO]
Date: [DATE]

TO:
[Witness Name]
[Designation, Dept, Emp ID]

SUBJECT: Request to Appear before the Internal Complaints Committee as a Witness

The Internal Complaints Committee is currently conducting an inquiry into an internal workplace grievance. You have been named as an individual possessing relevant information or having witnessed key events.

1. You are hereby requested to attend a confidential hearing before the Committee:
   - Date: [HEARING_DATE]
   - Time: [HEARING_TIME]
   - Venue / Secured Virtual Room: [ROOM_OR_LINK]

2. You are requested to bring along any records, notes, messages, or emails relevant to the matter.
3. STATUTORY WITNESS PROTECTION & CONFIDENTIALITY:
   - Your testimony is protected under the organization's Zero-Tolerance Anti-Retaliation Policy.
   - You are prohibited under Section 16 of the POSH Act from discussing your summons, statements, or proceedings with anyone.

Sincerely,

_________________________
Presiding Officer / ICC Member Secretary`,
  },
  {
    id: 'tpl-interim-relief',
    title: 'Interim Relief Recommendation Order (Section 12)',
    targetRole: 'ICC Presiding Officer',
    legalBasis: 'Section 12, POSH Act 2013',
    description: 'Formal recommendation sent to executive management to immediately enforce protective measures.',
    content: `CONFIDENTIAL & URGENT
TO:
The Managing Director / Head of HR
[Organization Name]

FROM:
The Internal Complaints Committee (ICC)

Date: [DATE]
Subject: Interim Relief Recommendation under Section 12 of POSH Act in Case Ref: [CASE_NO]

Upon reviewing the prima facie gravity of Complaint Ref [CASE_NO] and the written request submitted by the Complainant, the Internal Complaints Committee hereby recommends the following interim protective measures with immediate effect:

1. WORKPLACE SEPARATION:
   [ ] Transfer the Respondent / Complainant to [Alternative Department / Branch].
   [ ] Reassign reporting structures such that the Respondent has no supervisory or appraisal role over the Complainant.
   [ ] Authorize the Complainant to work remotely / from home for the duration of the inquiry.

2. LEAVE SANCTION:
   [ ] Grant the Complainant paid leave of [Number of days/weeks up to 3 months], which shall be in addition to the statutory leave entitled to her.

3. RESTRAINING DIRECTIVE:
   [ ] Formally prohibit the Respondent from entering [Specific work wing / floor] or contacting the Complainant directly or via intermediaries.

Kindly issue necessary compliance orders within 3 working days and confirm the same to the ICC.

_________________________
[Presiding Officer]
For and on behalf of the Internal Complaints Committee`,
  },
  {
    id: 'tpl-minutes-hearing',
    title: 'Inquiry Hearing Minutes & Deposition Format',
    targetRole: 'ICC Committee Member',
    legalBasis: 'Section 11, POSH Act 2013 (Natural Justice)',
    description: 'Standard deposition template for recording statements of complainant, respondent, and witnesses.',
    content: `CONFIDENTIAL RECORD OF PROCEEDINGS
INTERNAL COMPLAINTS COMMITTEE (ICC)

Case Ref: [CASE_ID]
Date & Time: [DATE_TIME]
Hearing No: [1 / 2 / 3]
Location: [Confidential Committee Room / Secure Teleconference]

COMMITTEE QUORUM PRESENT:
1. [Presiding Officer Name] - Presiding Officer
2. [External Member Name] - External Member (NGO / Legal Expert)
3. [Member 2 Name] - Internal Member
4. [Member 3 Name] - Internal Member

PERSON EXAMINED:
Name: [Deponent Name]
Role: [Complainant / Respondent / Witness]
Designation: [Designation & Dept]

STATEMENT RECORDED:
[Record verbatim questions and answers in chronological order. Avoid subjective commentary. Record demeanor if noteworthy.]

Q1: [Question asked by Committee]
A1: [Response given by deponent]

Q2: [Question regarding specific date/location]
A2: [Response]

VERIFICATION & ATTESTATION:
"The contents of the above deposition recorded on [Number] pages have been read over and explained to me in a language I understand. I confirm that this is a true and accurate record of my statement."

Signature of Deponent: _________________________
Date: _________________________

Signatures of ICC Members Present:
1. _________________________ (Presiding Officer)
2. _________________________ (External Member)
3. _________________________ (Member)
4. _________________________ (Member)`,
  },
];
