#!/usr/bin/env node

/**
 * Basic functionality test for ContentSync MVP
 * This script tests key functionality without requiring a full test framework
 */

const https = require('https');
const http = require('http');

const BASE_URL = 'http://localhost:3002';

// Test configuration
const tests = [
  {
    name: 'Homepage loads',
    path: '/',
    method: 'GET',
    expectedStatus: 200
  },
  {
    name: 'Auth page loads',
    path: '/auth',
    method: 'GET',
    expectedStatus: 200
  },
  {
    name: 'Content gaps page loads',
    path: '/content-gaps',
    method: 'GET',
    expectedStatus: 200
  },
  {
    name: 'Repurpose page loads',
    path: '/repurpose',
    method: 'GET',
    expectedStatus: 200
  },
  {
    name: 'Review queue page loads',
    path: '/review-queue',
    method: 'GET',
    expectedStatus: 200
  },
  {
    name: 'Settings page loads',
    path: '/settings',
    method: 'GET',
    expectedStatus: 200
  },
  {
    name: 'Platforms API endpoint exists',
    path: '/api/platforms',
    method: 'GET',
    expectedStatus: [401, 200] // 401 is expected without auth
  },
  {
    name: 'Repurpose API endpoint exists',
    path: '/api/repurpose',
    method: 'POST',
    expectedStatus: [401, 400, 200] // Various expected responses without proper auth/data
  }
];

function makeRequest(test) {
  return new Promise((resolve) => {
    const url = new URL(test.path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: test.method,
      headers: {
        'User-Agent': 'ContentSync-Test/1.0'
      }
    };

    if (test.method === 'POST') {
      options.headers['Content-Type'] = 'application/json';
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const expectedStatuses = Array.isArray(test.expectedStatus) 
          ? test.expectedStatus 
          : [test.expectedStatus];
        
        const success = expectedStatuses.includes(res.statusCode);
        
        resolve({
          name: test.name,
          success,
          statusCode: res.statusCode,
          expectedStatus: test.expectedStatus,
          error: success ? null : `Expected ${test.expectedStatus}, got ${res.statusCode}`
        });
      });
    });

    req.on('error', (error) => {
      resolve({
        name: test.name,
        success: false,
        statusCode: null,
        expectedStatus: test.expectedStatus,
        error: error.message
      });
    });

    if (test.method === 'POST') {
      req.write(JSON.stringify({}));
    }
    
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Running ContentSync MVP functionality tests...\n');
  
  const results = [];
  
  for (const test of tests) {
    process.stdout.write(`Testing: ${test.name}... `);
    const result = await makeRequest(test);
    results.push(result);
    
    if (result.success) {
      console.log('✅ PASS');
    } else {
      console.log(`❌ FAIL - ${result.error}`);
    }
  }
  
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${Math.round((passed / results.length) * 100)}%`);
  
  if (failed > 0) {
    console.log('\n❌ Failed Tests:');
    results.filter(r => !r.success).forEach(result => {
      console.log(`  - ${result.name}: ${result.error}`);
    });
  }
  
  console.log('\n🎯 Next Steps:');
  console.log('- Test authentication flow manually');
  console.log('- Test AI content generation with valid API key');
  console.log('- Test database operations with Supabase');
  console.log('- Verify environment variables are properly configured');
  
  process.exit(failed > 0 ? 1 : 0);
}

// Check if server is running
console.log(`🔍 Checking if development server is running at ${BASE_URL}...`);
makeRequest({ name: 'Server Check', path: '/', method: 'GET', expectedStatus: 200 })
  .then(result => {
    if (result.success) {
      console.log('✅ Development server is running\n');
      runTests();
    } else {
      console.log('❌ Development server is not running');
      console.log('Please start the development server with: npm run dev');
      process.exit(1);
    }
  });
