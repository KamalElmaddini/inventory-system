const fs = require('fs');
const path = require('path');
const logFile = 'debug_out.txt';
fs.writeFileSync(logFile, '--- START DEBUG ---\n');
function log(msg) {
    console.log(msg);
    fs.appendFileSync(logFile, msg + '\n');
}

const modules = [
    './src/config/database',
    './src/models/User',
    './src/models/Product',
    './src/middleware/authMiddleware',
    './src/controllers/authController',
    './src/controllers/productController',
    './src/controllers/userController',
    './src/routes/api',
    './src/app'
];

console.log('--- START DEBUG ---');
for (const mod of modules) {
    try {
        log(`Loading ${mod}...`);
        require(mod);
        log(`✅ Success: ${mod}`);
    } catch (e) {
        log(`❌ FAIL: ${mod}`);
        log(`Error Code: ${e.code}`);
        log(`Error Message: ${e.message}`);
        log(`Stack: ${e.stack}`);
    }
}
log('--- END DEBUG ---');
