const fs = require('fs')
const path = require('path')

// Copy the scraped data file to the website directory
const sourcePath = path.join(__dirname, '../../all_colony_data_improved.json')
const destPath = path.join(__dirname, '../all_colony_data_improved.json')

try {
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath)
    console.log('✓ Data file copied successfully')
  } else {
    console.error('✗ Source data file not found at:', sourcePath)
    console.log('Please ensure all_colony_data_improved.json exists in the parent directory')
  }
} catch (error) {
  console.error('Error copying data file:', error)
}
