import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class SanitizePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value === 'string') {
      return this.sanitizeString(value);
    }
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return this.sanitizeObject(value);
    }
    if (Array.isArray(value)) {
      return value.map((item) =>
        typeof item === 'string'
          ? this.sanitizeString(item)
          : typeof item === 'object'
          ? this.sanitizeObject(item)
          : item
      );
    }
    return value;
  }

  private sanitizeString(str: string): string {
    return str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+="[^"]*"/gi, '')
      .replace(/on\w+='[^']*'/gi, '')
      .replace(/on\w+=\w+/gi, '')
      .trim();
  }

  private sanitizeObject(obj: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};
    for (const [key, val] of Object.entries(obj)) {
      if (typeof val === 'string') {
        sanitized[key] = this.sanitizeString(val);
      } else if (val && typeof val === 'object' && !Array.isArray(val)) {
        sanitized[key] = this.sanitizeObject(val);
      } else if (Array.isArray(val)) {
        sanitized[key] = val.map((item) =>
          typeof item === 'string'
            ? this.sanitizeString(item)
            : typeof item === 'object'
            ? this.sanitizeObject(item)
            : item
        );
      } else {
        sanitized[key] = val;
      }
    }
    return sanitized;
  }
}
