// ============================================
// HILLWAY ALPHA - Display Formatting
// ============================================

import chalk from 'chalk';
import Table from 'cli-table3';
import { ArbitrageOpportunity } from '@/lib/types/scanner';
import { formatCurrency as _formatCurrency, formatPercent as _formatPercent } from './calculations';

// Re-export formatting functions
export const formatCurrency = _formatCurrency;
export const formatPercent = _formatPercent;

/**
 * Format hours until event as human-readable
 */
export function formatTimeUntil(hours: number): string {
  if (hours < 1) {
    const mins = Math.round(hours * 60);
    return chalk.red(`${mins}m`);
  } else if (hours < 6) {
    return chalk.yellow(`${hours.toFixed(1)}h`);
  } else if (hours < 24) {
    return chalk.green(`${hours.toFixed(1)}h`);
  } else {
    const days = Math.floor(hours / 24);
    const remainingHours = Math.round(hours % 24);
    return `${days}d ${remainingHours}h`;
  }
}

/**
 * Format margin with color coding
 */
export function formatMargin(margin: number): string {
  if (margin >= 5) {
    return chalk.green.bold(`+${margin.toFixed(2)}%`);
  } else if (margin >= 3) {
    return chalk.green(`+${margin.toFixed(2)}%`);
  } else if (margin >= 1.5) {
    return chalk.yellow(`+${margin.toFixed(2)}%`);
  } else {
    return `+${margin.toFixed(2)}%`;
  }
}

/**
 * Create a formatted table of arbitrage opportunities
 */
export function formatArbitrageTable(
  opportunities: ArbitrageOpportunity[],
  detailed: boolean = false
): string {
  if (opportunities.length === 0) {
    return chalk.yellow('No arbitrage opportunities found.');
  }

  const output: string[] = [];

  // Summary table
  const summaryTable = new Table({
    head: [
      chalk.cyan('Event'),
      chalk.cyan('Sport'),
      chalk.cyan('Margin'),
      chalk.cyan('Profit'),
      chalk.cyan('Starts In'),
    ],
    colWidths: [40, 25, 12, 12, 12],
    wordWrap: true,
  });

  for (const opp of opportunities) {
    summaryTable.push([
      opp.event,
      opp.sportTitle,
      formatMargin(opp.margin),
      chalk.green(formatCurrency(opp.guaranteedProfit)),
      formatTimeUntil(opp.hoursUntilStart),
    ]);
  }

  output.push(chalk.bold.green(`\n🎯 Found ${opportunities.length} Arbitrage Opportunities\n`));
  output.push(summaryTable.toString());

  // Detailed breakdown if requested
  if (detailed) {
    output.push('\n' + chalk.bold.cyan('📊 Stake Breakdown\n'));

    for (const opp of opportunities) {
      output.push(chalk.bold(`\n${opp.event}`));
      output.push(chalk.gray(`Event ID: ${opp.eventId} | Starts: ${opp.commenceTime.toLocaleString()}`));

      const stakeTable = new Table({
        head: [
          chalk.cyan('Outcome'),
          chalk.cyan('Bookmaker'),
          chalk.cyan('Odds'),
          chalk.cyan('Stake'),
          chalk.cyan('Return'),
        ],
        colWidths: [20, 20, 10, 12, 12],
      });

      for (const stake of opp.stakes) {
        stakeTable.push([
          stake.team,
          stake.bookmaker,
          stake.odds.toFixed(2),
          formatCurrency(stake.stake),
          formatCurrency(stake.potentialReturn),
        ]);
      }

      output.push(stakeTable.toString());
      output.push(chalk.gray(`Total Stake: ${formatCurrency(opp.totalStake)} | `) +
                  chalk.green(`Guaranteed Return: ${formatCurrency(opp.guaranteedReturn)} | `) +
                  chalk.green.bold(`Profit: ${formatCurrency(opp.guaranteedProfit)}`));
    }
  }

  return output.join('\n');
}

/**
 * Format the header for CLI output
 */
export function formatHeader(): string {
  return chalk.bold.blue(`
╔═══════════════════════════════════════════════════════════╗
║           HILLWAY ALPHA - Opportunity Scanner             ║
║              Multi-Asset Intelligence System              ║
╚═══════════════════════════════════════════════════════════╝
`);
}

/**
 * Format quota status
 */
export function formatQuotaStatus(used: number, remaining: number): string {
  const total = used + remaining;
  const percentUsed = (used / total) * 100;

  let color = chalk.green;
  if (percentUsed > 80) color = chalk.red;
  else if (percentUsed > 50) color = chalk.yellow;

  return chalk.gray(`API Quota: ${color(`${used}/${total}`)} requests used`);
}

/**
 * Format a loading spinner message
 */
export function formatScanningMessage(sport: string): string {
  return `Scanning ${chalk.cyan(sport)} for opportunities...`;
}

/**
 * Format error message
 */
export function formatError(message: string): string {
  return chalk.red(`❌ Error: ${message}`);
}

/**
 * Format success message
 */
export function formatSuccess(message: string): string {
  return chalk.green(`✅ ${message}`);
}

/**
 * Format warning message
 */
export function formatWarning(message: string): string {
  return chalk.yellow(`⚠️  ${message}`);
}

/**
 * Format info message
 */
export function formatInfo(message: string): string {
  return chalk.blue(`ℹ️  ${message}`);
}
