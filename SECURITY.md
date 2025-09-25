# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| Node.js | >= 18.0.0         |
| npm     | >= 9.0.0          |

## Security Measures

### Package Security
- All dependencies are regularly audited using `npm audit`
- Security vulnerabilities are automatically checked in pre-commit hooks
- Dependencies are kept up-to-date with latest secure versions

### Development Security
- ESLint 9 with TypeScript strict mode
- Pre-commit hooks run security audits, linters, and tests
- No execution of untrusted code in development environment

### Running Security Checks

```bash
# Check for vulnerabilities
npm run audit

# Fix automatically fixable vulnerabilities
npm run audit:fix

# Run all security checks (included in pre-commit)
npm run lint && npm run test && npm run audit
```

## Reporting Vulnerabilities

If you discover a security vulnerability, please:
1. Do not create a public issue
2. Contact the maintainers privately
3. Provide detailed information about the vulnerability
4. Allow reasonable time for response before public disclosure

## Security Best Practices

- Always run `npm install` after pulling changes
- Keep dependencies updated regularly
- Review security advisories for used packages
- Use `npm audit` before deploying to production
