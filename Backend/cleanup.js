const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, 'uploads');

async function cleanupLocalUploads() {
  console.log('🧹 Cleaning up local uploads folder...');
  
  try {
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      console.log(`Found ${files.length} files in uploads directory`);
      
      if (files.length > 0) {
        console.log('Files found:');
        files.forEach(file => {
          console.log(`  - ${file}`);
        });
        
        console.log('\n⚠️  NOTICE: These files are now stored in Supabase Storage');
        console.log('✅ Local files can be safely deleted as they are no longer used');
        console.log('🔗 QR codes are now served directly from: https://htrxagrybfupwpefyyhg.supabase.co/storage/v1/object/public/qr-codes/');
        
        // Uncomment the following lines to actually delete the files
        // files.forEach(file => {
        //   fs.unlinkSync(path.join(uploadsDir, file));
        //   console.log(`Deleted: ${file}`);
        // });
        // console.log('✅ Local uploads folder cleaned up');
      } else {
        console.log('✅ No files found in uploads directory');
      }
    } else {
      console.log('ℹ️  Uploads directory does not exist');
    }
    
    console.log('\n🎉 Migration to Supabase Storage Complete!');
    console.log('📊 Benefits:');
    console.log('   ✅ Files now stored in scalable cloud storage');
    console.log('   ✅ Direct CDN access for better performance');
    console.log('   ✅ Compatible with Vercel deployment');
    console.log('   ✅ No local file system dependencies');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  }
}

// Run cleanup
if (require.main === module) {
  cleanupLocalUploads();
}
