export function violatesStance(text: string, clientSide: string, desiredRelief: string) {
  const t = text.toLowerCase();

  // phrases that usually flip stance against the client
  const redFlags = [
    'order affirming denial',
    'affirmed.',
    'petition is denied',
    'motion is denied',
    'it is hereby ordered that the petition is denied',
    'judgment for plaintiff',
    'respondent\'s motion is granted',
    'appellant\'s motion is denied',
    'petitioner\'s request is denied',
    'defendant\'s motion is denied',
    'the court denies',
    'the court affirms',
    'the court hereby denies',
    'the court hereby affirms',
    'denied.',
    'affirmed.',
    'dismissed.',
    'reversed and remanded with instructions to deny'
  ];

  const reliefOk =
    t.includes(desiredRelief.toLowerCase()) ||
    t.includes('requested relief') ||
    t.includes('prayer for relief') ||
    t.includes('wherefore') ||
    t.includes('therefore') ||
    t.includes('respectfully requests') ||
    t.includes('respectfully pray');

  const hasRedFlag = redFlags.some(p => t.includes(p));

  // flag if any "against client" wording or no relief section
  return hasRedFlag || !reliefOk;
}

export function validateDocumentType(text: string, docType: string) {
  const t = text.toLowerCase();
  const requestedType = docType.toLowerCase();

  // Check if the document type matches what was requested
  const typeMatches = 
    (requestedType.includes('motion') && t.includes('motion')) ||
    (requestedType.includes('brief') && t.includes('brief')) ||
    (requestedType.includes('petition') && t.includes('petition')) ||
    (requestedType.includes('opposition') && t.includes('opposition')) ||
    (requestedType.includes('reply') && t.includes('reply')) ||
    (requestedType.includes('declaration') && t.includes('declaration')) ||
    (requestedType.includes('order') && t.includes('order'));

  // Check for inappropriate judicial language when not a proposed order
  const hasJudicialLanguage = 
    !requestedType.includes('order') && (
      t.includes('it is hereby ordered') ||
      t.includes('the court hereby') ||
      t.includes('judgment is entered') ||
      t.includes('this court orders')
    );

  return typeMatches && !hasJudicialLanguage;
}
