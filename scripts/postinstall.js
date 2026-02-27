#!/usr/bin/env node

/**
 * Post-install reminder script
 * Reminds developers to configure their environment after installing dependencies
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
};

console.log(`\n${colors.bright}${colors.cyan}╔════════════════════════════════════════════════════════════╗${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}║   📦 Dependencies Installed Successfully!                  ║${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}╚════════════════════════════════════════════════════════════╝${colors.reset}\n`);

const envPath = path.join(process.cwd(), '.env');
const envExamplePath = path.join(process.cwd(), '.env.example');

if (!fs.existsSync(envPath)) {
  console.log(`${colors.yellow}⚠️  Important: Environment configuration required!${colors.reset}\n`);
  console.log(`${colors.bright}Next Steps:${colors.reset}`);
  console.log(`${colors.green}1.${colors.reset} Create your .env file:`);
  console.log(`   ${colors.cyan}cp .env.example .env${colors.reset}\n`);
  console.log(`${colors.green}2.${colors.reset} Fill in all required environment variables`);
  console.log(`   ${colors.cyan}See SETUP.md for detailed instructions${colors.reset}\n`);
  console.log(`${colors.green}3.${colors.reset} Verify your configuration:`);
  console.log(`   ${colors.cyan}npm run check${colors.reset}\n`);
  console.log(`${colors.green}4.${colors.reset} Start development:`);
  console.log(`   ${colors.cyan}npm run dev${colors.reset}\n`);
} else {
  console.log(`${colors.green}✓ .env file exists${colors.reset}\n`);
  console.log(`${colors.bright}Recommended: Verify your configuration${colors.reset}`);
  console.log(`${colors.cyan}npm run check${colors.reset}\n`);
}

console.log(`${colors.bright}📖 Documentation:${colors.reset}`);
console.log(`   • SETUP.md - Complete setup guide`);
console.log(`   • README.md - Project overview\n`);
