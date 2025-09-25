#!/usr/bin/env node

/**
 * Security check script for pre-commit hook
 * Runs security audits and checks for vulnerabilities
 */

import { execSync } from 'child_process'
import { existsSync } from 'fs'

console.log('🔒 Running security checks...')

try {
  // Check if package-lock.json exists
  if (!existsSync('package-lock.json')) {
    console.error('❌ package-lock.json not found. Run "npm install" first.')
    process.exit(1)
  }

  // Run npm audit
  console.log('📋 Running npm audit...')
  execSync('npm audit --audit-level moderate', { stdio: 'inherit' })
  
  console.log('✅ Security checks passed!')
} catch (error) {
  console.error('❌ Security check failed:', error.message)
  console.log('💡 Run "npm audit fix" to fix vulnerabilities')
  process.exit(1)
}
