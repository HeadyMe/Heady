#!/usr/bin/env node
// Heady CLI — Sacred Geometry AI Assistant
// Usage: heady <command> [options]

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import Conf from 'conf';

const config = new Conf({ projectName: 'heady-cli' });
const program = new Command();

program
  .name('heady')
  .description('Heady AI — command-line assistant')
  .version('0.1.0');

program
  .command('chat <message>')
  .description('Send a message to Heady')
  .option('-a, --agent <name>', 'Use a specific agent')
  .option('-s, --stream', 'Stream the response')
  .action(async (message, opts) => {
    const spinner = ora('Thinking...').start();
    try {
      const baseUrl = config.get('api_url') || 'http://localhost:3300';
      const apiKey = config.get('api_key') || process.env.HEADY_API_KEY || '';
      const headers = { 'Content-Type': 'application/json' };
      if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;

      const resp = await fetch(`${baseUrl}/api/chat`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ message, agent: opts.agent }),
      });

      if (!resp.ok) throw new Error(`API error: ${resp.status}`);
      const data = await resp.json();
      spinner.stop();
      console.log(chalk.cyan('\nHeady: ') + data.message);
    } catch (err) {
      spinner.fail(chalk.red(err.message));
      process.exit(1);
    }
  });

program
  .command('health')
  .description('Check Heady API health')
  .action(async () => {
    try {
      const baseUrl = config.get('api_url') || 'http://localhost:3300';
      const resp = await fetch(`${baseUrl}/api/health`);
      const data = await resp.json();
      if (data.ok) {
        console.log(chalk.green('✓ Heady is healthy'));
        console.log(`  Service: ${data.service}`);
        console.log(`  Time:    ${data.ts}`);
      } else {
        console.log(chalk.red('✗ Heady is not healthy'));
      }
    } catch (err) {
      console.log(chalk.red(`✗ Cannot reach Heady: ${err.message}`));
    }
  });

program
  .command('config <action> [key] [value]')
  .description('Manage CLI configuration (set/get/list)')
  .action((action, key, value) => {
    if (action === 'set' && key && value) {
      config.set(key, value);
      console.log(chalk.green(`Set ${key} = ${value}`));
    } else if (action === 'get' && key) {
      console.log(config.get(key) || '(not set)');
    } else if (action === 'list') {
      console.log(JSON.stringify(config.store, null, 2));
    } else {
      console.log('Usage: heady config set <key> <value>');
      console.log('       heady config get <key>');
      console.log('       heady config list');
    }
  });

program
  .command('agents')
  .description('List available agents')
  .action(async () => {
    try {
      const baseUrl = config.get('api_url') || 'http://localhost:3300';
      const resp = await fetch(`${baseUrl}/api/agents`);
      const data = await resp.json();
      console.log(chalk.bold('\nAvailable Agents:\n'));
      (data.agents || []).forEach((a) => {
        console.log(`  ${chalk.cyan(a.name)} — ${a.description || ''}`);
      });
    } catch (err) {
      console.log(chalk.red(`Error: ${err.message}`));
    }
  });

program
  .command('status')
  .description('Show system status (pulse)')
  .action(async () => {
    try {
      const baseUrl = config.get('api_url') || 'http://localhost:3300';
      const resp = await fetch(`${baseUrl}/api/pulse`);
      const data = await resp.json();
      console.log(chalk.bold('\nHeady System Status:\n'));
      console.log(JSON.stringify(data, null, 2));
    } catch (err) {
      console.log(chalk.red(`Error: ${err.message}`));
    }
  });

program.parse();
