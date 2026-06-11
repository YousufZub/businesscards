import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import * as XLSX from 'xlsx';
import { Contact } from '../types';

// ─── VCF ─────────────────────────────────────────────────────────────────────

function escapeVcf(value: string): string {
  return value.replace(/[\\,;]/g, (c) => `\\${c}`).replace(/\n/g, '\\n');
}

export function contactToVcf(contact: Contact): string {
  const lines: string[] = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${escapeVcf(`${contact.firstName} ${contact.lastName}`.trim())}`,
    `N:${escapeVcf(contact.lastName)};${escapeVcf(contact.firstName)};;;`,
  ];
  if (contact.designation) lines.push(`TITLE:${escapeVcf(contact.designation)}`);
  if (contact.company)     lines.push(`ORG:${escapeVcf(contact.company)}`);
  if (contact.email)       lines.push(`EMAIL;TYPE=INTERNET:${contact.email}`);
  if (contact.phone)       lines.push(`TEL;TYPE=WORK,VOICE:${contact.phone}`);
  if (contact.mobile)      lines.push(`TEL;TYPE=CELL,VOICE:${contact.mobile}`);
  if (contact.website)     lines.push(`URL:${contact.website}`);
  if (contact.address)     lines.push(`ADR:;;${escapeVcf(contact.address)};;;;`);
  if (contact.linkedinUrl) lines.push(`URL;TYPE=LinkedIn:${contact.linkedinUrl}`);
  if (contact.tags.length) lines.push(`CATEGORIES:${contact.tags.join(',')}`);
  lines.push(`REV:${new Date().toISOString()}`);
  lines.push('END:VCARD');
  return lines.join('\r\n');
}

export async function exportVcf(contacts: Contact[]): Promise<void> {
  const vcf  = contacts.map(contactToVcf).join('\r\n\r\n');
  const path = `${FileSystem.cacheDirectory ?? ''}CardVault_${Date.now()}.vcf`;
  await FileSystem.writeAsStringAsync(path, vcf, { encoding: FileSystem.EncodingType.UTF8 });
  await Sharing.shareAsync(path, { mimeType: 'text/vcard', dialogTitle: 'Export Contacts (VCF)' });
}

// ─── CSV ─────────────────────────────────────────────────────────────────────

function contactRow(c: Contact) {
  return {
    'First Name':    c.firstName,
    'Last Name':     c.lastName,
    'Title':         c.designation  ?? '',
    'Company':       c.company      ?? '',
    'Email':         c.email        ?? '',
    'Phone':         c.phone        ?? '',
    'Mobile':        c.mobile       ?? '',
    'Website':       c.website      ?? '',
    'LinkedIn':      c.linkedinUrl  ?? '',
    'Address':       c.address      ?? '',
    'Country':       c.country      ?? '',
    'Tags':          c.tags.join('; '),
    'Met Date':      c.metDate    ? new Date(c.metDate).toLocaleDateString()    : '',
    'Met Location':  c.metLocation ?? '',
    'Follow-up':     c.followUpDate ? new Date(c.followUpDate).toLocaleDateString() : '',
    'Relationship':  c.relationshipScore ?? 0,
    'Source':        c.source,
    'Added':         new Date(c.createdAt).toLocaleDateString(),
  };
}

export async function exportCsv(contacts: Contact[]): Promise<void> {
  const ws   = XLSX.utils.json_to_sheet(contacts.map(contactRow));
  const csv  = XLSX.utils.sheet_to_csv(ws);
  const path = `${FileSystem.cacheDirectory ?? ''}CardVault_${Date.now()}.csv`;
  await FileSystem.writeAsStringAsync(path, csv, { encoding: FileSystem.EncodingType.UTF8 });
  await Sharing.shareAsync(path, { mimeType: 'text/csv', dialogTitle: 'Export Contacts (CSV)' });
}

export async function exportXlsx(contacts: Contact[]): Promise<void> {
  const ws   = XLSX.utils.json_to_sheet(contacts.map(contactRow));
  const wb   = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Contacts');
  const data = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' }) as string;
  const path = `${FileSystem.cacheDirectory ?? ''}CardVault_${Date.now()}.xlsx`;
  await FileSystem.writeAsStringAsync(path, data, { encoding: FileSystem.EncodingType.Base64 });
  await Sharing.shareAsync(path, {
    mimeType:    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    dialogTitle: 'Export Contacts (Excel)',
  });
}

// ─── PDF ─────────────────────────────────────────────────────────────────────

export async function exportPdf(contacts: Contact[]): Promise<void> {
  const rows = contacts.map((c) => `
    <tr>
      <td>${c.firstName} ${c.lastName}</td>
      <td>${c.designation ?? ''}</td>
      <td>${c.company ?? ''}</td>
      <td>${c.email ?? ''}</td>
      <td>${c.phone ?? c.mobile ?? ''}</td>
      <td>${c.tags.join(', ')}</td>
    </tr>
  `).join('');

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body{font-family:-apple-system,sans-serif;margin:40px;color:#1e293b}
  h1{color:#6366f1;font-size:22px;margin-bottom:4px}
  .sub{color:#64748b;font-size:13px;margin-bottom:24px}
  table{width:100%;border-collapse:collapse;font-size:11px}
  th{background:#6366f1;color:#fff;padding:8px 10px;text-align:left}
  td{padding:6px 10px;border-bottom:1px solid #e2e8f0}
  tr:nth-child(even) td{background:#f8fafc}
</style>
</head>
<body>
<h1>CardVault Contacts</h1>
<p class="sub">Exported ${new Date().toLocaleDateString()} · ${contacts.length} contact${contacts.length !== 1 ? 's' : ''}</p>
<table>
<thead><tr><th>Name</th><th>Title</th><th>Company</th><th>Email</th><th>Phone</th><th>Tags</th></tr></thead>
<tbody>${rows}</tbody>
</table>
</body></html>`;

  const { uri } = await Print.printToFileAsync({ html, base64: false });
  await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'Export Contacts (PDF)' });
}
