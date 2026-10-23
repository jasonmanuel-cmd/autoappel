import { defineConfig, devices } from '@playwright/test'
export default defineConfig({
  testDir:'./e2e', testMatch:'regression.spec.ts', fullyParallel:true, workers:2,
  use: { baseURL:'http://127.0.0.1:3100', trace:'retain-on-failure',
    launchOptions: process.env.CHROMIUM_EXECUTABLE_PATH ? { executablePath:process.env.CHROMIUM_EXECUTABLE_PATH,args:['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader'] } : {},
  },
  projects:[{ name:'desktop',use:{...devices['Desktop Chrome']} },{ name:'mobile',use:{...devices['iPhone 13'],defaultBrowserType:'chromium'} }],
  webServer:{command:'npm run start',url:'http://127.0.0.1:3100',env:{PORT:'3100'},reuseExistingServer:false,timeout:60000},
})
