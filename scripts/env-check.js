#!/usr/bin/env node

/**
 * Environment Variables Validation Script
 * This script checks if all required environment variables are properly configured
 * Run: npm run check
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Required environment variables configuration
const requiredEnvVars = [
  {
    category: 'Firebase Configuration',
    vars: [
      { name: 'NEXT_PUBLIC_FIREBASE_API_KEY', description: 'Firebase API Key', validator: (val) => val && val.length > 20 },
      { name: 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', description: 'Firebase Auth Domain', validator: (val) => val && val.includes('firebaseapp.com') },
      { name: 'NEXT_PUBLIC_FIREBASE_PROJECT_ID', description: 'Firebase Project ID', validator: (val) => val && val.length > 0 },
      { name: 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET', description: 'Firebase Storage Bucket', validator: (val) => val && val.length > 0 },
      { name: 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID', description: 'Firebase Messaging Sender ID', validator: (val) => val && /^\d+$/.test(val) },
      { name: 'NEXT_PUBLIC_FIREBASE_APP_ID', description: 'Firebase App ID', validator: (val) => val && val.includes(':') },
    ],
  },
  {
    category: 'API Configuration',
    vars: [
      { name: 'NEXT_PUBLIC_API_BASE_URL', description: 'Backend API Base URL', validator: (val) => val && (val.startsWith('http://') || val.startsWith('https://')) },
    ],
  },
  {
    category: 'Authentication',
    vars: [
      { name: 'JWT_SECRET', description: 'JWT Secret Key', validator: (val) => val && val.length >= 32, warning: 'Should be at least 32 characters for security' },
    ],
  },
  {
    category: 'Email/SMTP Configuration',
    vars: [
      { name: 'SMTP_HOST', description: 'SMTP Host', validator: (val) => val && val.length > 0 },
      { name: 'SMTP_PORT', description: 'SMTP Port', validator: (val) => val && /^\d+$/.test(val) && (val === '587' || val === '465' || val === '25') },
      { name: 'SMTP_USER', description: 'SMTP User/Email', validator: (val) => val && val.includes('@') },
      { name: 'SMTP_PASS', description: 'SMTP Password', validator: (val) => val && val.length > 0 },
    ],
  },
  {
    category: 'File Upload Configuration',
    vars: [
      { name: 'CLOUDINARY_URL', description: 'Cloudinary URL', validator: (val) => val && val.startsWith('cloudinary://') },
    ],
  },
];

// Optional environment variables
const optionalEnvVars = [
  { name: 'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID', description: 'Firebase Measurement ID (Optional for Analytics)' },
  { name: 'NODE_ENV', description: 'Node Environment (development/production)' },
  { name: 'MONGODB_URI', description: 'MongoDB Connection String (Only needed if using local database features)' },
];

/**
 * Print formatted header
 */
function printHeader() {
  console.log(`\n${colors.bright}${colors.cyan}╔════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}║   Environment Variables Validation Check                  ║${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}╚════════════════════════════════════════════════════════════╝${colors.reset}\n`);
}

/**
 * Check if .env file exists
 */
function checkEnvFileExists() {
  const envPath = path.join(process.cwd(), '.env');
  const envExamplePath = path.join(process.cwd(), '.env.example');
  
  if (!fs.existsSync(envPath)) {
    console.log(`${colors.red}✗ ERROR: .env file not found!${colors.reset}`);
    console.log(`${colors.yellow}→ Please create a .env file in the root directory${colors.reset}`);
    
    if (fs.existsSync(envExamplePath)) {
      console.log(`${colors.yellow}→ You can copy .env.example to .env and fill in the values:${colors.reset}`);
      console.log(`${colors.cyan}  cp .env.example .env${colors.reset}\n`);
    }
    return false;
  }
  
  console.log(`${colors.green}✓ .env file found${colors.reset}\n`);
  return true;
}

/**
 * Load environment variables from .env file
 */
function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {};
  
  envContent.split('\n').forEach((line) => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, ...valueParts] = trimmedLine.split('=');
      if (key) {
        envVars[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
  
  return envVars;
}

/**
 * Validate environment variables
 */
function validateEnvVars() {
  const envVars = loadEnvFile();
  let totalChecks = 0;
  let passedChecks = 0;
  let failedChecks = 0;
  let warnings = 0;
  const errors = [];
  
  requiredEnvVars.forEach((category) => {
    console.log(`${colors.bright}${colors.blue}▶ ${category.category}${colors.reset}`);
    
    category.vars.forEach((varConfig) => {
      totalChecks++;
      const value = envVars[varConfig.name];
      const isSet = value !== undefined && value !== '';
      const isValid = isSet && varConfig.validator(value);
      
      if (!isSet) {
        console.log(`  ${colors.red}✗ ${varConfig.name}${colors.reset} - ${colors.red}NOT SET${colors.reset}`);
        errors.push({
          var: varConfig.name,
          description: varConfig.description,
          issue: 'Not set in .env file',
        });
        failedChecks++;
      } else if (!isValid) {
        console.log(`  ${colors.yellow}⚠ ${varConfig.name}${colors.reset} - ${colors.yellow}INVALID FORMAT${colors.reset}`);
        if (varConfig.warning) {
          console.log(`    ${colors.yellow}${varConfig.warning}${colors.reset}`);
        }
        errors.push({
          var: varConfig.name,
          description: varConfig.description,
          issue: 'Invalid format or value',
        });
        warnings++;
        failedChecks++;
      } else {
        console.log(`  ${colors.green}✓ ${varConfig.name}${colors.reset} - OK`);
        passedChecks++;
      }
    });
    
    console.log('');
  });
  
  // Check optional variables
  console.log(`${colors.bright}${colors.blue}▶ Optional Configuration${colors.reset}`);
  optionalEnvVars.forEach((varConfig) => {
    const value = envVars[varConfig.name];
    const isSet = value !== undefined && value !== '';
    
    if (isSet) {
      console.log(`  ${colors.green}✓ ${varConfig.name}${colors.reset} - SET`);
    } else {
      console.log(`  ${colors.yellow}○ ${varConfig.name}${colors.reset} - ${colors.yellow}NOT SET${colors.reset} (optional)`);
    }
  });
  
  console.log('');
  
  return { totalChecks, passedChecks, failedChecks, warnings, errors };
}

/**
 * Print summary
 */
function printSummary(results) {
  console.log(`${colors.bright}${colors.cyan}═══════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bright}Summary:${colors.reset}`);
  console.log(`  Total Checks: ${results.totalChecks}`);
  console.log(`  ${colors.green}Passed: ${results.passedChecks}${colors.reset}`);
  console.log(`  ${colors.red}Failed: ${results.failedChecks}${colors.reset}`);
  
  if (results.warnings > 0) {
    console.log(`  ${colors.yellow}Warnings: ${results.warnings}${colors.reset}`);
  }
  
  console.log(`${colors.bright}${colors.cyan}═══════════════════════════════════════════════════════════${colors.reset}\n`);
  
  if (results.errors.length > 0) {
    console.log(`${colors.red}${colors.bright}Issues Found:${colors.reset}`);
    results.errors.forEach((error, index) => {
      console.log(`\n${index + 1}. ${colors.red}${error.var}${colors.reset}`);
      console.log(`   Description: ${error.description}`);
      console.log(`   Issue: ${error.issue}`);
    });
    console.log('');
  }
}

/**
 * Print next steps
 */
function printNextSteps(hasErrors) {
  if (hasErrors) {
    console.log(`${colors.yellow}${colors.bright}Next Steps:${colors.reset}`);
    console.log(`${colors.yellow}1. Review the .env.example file for reference${colors.reset}`);
    console.log(`${colors.yellow}2. Add missing environment variables to your .env file${colors.reset}`);
    console.log(`${colors.yellow}3. Ensure all values are correctly formatted${colors.reset}`);
    console.log(`${colors.yellow}4. Run 'npm run check' again to verify${colors.reset}\n`);
  } else {
    console.log(`${colors.green}${colors.bright}✓ All required environment variables are properly configured!${colors.reset}`);
    console.log(`${colors.green}You can now run:${colors.reset}`);
    console.log(`  ${colors.cyan}npm run dev${colors.reset} - Start development server`);
    console.log(`  ${colors.cyan}npm run build${colors.reset} - Build for production\n`);
  }
}

/**
 * Test database connection
 */
async function testDatabaseConnection(envVars) {
  console.log(`${colors.bright}${colors.blue}▶ Testing Database Connection${colors.reset}`);
  
  const mongoUri = envVars['MONGODB_URI'];
  if (!mongoUri) {
    console.log(`  ${colors.yellow}⚠ Skipping - MONGODB_URI not set${colors.reset}\n`);
    return;
  }
  
  try {
    const { MongoClient } = require('mongodb');
    const client = new MongoClient(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    
    await client.connect();
    console.log(`  ${colors.green}✓ MongoDB connection successful${colors.reset}\n`);
    await client.close();
  } catch (error) {
    console.log(`  ${colors.red}✗ MongoDB connection failed: ${error.message}${colors.reset}\n`);
  }
}

/**
 * Main function
 */
async function main() {
  printHeader();
  
  // Check if .env file exists
  if (!checkEnvFileExists()) {
    process.exit(1);
  }
  
  // Validate environment variables
  const results = validateEnvVars();
  
  // Test database connection (optional)
  try {
    const envVars = loadEnvFile();
    await testDatabaseConnection(envVars);
  } catch (error) {
    // MongoDB module might not be installed yet
    console.log(`${colors.yellow}  ⚠ Database connection test skipped (install dependencies first)${colors.reset}\n`);
  }
  
  // Print summary
  printSummary(results);
  
  // Print next steps
  printNextSteps(results.failedChecks > 0);
  
  // Exit with appropriate code
  process.exit(results.failedChecks > 0 ? 1 : 0);
}

// Run the script
main().catch((error) => {
  console.error(`${colors.red}Error running validation script: ${error.message}${colors.reset}`);
  process.exit(1);
});
