#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk').default || require('chalk');

// Extract site URL from config file (avoiding TypeScript import issues)
const configPath = path.join(__dirname, '..', 'config', 'site-config.ts');
const configContent = fs.readFileSync(configPath, 'utf8');
const urlMatch = configContent.match(/url:\s*["']([^"']+)["']/);
const siteUrl = urlMatch ? urlMatch[1] : 'https://vibe.rehab';

const REPORTS_DIR = path.join(__dirname, '..', 'lighthouse-reports');

// Ensure reports directory exists
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

// Utility functions
function formatScore(score) {
  const rounded = Math.round(score);
  if (rounded >= 90) return chalk.green(rounded);
  if (rounded >= 80) return chalk.yellow(rounded);
  return chalk.red(rounded);
}

function getGrade(score) {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

function displayResults(results) {
  console.log('\n' + chalk.bold('🚀 Lighthouse Audit Results'));
  console.log('='.repeat(80));

  results.forEach((result, index) => {
    if (result.error) {
      console.log(`\n${index + 1}. ${chalk.red('❌')} ${result.url}`);
      console.log(`   Error: ${result.error}`);
      return;
    }

    console.log(`\n${index + 1}. ${chalk.blue('✅')} ${result.url}`);
    console.log(`   ${chalk.gray('Timestamp:')} ${new Date(result.timestamp).toLocaleString()}`);

    const scores = result.scores;
    console.log(`\n   Performance:     ${formatScore(scores.performance)} (${getGrade(scores.performance)})`);
    console.log(`   Accessibility:   ${formatScore(scores.accessibility)} (${getGrade(scores.accessibility)})`);
    console.log(`   Best Practices:  ${formatScore(scores['best-practices'])} (${getGrade(scores['best-practices'])})`);
    console.log(`   SEO:            ${formatScore(scores.seo)} (${getGrade(scores.seo)})`);

    const overall = Math.round(
      (scores.performance * 0.25) +
      (scores.accessibility * 0.25) +
      (scores['best-practices'] * 0.25) +
      (scores.seo * 0.25)
    );
    console.log(`   ${chalk.bold('Overall:')}         ${formatScore(overall)} (${getGrade(overall)})`);
  });

  const validResults = results.filter(r => !r.error);
  if (validResults.length > 0) {
    console.log('\n' + chalk.bold('📊 Summary'));
    console.log('-'.repeat(40));

    const averages = {
      performance: validResults.reduce((sum, r) => sum + r.scores.performance, 0) / validResults.length,
      accessibility: validResults.reduce((sum, r) => sum + r.scores.accessibility, 0) / validResults.length,
      'best-practices': validResults.reduce((sum, r) => sum + r.scores['best-practices'], 0) / validResults.length,
      seo: validResults.reduce((sum, r) => sum + r.scores.seo, 0) / validResults.length,
    };

    console.log(`   Average Performance:     ${formatScore(averages.performance)}`);
    console.log(`   Average Accessibility:   ${formatScore(averages.accessibility)}`);
    console.log(`   Average Best Practices:  ${formatScore(averages['best-practices'])}`);
    console.log(`   Average SEO:            ${formatScore(averages.seo)}`);

    const overallAvg = Math.round(
      (averages.performance * 0.25) +
      (averages.accessibility * 0.25) +
      (averages['best-practices'] * 0.25) +
      (averages.seo * 0.25)
    );
    console.log(`   ${chalk.bold('Overall Average:')}         ${formatScore(overallAvg)}`);
  }

  console.log('\n' + '='.repeat(80));
}

/**
 * Run lighthouse audit on a single URL using CLI
 * @param {string} url - URL to audit
 * @param {Object} options - Lighthouse options
 * @returns {Promise<Object>} Lighthouse results
 */
async function runLighthouse(url, options = {}) {
  return new Promise((resolve, reject) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputPath = path.join(REPORTS_DIR, `temp-audit-${timestamp}.json`);

    const args = [
      url,
      '--output=json',
      `--output-path=${outputPath}`,
      '--only-categories=performance,accessibility,best-practices,seo',
      '--quiet',
    ];

    // Add custom options
    if (options.formFactor === 'desktop') {
      args.push('--preset=desktop');
    }

    if (options.throttling) {
      if (options.throttling.cpuSlowdownMultiplier) {
        args.push(`--throttling.cpuSlowdownMultiplier=${options.throttling.cpuSlowdownMultiplier}`);
      }
    }

    const lighthouseProcess = spawn('npx', ['lighthouse', ...args], {
      stdio: ['inherit', 'pipe', 'pipe'],
      cwd: process.cwd(),
    });

    let stdout = '';
    let stderr = '';

    lighthouseProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    lighthouseProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    lighthouseProcess.on('close', (code) => {
      if (code === 0 && fs.existsSync(outputPath)) {
        try {
          const reportData = fs.readFileSync(outputPath, 'utf8');
          const report = JSON.parse(reportData);

          // Clean up temp file
          fs.unlinkSync(outputPath);

          resolve({
            url,
            timestamp: new Date().toISOString(),
            scores: {
              performance: Math.round(report.categories.performance.score * 100),
              accessibility: Math.round(report.categories.accessibility.score * 100),
              'best-practices': Math.round(report.categories['best-practices'].score * 100),
              seo: Math.round(report.categories.seo.score * 100),
            },
            report,
          });
        } catch (error) {
          reject(new Error(`Failed to parse lighthouse report: ${error.message}`));
        }
      } else {
        reject(new Error(`Lighthouse process failed with code ${code}: ${stderr}`));
      }
    });

    lighthouseProcess.on('error', (error) => {
      reject(new Error(`Failed to start lighthouse: ${error.message}`));
    });
  });
}

/**
 * Run lighthouse audits on multiple URLs
 * @param {string[]} urls - URLs to audit
 * @param {Object} options - Lighthouse options
 * @returns {Promise<Object[]>} Array of lighthouse results
 */
async function runMultipleAudits(urls, options = {}) {
  const results = [];

  console.log(`🚀 Starting Lighthouse audits for ${urls.length} URLs...\n`);

  for (const [index, url] of urls.entries()) {
    console.log(`📊 Auditing ${index + 1}/${urls.length}: ${url}`);

    try {
      const result = await runLighthouse(url, options);
      results.push(result);

      console.log(`✅ ${url}`);
      console.log(`   Performance: ${result.scores.performance.toFixed(1)}`);
      console.log(`   Accessibility: ${result.scores.accessibility.toFixed(1)}`);
      console.log(`   Best Practices: ${result.scores['best-practices'].toFixed(1)}`);
      console.log(`   SEO: ${result.scores.seo.toFixed(1)}\n`);

    } catch (error) {
      console.error(`❌ Failed to audit ${url}:`, error.message);
      results.push({
        url,
        timestamp: new Date().toISOString(),
        error: error.message,
      });
    }
  }

  return results;
}

/**
 * Save lighthouse results to file
 * @param {Object[]} results - Array of lighthouse results
 * @param {string} filename - Output filename
 */
function saveResults(results, filename) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outputPath = path.join(REPORTS_DIR, filename || `lighthouse-results-${timestamp}.json`);

  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

  console.log(`💾 Results saved to: ${outputPath}`);
  return outputPath;
}

/**
 * Get average scores across all audited URLs
 * @param {Object[]} results - Array of lighthouse results
 * @returns {Object} Average scores
 */
function getAverageScores(results) {
  const validResults = results.filter(r => !r.error);

  if (validResults.length === 0) return null;

  const averages = {
    performance: 0,
    accessibility: 0,
    'best-practices': 0,
    seo: 0,
  };

  validResults.forEach(result => {
    averages.performance += result.scores.performance;
    averages.accessibility += result.scores.accessibility;
    averages['best-practices'] += result.scores['best-practices'];
    averages.seo += result.scores.seo;
  });

  Object.keys(averages).forEach(key => {
    averages[key] = (averages[key] / validResults.length).toFixed(1);
  });

  return averages;
}

/**
 * Get all lighthouse report files from the reports directory
 * @param {string} reportsDir - Directory containing lighthouse reports
 * @returns {string[]} Array of report file paths
 */
function getLighthouseReports(reportsDir = REPORTS_DIR) {
  const reportsPath = path.resolve(reportsDir);

  if (!fs.existsSync(reportsPath)) {
    return [];
  }

  return fs.readdirSync(reportsPath)
    .filter(file => file.endsWith('.json') && file.startsWith('lighthouse-results-'))
    .map(file => path.join(reportsPath, file))
    .sort((a, b) => {
      const statA = fs.statSync(a);
      const statB = fs.statSync(b);
      return statB.mtime - statA.mtime; // Most recent first
    });
}

/**
 * Analyze latest report
 */
function analyzeLatestReport() {
  const reports = getLighthouseReports();

  if (reports.length === 0) {
    console.log('No lighthouse reports found. Run "npm run lighthouse:audit" first.');
    return;
  }

  const latestReport = reports[0];
  console.log(`📊 Analyzing latest report: ${path.basename(latestReport)}`);

  try {
    const data = fs.readFileSync(latestReport, 'utf8');
    const results = JSON.parse(data);

    // Handle both single report and array format
    const resultsArray = Array.isArray(results) ? results : [results];

    displayResults(resultsArray);
  } catch (error) {
    console.error('Error analyzing report:', error.message);
  }
}

/**
 * Compare two lighthouse results
 * @param {Object} result1 - First lighthouse result
 * @param {Object} result2 - Second lighthouse result
 */
function compareResults(result1, result2) {
  console.log('\n' + chalk.bold('📊 Score Comparison'));
  console.log('='.repeat(50));

  const categories = ['performance', 'accessibility', 'best-practices', 'seo'];

  categories.forEach(category => {
    const score1 = result1.scores[category];
    const score2 = result2.scores[category];
    const diff = score2 - score1;
    const diffSymbol = diff > 0 ? chalk.green('↑') : diff < 0 ? chalk.red('↓') : chalk.gray('→');

    console.log(`   ${category}: ${formatScore(score1)} → ${formatScore(score2)} ${diffSymbol} ${Math.abs(diff).toFixed(1)}`);
  });
}

/**
 * Compare last two reports
 */
function compareLastTwoReports() {
  const reports = getLighthouseReports();

  if (reports.length < 2) {
    console.log('Need at least 2 reports to compare. Run audits first.');
    return;
  }

  const latest = reports[0];
  const previous = reports[1];

  console.log(`📊 Comparing reports:`);
  console.log(`   Latest:  ${path.basename(latest)}`);
  console.log(`   Previous: ${path.basename(previous)}`);

  try {
    const data1 = fs.readFileSync(previous, 'utf8');
    const data2 = fs.readFileSync(latest, 'utf8');
    const results1 = JSON.parse(data1);
    const results2 = JSON.parse(data2);

    // Compare averages if multiple URLs, or single results
    const avg1 = getAverageScores(Array.isArray(results1) ? results1 : [results1]);
    const avg2 = getAverageScores(Array.isArray(results2) ? results2 : [results2]);

    if (avg1 && avg2) {
      compareResults({
        scores: {
          performance: parseFloat(avg1.performance),
          accessibility: parseFloat(avg1.accessibility),
          'best-practices': parseFloat(avg1['best-practices']),
          seo: parseFloat(avg1.seo),
        }
      }, {
        scores: {
          performance: parseFloat(avg2.performance),
          accessibility: parseFloat(avg2.accessibility),
          'best-practices': parseFloat(avg2['best-practices']),
          seo: parseFloat(avg2.seo),
        }
      });
    }
  } catch (error) {
    console.error('Error comparing reports:', error.message);
  }
}

/**
 * CI/CD integration with thresholds
 */
function runCI() {
  const THRESHOLDS = {
    performance: process.env.LIGHTHOUSE_THRESHOLD_PERFORMANCE ? parseInt(process.env.LIGHTHOUSE_THRESHOLD_PERFORMANCE) : 80,
    accessibility: process.env.LIGHTHOUSE_THRESHOLD_ACCESSIBILITY ? parseInt(process.env.LIGHTHOUSE_THRESHOLD_ACCESSIBILITY) : 90,
    'best-practices': process.env.LIGHTHOUSE_THRESHOLD_BEST_PRACTICES ? parseInt(process.env.LIGHTHOUSE_THRESHOLD_BEST_PRACTICES) : 85,
    seo: process.env.LIGHTHOUSE_THRESHOLD_SEO ? parseInt(process.env.LIGHTHOUSE_THRESHOLD_SEO) : 85,
    overall: process.env.LIGHTHOUSE_THRESHOLD_OVERALL ? parseInt(process.env.LIGHTHOUSE_THRESHOLD_OVERALL) : 80,
  };

  console.log('Using thresholds:', JSON.stringify(THRESHOLDS, null, 2));

  // Run audit
  const urls = [siteUrl, `${siteUrl}/roasts`];
  runMultipleAudits(urls).then(results => {
    displayResults(results);

    // Check thresholds
    const validResults = results.filter(r => !r.error);
    const averages = getAverageScores(results);

    if (!averages) {
      console.error('❌ No valid audit results to evaluate');
      process.exit(1);
    }

    const checks = {
      performance: parseFloat(averages.performance) >= THRESHOLDS.performance,
      accessibility: parseFloat(averages.accessibility) >= THRESHOLDS.accessibility,
      'best-practices': parseFloat(averages['best-practices']) >= THRESHOLDS['best-practices'],
      seo: parseFloat(averages.seo) >= THRESHOLDS.seo,
    };

    const overall = Math.round(
      (parseFloat(averages.performance) * 0.25) +
      (parseFloat(averages.accessibility) * 0.25) +
      (parseFloat(averages['best-practices']) * 0.25) +
      (parseFloat(averages.seo) * 0.25)
    );

    checks.overall = overall >= THRESHOLDS.overall;

    const allPass = Object.values(checks).every(check => check);

    if (!allPass) {
      console.error('\n❌ Lighthouse CI checks failed!');
      console.error('Some scores are below the required thresholds.');
      process.exit(1);
    }

    console.log('\n✅ Lighthouse CI checks passed!');
    process.exit(0);
  }).catch(error => {
    console.error('❌ Lighthouse CI failed:', error);
    process.exit(1);
  });
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'audit';

  // Default URLs to audit
  const defaultUrls = [
    siteUrl,
    `${siteUrl}/roasts`,
  ];

  switch (command) {
    case 'audit':
      const urls = args.length > 1 ? args.slice(1) : defaultUrls;
      const results = await runMultipleAudits(urls);
      saveResults(results);
      displayResults(results);
      console.log(`\n✨ Audit complete!`);
      break;

    case 'desktop':
      const desktopResults = await runMultipleAudits(defaultUrls, {
        formFactor: 'desktop',
      });
      saveResults(desktopResults, 'desktop-audit-results.json');
      break;

    case 'mobile':
      const mobileResults = await runMultipleAudits(defaultUrls, {
        formFactor: 'mobile',
      });
      saveResults(mobileResults, 'mobile-audit-results.json');
      break;

    case 'single':
      if (args.length < 2) {
        console.error('Usage: npm run lighthouse single <url>');
        process.exit(1);
      }
      const singleUrl = args[1];
      const singleResult = await runLighthouse(singleUrl);
      displayResults([singleResult]);
      break;

    case 'analyze':
    case 'latest':
      analyzeLatestReport();
      break;

    case 'compare':
      compareLastTwoReports();
      break;

    case 'ci':
      runCI();
      return; // Don't continue execution

    default:
      console.log('Lighthouse Audit Tool');
      console.log('====================');
      console.log('');
      console.log('Common commands:');
      console.log('  npm run lighthouse          - Run basic audit');
      console.log('  npm run lighthouse:ci       - Run with CI thresholds');
      console.log('');
      console.log('Advanced commands (use script directly):');
      console.log('  node scripts/run-lighthouse.js audit [urls...]');
      console.log('  node scripts/run-lighthouse.js desktop');
      console.log('  node scripts/run-lighthouse.js mobile');
      console.log('  node scripts/run-lighthouse.js single <url>');
      console.log('  node scripts/run-lighthouse.js analyze');
      console.log('  node scripts/run-lighthouse.js compare');
      break;
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  runLighthouse,
  runMultipleAudits,
  saveResults,
  getAverageScores,
};
