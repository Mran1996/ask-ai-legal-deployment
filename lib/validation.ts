// Input validation and sanitization utilities

export function sanitizeString(input: string, maxLength: number = 10000): string {
  if (typeof input !== 'string') {
    return '';
  }
  
  // Remove null bytes and control characters (except newlines and tabs)
  let sanitized = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  
  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  return sanitized.trim();
}

export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

export function validateUUID(uuid: string): boolean {
  if (!uuid || typeof uuid !== 'string') return false;
  
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export function validateFileType(filename: string, allowedExtensions: string[]): boolean {
  if (!filename || typeof filename !== 'string') return false;
  
  const extension = filename.split('.').pop()?.toLowerCase();
  return extension ? allowedExtensions.includes(extension) : false;
}

export function validateMessages(messages: any[]): boolean {
  if (!Array.isArray(messages)) return false;
  
  return messages.every(msg => {
    return msg && 
           typeof msg === 'object' && 
           (msg.sender || msg.role) && 
           (msg.text || msg.content) &&
           typeof (msg.text || msg.content) === 'string' &&
           (msg.text || msg.content).length > 0 &&
           (msg.text || msg.content).length <= 10000;
  });
}

export function sanitizeObject(obj: any, maxDepth: number = 3): any {
  if (maxDepth <= 0) return null;
  
  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }
  
  if (typeof obj === 'number') {
    return isFinite(obj) ? obj : 0;
  }
  
  if (typeof obj === 'boolean') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.slice(0, 100).map(item => sanitizeObject(item, maxDepth - 1));
  }
  
  if (obj && typeof obj === 'object') {
    const sanitized: any = {};
    const keys = Object.keys(obj).slice(0, 50); // Limit object size
    
    for (const key of keys) {
      if (typeof key === 'string' && key.length <= 100) {
        sanitized[key] = sanitizeObject(obj[key], maxDepth - 1);
      }
    }
    
    return sanitized;
  }
  
  return null;
}

