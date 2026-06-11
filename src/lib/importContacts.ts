import * as XLSX from 'xlsx';

export interface ImportedContact {
  firstName:   string;
  lastName:    string;
  designation?: string;
  company?:    string;
  email?:      string;
  phone?:      string;
  mobile?:     string;
  website?:    string;
  linkedinUrl?: string;
  address?:    string;
  tags:        string[];
}

// ─── VCF parser ───────────────────────────────────────────────────────────────

export function parseVcf(vcfText: string): ImportedContact[] {
  const cards = vcfText
    .replace(/\r\n /g, '')   // unfold lines
    .split(/BEGIN:VCARD/i)
    .slice(1);

  return cards
    .map((card) => {
      const get = (field: string) =>
        new RegExp(`^${field}[^:]*:(.+)$`, 'im').exec(card)?.[1]?.trim();

      const getAll = (field: string) => {
        const matches: string[] = [];
        const re = new RegExp(`^${field}[^:]*:(.+)$`, 'gim');
        let m: RegExpExecArray | null;
        while ((m = re.exec(card)) !== null) matches.push(m[1].trim());
        return matches;
      };

      const fn     = get('FN') ?? '';
      const nRaw   = get('N') ?? '';
      const nParts = nRaw.split(';');
      const lastName  = nParts[0]?.trim() || fn.split(' ').slice(1).join(' ');
      const firstName = nParts[1]?.trim() || fn.split(' ')[0] || fn;

      const tels = getAll('TEL');
      const phone  = tels.find((t) => card.match(new RegExp(`TEL[^:]*WORK[^:]*:${escapeRegex(t)}`)));
      const mobile = tels.find((t) => card.match(new RegExp(`TEL[^:]*CELL[^:]*:${escapeRegex(t)}`)));

      const catRaw = get('CATEGORIES');
      const tags   = catRaw ? catRaw.split(',').map((t) => t.trim()).filter(Boolean) : [];

      return {
        firstName: firstName || fn,
        lastName,
        designation: get('TITLE'),
        company:     get('ORG'),
        email:       get('EMAIL'),
        phone:       phone ?? tels[0],
        mobile:      mobile,
        website:     get('URL'),
        address:     get('ADR')?.replace(/;+/g, ' ').trim(),
        linkedinUrl: undefined,
        tags,
      };
    })
    .filter((c) => c.firstName);
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ─── CSV / XLSX parser ────────────────────────────────────────────────────────

const FIELD_MAP: Array<[keyof ImportedContact, string[]]> = [
  ['firstName',   ['First Name', 'first_name', 'FirstName', 'Given Name']],
  ['lastName',    ['Last Name',  'last_name',  'LastName',  'Family Name', 'Surname']],
  ['designation', ['Title',      'Job Title',  'Position',  'Role']],
  ['company',     ['Company',    'Organization', 'Employer', 'Org']],
  ['email',       ['Email',      'E-mail',     'Email Address']],
  ['phone',       ['Phone',      'Work Phone', 'Tel', 'Phone Number']],
  ['mobile',      ['Mobile',     'Cell',       'Cell Phone', 'Mobile Phone']],
  ['website',     ['Website',    'Web',        'URL']],
  ['linkedinUrl', ['LinkedIn',   'LinkedIn URL']],
  ['address',     ['Address',    'Street',     'Location']],
];

function pickField(row: Record<string, string>, candidates: string[]): string | undefined {
  for (const key of candidates) {
    if (row[key]) return row[key];
  }
  return undefined;
}

export function parseCsv(csvText: string): ImportedContact[] {
  const wb   = XLSX.read(csvText, { type: 'string' });
  const ws   = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, string>>(ws);

  return rows
    .map((row) => {
      const contact: Partial<ImportedContact> = { tags: [] };
      for (const [field, candidates] of FIELD_MAP) {
        const val = pickField(row, candidates);
        if (val) (contact as Record<string, unknown>)[field] = val;
      }
      const tagsRaw = row['Tags'] ?? row['tags'] ?? row['Categories'] ?? '';
      contact.tags = tagsRaw ? tagsRaw.split(/[;,]/).map((t) => t.trim()).filter(Boolean) : [];
      return contact as ImportedContact;
    })
    .filter((c) => c.firstName);
}

// ─── Deduplicate helper ───────────────────────────────────────────────────────

export function deduplicateByEmail<T extends { email?: string }>(
  incoming: T[],
  existing: { email?: string }[],
): { toImport: T[]; skipped: number } {
  const existingEmails = new Set(
    existing.map((c) => c.email?.toLowerCase()).filter(Boolean),
  );

  const toImport: T[] = [];
  let skipped = 0;

  for (const c of incoming) {
    const key = c.email?.toLowerCase();
    if (key && existingEmails.has(key)) {
      skipped++;
    } else {
      toImport.push(c);
      if (key) existingEmails.add(key);
    }
  }

  return { toImport, skipped };
}
