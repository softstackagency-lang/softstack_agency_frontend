#!/usr/bin/env node

/**
 * JWT Secret Generator
 * Generates a secure random string for JWT_SECRET
 * Run: npm run generate-jwt-secret
 */

const crypto = require('crypto');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
};

console.log(`\n${colors.bright}${colors.cyan}🔐 JWT Secret Generator${colors.reset}\n`);

// Generate a 64-character random hex string
const secret = crypto.randomBytes(32).toString('hex');

console.log(`${colors.green}Generated JWT Secret:${colors.reset}`);
console.log(`${colors.bright}${secret}${colors.reset}\n`);

console.log(`${colors.yellow}Add this to your .env file:${colors.reset}`);
console.log(`${colors.cyan}JWT_SECRET=${secret}${colors.reset}\n`);

console.log(`${colors.bright}Security Tips:${colors.reset}`);
console.log(`• Keep this secret safe and never commit it to version control`);
console.log(`• Use different secrets for different environments`);
console.log(`• Store production secrets in secure environment variable management\n`);
