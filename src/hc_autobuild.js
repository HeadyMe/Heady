// HEADY_BRAND:BEGIN
// HEADY SYSTEMS :: SACRED GEOMETRY
// FILE: src/hc_autobuild.js
// LAYER: backend/src
// 
//         _   _  _____    _    ____   __   __
//        | | | || ____|  / \  |  _ \ \ \ / /
//        | |_| ||  _|   / _ \ | | | | \ V / 
//        |  _  || |___ / ___ \| |_| |  | |  
//        |_| |_||_____/_/   \_\____/   |_|  
// 
//    Sacred Geometry :: Organic Systems :: Breathing Interfaces
// HEADY_BRAND:END

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('\n🔨 Heady AutoBuild - Sacred Geometry Build System with Codemap Optimization\n');

<<<<<<< C:/Users/erich/Heady/src/hc_autobuild.js
<<<<<<< C:/Users/erich/Heady/src/hc_autobuild.js
<<<<<<< C:/Users/erich/Heady/src/hc_autobuild.js
<<<<<<< C:/Users/erich/Heady/src/hc_autobuild.js
<<<<<<< C:/Users/erich/Heady/src/hc_autobuild.js
<<<<<<< C:/Users/erich/Heady/src/hc_autobuild.js
<<<<<<< C:/Users/erich/Heady/src/hc_autobuild.js
<<<<<<< C:/Users/erich/Heady/src/hc_autobuild.js
<<<<<<< C:/Users/erich/Heady/src/hc_autobuild.js
<<<<<<< C:/Users/erich/Heady/src/hc_autobuild.js
<<<<<<< C:/Users/erich/Heady/src/hc_autobuild.js
<<<<<<< C:/Users/erich/Heady/src/hc_autobuild.js
<<<<<<< C:/Users/erich/Heady/src/hc_autobuild.js
<<<<<<< C:/Users/erich/Heady/src/hc_autobuild.js
<<<<<<< C:/Users/erich/Heady/src/hc_autobuild.js
<<<<<<< C:/Users/erich/Heady/src/hc_autobuild.js
<<<<<<< C:/Users/erich/Heady/src/hc_autobuild.js
=======
>>>>>>> C:/Users/erich/Heady/src/hc_autobuild.js.undo_before
// Worktree base path (Windsurf worktree mode)
const WORKTREE_BASE = 'C:\\Users\\erich\\.windsurf\\worktrees';
=======
const WORKTREE_BASE = (() => {
  const explicit = process.env.WINDSURF_WORKTREES || process.env.HEADY_WORKTREES;
  if (explicit && typeof explicit === 'string' && explicit.trim()) return explicit.trim();
>>>>>>> C:/Users/erich/.windsurf/worktrees/Heady/Heady-316a4fbf/src/hc_autobuild.js
=======
const WORKTREE_BASE = (() => {
  const explicit = process.env.WINDSURF_WORKTREES || process.env.HEADY_WORKTREES;
  if (explicit && typeof explicit === 'string' && explicit.trim()) return explicit.trim();
>>>>>>> C:/Users/erich/.windsurf/worktrees/Heady/Heady-316a4fbf/src/hc_autobuild.js
=======
const WORKTREE_BASE = (() => {
  const explicit = process.env.WINDSURF_WORKTREES || process.env.HEADY_WORKTREES;
  if (explicit && typeof explicit === 'string' && explicit.trim()) return explicit.trim();
>>>>>>> C:/Users/erich/.windsurf/worktrees/Heady/Heady-316a4fbf/src/hc_autobuild.js

  const userProfile = process.env.USERPROFILE || process.env.HOME;
  if (!userProfile) return null;
  return path.join(userProfile, '.windsurf', 'worktrees');
})();

function discoverWorktrees() {
  const roots = [process.cwd()];

  if (WORKTREE_BASE && fs.existsSync(WORKTREE_BASE)) {
    try {
      const namespaces = fs.readdirSync(WORKTREE_BASE, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => path.join(WORKTREE_BASE, d.name));

      namespaces.forEach(nsPath => {
        let children = [];
        try {
          children = fs.readdirSync(nsPath, { withFileTypes: true })
            .filter(d => d.isDirectory())
            .map(d => path.join(nsPath, d.name));
        } catch {
          children = [];
        }

        children.forEach(childPath => {
          const base = path.basename(childPath);
          if (base.includes('-') || fs.existsSync(path.join(childPath, '.git'))) {
            roots.push(childPath);
          }
        });
      });
    } catch (err) {
      console.log(`⚠️  Error discovering worktrees: ${err.message}`);
    }
  }
  return [...new Set(roots.filter(p => {
    try {
      return fs.existsSync(p) && fs.statSync(p).isDirectory();
    } catch {
      return false;
    }
  }))];
}

// Scan for sub-projects with package.json
function findBuildableProjects(baseDir, depth = 2) {
  const projects = [];
  
  function scan(dir, currentDepth) {
    if (currentDepth > depth) return;
    
    const packageJson = path.join(dir, 'package.json');
    if (fs.existsSync(packageJson)) {
      projects.push(dir);
    }
    
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      entries.forEach(entry => {
        if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
          scan(path.join(dir, entry.name), currentDepth + 1);
        }
      });
    } catch (err) {
      // Skip inaccessible directories
    }
  }
  
  scan(baseDir, 0);
  return projects;
}

// Build metrics tracking
const buildMetrics = {
  startTime: Date.now(),
  reposBuilt: 0,
  dependenciesInstalled: 0,
  errors: [],
  optimizations: []
};

function analyzeDependencies(repo) {
  const packageJson = path.join(repo, 'package.json');
  if (!fs.existsSync(packageJson)) return null;
  
  try {
    const pkg = JSON.parse(fs.readFileSync(packageJson, 'utf8'));
    return {
      name: pkg.name || path.basename(repo),
      dependencies: Object.keys(pkg.dependencies || {}),
      devDependencies: Object.keys(pkg.devDependencies || {}),
      scripts: pkg.scripts || {},
      hasBuildScript: !!(pkg.scripts && (pkg.scripts.build || pkg.scripts.start))
    };
  } catch (error) {
    console.log(`⚠️  ${repo} - Could not analyze package.json`);
    return null;
  }
}

function generateBuildOrder(projectPaths) {
  const analysis = projectPaths.map(repo => ({
    path: repo,
    info: analyzeDependencies(repo)
  })).filter(r => r.info);
  
  return analysis.sort((a, b) => {
    const aScore = a.info.hasBuildScript ? 10 : 0;
    const bScore = b.info.hasBuildScript ? 10 : 0;
    const aDeps = a.info.dependencies.length;
    const bDeps = b.info.dependencies.length;
    
    return (bScore - aScore) || (aDeps - bDeps);
  });
}

function runOptimizedBuild(repo, info) {
  console.log(`📦 Building: ${repo}`);
  console.log(`   Name: ${info.name}`);
  console.log(`   Dependencies: ${info.dependencies.length}`);
  console.log(`   Dev Dependencies: ${info.devDependencies.length}`);
  
  try {
    execSync('pnpm install --frozen-lockfile 2>nul || pnpm install', { 
      cwd: repo, 
      stdio: 'inherit',
      shell: true
    });
    buildMetrics.dependenciesInstalled++;
    buildMetrics.reposBuilt++;
    
    if (info.scripts.build) {
      console.log(`   🏗️  Running build script...`);
      execSync('pnpm run build', { cwd: repo, stdio: 'inherit' });
      buildMetrics.optimizations.push(`Built ${info.name} with custom script`);
    } else if (info.scripts.start) {
      console.log(`   🚀 Using start script as build alternative...`);
      buildMetrics.optimizations.push(`Used start script for ${info.name}`);
    }
    
    console.log(`✅ ${info.name} - Complete\n`);
    return true;
  } catch (error) {
    const errorMsg = `${info.name} - Build failed: ${error.message}`;
    console.log(`❌ ${errorMsg}\n`);
    buildMetrics.errors.push(errorMsg);
    return false;
  }
}

function generateBuildReport(totalProjects) {
  const duration = Date.now() - buildMetrics.startTime;
  const report = `
╔════════════════════════════════════════════════════════════════╗
║                    🏗️ HEADY AUTOBUILD REPORT                 ║
╠════════════════════════════════════════════════════════════════╣
║ Duration: ${(duration / 1000).toFixed(2)}s                               ║
║ Projects Built: ${buildMetrics.reposBuilt}/${totalProjects}                             ║
║ Dependencies Installed: ${buildMetrics.dependenciesInstalled}                       ║
║ Errors: ${buildMetrics.errors.length}                                      ║
║ Optimizations: ${buildMetrics.optimizations.length}                              ║
╚════════════════════════════════════════════════════════════════╝

${buildMetrics.optimizations.length > 0 ? 
  '🚀 OPTIMIZATIONS APPLIED:\n' + buildMetrics.optimizations.map(opt => `   • ${opt}`).join('\n') + '\n' : 
  ''}${
  buildMetrics.errors.length > 0 ? 
  '⚠️  ERRORS ENCOUNTERED:\n' + buildMetrics.errors.map(err => `   • ${err}`).join('\n') + '\n' : 
  ''
}
📊 Codemap insights: Build order optimized based on dependency analysis
🎯 Next step: Run HeadySync (hc -a hs) to synchronize changes
`;
  
  console.log(report);
  
  const reportPath = path.join(__dirname, '..', 'logs', 'autobuild-report.json');
  const logDir = path.dirname(reportPath);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    metrics: buildMetrics,
    duration: duration,
    report: report
  }, null, 2));
  
  console.log(`📊 Detailed report saved to: ${reportPath}\n`);
}

// Main execution
console.log('🔍 Discovering worktrees...');
const worktrees = discoverWorktrees();
console.log(`   Found ${worktrees.length} worktrees\n`);

console.log('📋 Finding buildable projects...');
const allProjects = [];
worktrees.forEach(wt => {
  const projects = findBuildableProjects(wt);
  allProjects.push(...projects);
});
const uniqueProjects = [...new Set(allProjects)];
console.log(`   Found ${uniqueProjects.length} unique buildable projects\n`);

console.log('🔍 Analyzing repository dependencies for optimal build order...\n');
const buildOrder = generateBuildOrder(uniqueProjects);

console.log('📋 Optimized Build Order:');
buildOrder.forEach((repo, index) => {
  console.log(`   ${index + 1}. ${repo.info.name} (${repo.path})`);
});
console.log('');

buildOrder.forEach(({ path: repo, info }) => {
  runOptimizedBuild(repo, info);
});

generateBuildReport(uniqueProjects.length);
