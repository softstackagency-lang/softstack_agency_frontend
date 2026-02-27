#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function parseVersion(versionString) {
  const match = versionString.match(/(\d+)\.(\d+)\.(\d+)/);
  if (!match) return null;
  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
  };
}

function compareVersions(current, required) {
  if (current.major > required.major) return 1;
  if (current.major < required.major) return -1;
  if (current.minor > required.minor) return 1;
  if (current.minor < required.minor) return -1;
  if (current.patch > required.patch) return 1;
  if (current.patch < required.patch) return -1;
  return 0;
}

function checkNodeVersion() {
  try {
    // Read package.json to get required versions
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    if (!packageJson.engines || !packageJson.engines.node) {
      log('⚠️  No Node.js version requirement specified in package.json', colors.yellow);
      return;
    }

    // Get current Node version
    const currentNodeVersion = process.version;
    const currentVersion = parseVersion(currentNodeVersion);

    // Parse required version (handle >= syntax)
    const requiredVersionString = packageJson.engines.node.replace(/[>=<^~\s]/g, '');
    const requiredVersion = parseVersion(requiredVersionString);

    if (!currentVersion || !requiredVersion) {
      log('❌ Unable to parse version numbers', colors.red);
      return;
    }

    console.log('\n' + '='.repeat(60));
    log('🔍 Node.js Version Check', colors.cyan + colors.bold);
    console.log('='.repeat(60));
    
    log(`\n📦 Project: ${packageJson.name}`, colors.cyan);
    log(`📋 Required Node.js: ${packageJson.engines.node}`, colors.cyan);
    log(`💻 Current Node.js: ${currentNodeVersion}`, colors.cyan);

    const comparison = compareVersions(currentVersion, requiredVersion);

    if (comparison < 0) {
      console.log('\n' + '⚠'.repeat(30));
      log('\n❌ WARNING: Node.js version is TOO OLD!', colors.red + colors.bold);
      log(`\nYour version: ${currentNodeVersion}`, colors.red);
      log(`Required version: ${packageJson.engines.node}`, colors.red);
      console.log('\n' + '⚠'.repeat(30));
      
      log('\n📝 This may cause issues:', colors.yellow);
      log('   • Package installation failures', colors.yellow);
      log('   • Runtime errors and crashes', colors.yellow);
      log('   • Build process failures', colors.yellow);
      log('   • Compatibility problems with dependencies', colors.yellow);
      
      log('\n✅ How to fix:', colors.green);
      log('   1. Using NVM (Recommended):', colors.green);
      log('      nvm install 25.2.1', colors.cyan);
      log('      nvm use 25.2.1', colors.cyan);
      log('      nvm alias default 25.2.1', colors.cyan);
      
      log('\n   2. Or download from:', colors.green);
      log('      https://nodejs.org/', colors.cyan);
      
      console.log('\n' + '='.repeat(60) + '\n');
      
      // Exit with error code to prevent installation
      process.exit(1);
      
    } else {
      console.log('\n' + '✓'.repeat(30));
      log('\n✅ Node.js version is compatible!', colors.green + colors.bold);
      console.log('\n' + '✓'.repeat(30));
      console.log('\n' + '='.repeat(60) + '\n');
    }

    // Check npm version if specified
    if (packageJson.engines && packageJson.engines.npm) {
      try {
        const currentNpmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
        const currentNpmParsed = parseVersion(currentNpmVersion);
        const requiredNpmString = packageJson.engines.npm.replace(/[>=<^~\s]/g, '');
        const requiredNpmParsed = parseVersion(requiredNpmString);

        const npmComparison = compareVersions(currentNpmParsed, requiredNpmParsed);

        if (npmComparison < 0) {
          log('⚠️  Warning: npm version is below recommended', colors.yellow);
          log(`   Current: ${currentNpmVersion}`, colors.yellow);
          log(`   Required: ${packageJson.engines.npm}`, colors.yellow);
          log(`   Update: npm install -g npm@latest\n`, colors.cyan);
        }
      } catch (err) {
        // npm check failed, but don't block
      }
    }

  } catch (error) {
    log(`\n❌ Error checking Node version: ${error.message}`, colors.red);
    // Don't exit with error for check failures
  }
}

checkNodeVersion();
