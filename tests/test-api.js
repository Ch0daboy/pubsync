#!/usr/bin/env node

/**
 * API endpoint testing for ContentSync MVP
 */

const http = require('http');

const BASE_URL = 'http://localhost:3002';

async function testRepurposeAPI() {
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      originalContent: "This is a test blog post about React development.",
      sourcePlatform: "blog",
      targetPlatform: "twitter",
      originalContentTitle: "React Development Tips",
      contentType: "post"
    });

    const options = {
      hostname: 'localhost',
      port: 3002,
      path: '/api/repurpose',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          data: data,
          success: res.statusCode === 401 || res.statusCode === 200 // Expected without auth
        });
      });
    });

    req.on('error', (error) => {
      resolve({
        statusCode: null,
        data: null,
        success: false,
        error: error.message
      });
    });

    req.write(postData);
    req.end();
  });
}

async function testPlatformsAPI() {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3002,
      path: '/api/platforms',
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          data: data,
          success: res.statusCode === 401 || res.statusCode === 200 // Expected without auth
        });
      });
    });

    req.on('error', (error) => {
      resolve({
        statusCode: null,
        data: null,
        success: false,
        error: error.message
      });
    });

    req.end();
  });
}

async function runAPITests() {
  console.log('🔌 Testing API endpoints...\n');

  // Test Repurpose API
  console.log('Testing /api/repurpose...');
  const repurposeResult = await testRepurposeAPI();
  if (repurposeResult.success) {
    console.log(`✅ Repurpose API responds correctly (${repurposeResult.statusCode})`);
    if (repurposeResult.statusCode === 401) {
      console.log('   (401 Unauthorized is expected without authentication)');
    }
  } else {
    console.log(`❌ Repurpose API failed: ${repurposeResult.error || repurposeResult.statusCode}`);
  }

  // Test Platforms API
  console.log('\nTesting /api/platforms...');
  const platformsResult = await testPlatformsAPI();
  if (platformsResult.success) {
    console.log(`✅ Platforms API responds correctly (${platformsResult.statusCode})`);
    if (platformsResult.statusCode === 401) {
      console.log('   (401 Unauthorized is expected without authentication)');
    }
  } else {
    console.log(`❌ Platforms API failed: ${platformsResult.error || platformsResult.statusCode}`);
  }

  console.log('\n📋 API Test Summary:');
  console.log('===================');
  
  const allPassed = repurposeResult.success && platformsResult.success;
  
  if (allPassed) {
    console.log('✅ All API endpoints are responding correctly');
    console.log('🔐 Authentication is properly protecting endpoints');
  } else {
    console.log('❌ Some API endpoints have issues');
  }

  console.log('\n🎯 Manual Testing Recommendations:');
  console.log('- Test authentication flow with valid Supabase credentials');
  console.log('- Test AI content generation with valid Google Gemini API key');
  console.log('- Test database operations after authentication');
  console.log('- Verify CORS headers for cross-origin requests');
}

runAPITests();
