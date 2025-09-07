# Lighthouse Audit Setup

This project includes a simple Lighthouse auditing system for monitoring performance, accessibility, best practices, and SEO scores.

## Quick Start

Run a basic audit of your main pages:

```bash
npm run lighthouse
```

This will audit `https://vibe.rehab` and `https://vibe.rehab/roasts` and display results in the terminal.

## Available Commands

### Basic Auditing
- `npm run lighthouse` - Audit default URLs (homepage and roasts page)
- `npm run lighthouse:ci` - Run with CI thresholds (for automated testing)

## Advanced Usage

For custom URLs or advanced options, use the script directly:

```bash
# Audit specific URLs
node scripts/run-lighthouse.js audit https://example.com https://example.com/page2

# Single URL audit
node scripts/run-lighthouse.js single https://example.com

# Desktop audit
node scripts/run-lighthouse.js desktop

# Mobile audit
node scripts/run-lighthouse.js mobile

# Analyze latest report
node scripts/run-lighthouse.js analyze

# Compare reports
node scripts/run-lighthouse.js compare
```

## Programmatic Usage

You can also use the lighthouse tools programmatically in your own scripts:

```javascript
const { runLighthouse, runMultipleAudits } = require('./scripts/run-lighthouse');

// Single URL audit
const result = await runLighthouse('https://vibe.rehab');
console.log('Performance score:', result.scores.performance);

// Multiple URLs
const results = await runMultipleAudits([
  'https://vibe.rehab',
  'https://vibe.rehab/roasts'
]);
```

## Configuration

### Lighthouse Config (`lighthouse.config.js`)

The main configuration file includes:
- CI settings with performance budgets
- Desktop and mobile configurations
- Custom throttling settings
- Report output settings

### Thresholds

Default thresholds:
- Performance: 80
- Accessibility: 90
- Best Practices: 85
- SEO: 85
- Overall: 80

Override with environment variables:
```bash
LIGHTHOUSE_THRESHOLD_PERFORMANCE=90 npm run lighthouse:ci
```

## Report Storage

All reports are saved to `lighthouse-reports/` directory with timestamps:
- `lighthouse-results-2025-01-07T10-30-45-123Z.json`

## Score Interpretation

- **90-100**: Excellent (Green)
- **80-89**: Good (Yellow)
- **0-79**: Needs improvement (Red)

## Example Output

```
🚀 Starting Lighthouse audits for 2 URLs...

📊 Auditing 1/2: https://vibe.rehab
✅ https://vibe.rehab
   Performance: 85.2
   Accessibility: 92.1
   Best Practices: 87.5
   SEO: 91.7

📊 Auditing 2/2: https://vibe.rehab/roasts
✅ https://vibe.rehab/roasts
   Performance: 82.1
   Accessibility: 94.3
   Best Practices: 89.2
   SEO: 88.9

📈 Average Scores:
   Performance: 83.7
   Accessibility: 93.2
   Best Practices: 88.4
   SEO: 90.3

✨ Audit complete! Results saved to lighthouse-reports/lighthouse-results-2025-01-07T10-30-45-123Z.json
```

## Dependencies

- `lighthouse` - Core lighthouse auditing tool
- `chrome-launcher` - For launching Chrome programmatically
- `chalk` - For colored terminal output

## CI/CD Integration

For automated testing in CI/CD pipelines:

```yaml
# GitHub Actions example
- name: Lighthouse Audit
  run: npm run lighthouse:ci
  env:
    LIGHTHOUSE_THRESHOLD_PERFORMANCE: 80
    LIGHTHOUSE_THRESHOLD_ACCESSIBILITY: 90

# The script will exit with code 0 (pass) or 1 (fail) based on thresholds
```

## Troubleshooting

1. **Chrome not found**: Make sure Chrome/Chromium is installed
2. **Permission errors**: Run with appropriate permissions for Chrome
3. **Network timeouts**: Check network connectivity to target URLs
4. **High CPU usage**: Lighthouse uses CPU throttling by default

## Advanced Usage

### Custom Audit Categories

```javascript
const result = await runLighthouse('https://vibe.rehab', {
  onlyCategories: ['performance', 'accessibility'],
  formFactor: 'desktop',
  screenEmulation: {
    mobile: false,
    width: 1920,
    height: 1080,
  }
});
```

### Batch Processing

```javascript
const urls = [
  'https://vibe.rehab',
  'https://vibe.rehab/roasts',
  'https://vibe.rehab/contact'
];

const results = await runMultipleAudits(urls, {
  numberOfRuns: 3, // Average over 3 runs
  throttling: {
    cpuSlowdownMultiplier: 2,
    rttMs: 100,
  }
});
```

## File Structure

```
scripts/
└── run-lighthouse.js      # All-in-one audit runner with analysis & CI

lighthouse-reports/        # Generated reports
├── lighthouse-results-*.json
└── *-results.json

lighthouse.config.js       # Lighthouse configuration
LIGHTHOUSE_README.md       # This documentation
```
