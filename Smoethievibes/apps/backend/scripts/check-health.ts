
async function checkHealth() {
    const colors = {
        green: '\x1b[32m',
        red: '\x1b[31m',
        yellow: '\x1b[33m',
        reset: '\x1b[0m',
        bold: '\x1b[1m'
    };

    console.log(`${colors.bold}Starting Health Check...${colors.reset}\n`);

    // 1. Check Backend
    try {
        const backendUrl = 'http://localhost:3001/health';
        console.log(`Checking Backend (${backendUrl})...`);
        const backendRes = await fetch(backendUrl);

        if (backendRes.ok) {
            const data = await backendRes.json();
            console.log(`${colors.green}✔ Backend is UP${colors.reset}`);
            console.log(`  Status: ${data.status}`);
            console.log(`  Database: ${data.services?.database}`);
        } else {
            console.log(`${colors.red}✘ Backend returned ${backendRes.status}${colors.reset}`);
        }
    } catch (error: any) {
        console.log(`${colors.red}✘ Backend is DOWN or Unreachable${colors.reset}`);
        console.log(`  Error: ${error.message}`);
    }

    console.log('');

    // 2. Check Frontend
    try {
        const frontendUrl = 'http://localhost:3000';
        console.log(`Checking Frontend (${frontendUrl})...`);
        const frontendRes = await fetch(frontendUrl);

        if (frontendRes.ok) {
            console.log(`${colors.green}✔ Frontend is UP${colors.reset}`);
            console.log(`  Status: ${frontendRes.status}`);
        } else {
            console.log(`${colors.red}✘ Frontend returned ${frontendRes.status}${colors.reset}`);
        }
    } catch (error: any) {
        console.log(`${colors.red}✘ Frontend is DOWN or Unreachable${colors.reset}`);
        console.log(`  Error: ${error.message}`);
    }

    console.log(`\n${colors.bold}Health Check Complete.${colors.reset}`);
}

checkHealth();
