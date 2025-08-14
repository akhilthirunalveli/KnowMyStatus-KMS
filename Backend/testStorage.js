const dotenv = require('dotenv');
dotenv.config();

const supabaseStorage = require('./utils/supabaseStorage');

async function testStorageIntegration() {
  console.log('Testing Supabase Storage integration...');

  try {
    // Test creating a simple QR code
    const testData = JSON.stringify({
      teacherId: 'test-123',
      name: 'Test Teacher',
      status: 'available'
    });

    // Create a simple test buffer (simulating QR code)
    const testBuffer = Buffer.from('Test QR data');

    console.log('Uploading test QR code...');
    const result = await supabaseStorage.uploadQRCode(testBuffer, 'test-123');
    
    if (result.success) {
      console.log('✅ Upload successful!');
      console.log('Public URL:', result.data.publicUrl);
      
      // Test getting public URL
      const publicUrl = supabaseStorage.getPublicUrl(
        supabaseStorage.buckets.QR_CODES, 
        result.data.path
      );
      console.log('✅ Public URL generated:', publicUrl);
      
      // Clean up test file
      console.log('Cleaning up test file...');
      const deleteResult = await supabaseStorage.deleteFile(
        supabaseStorage.buckets.QR_CODES, 
        result.data.path
      );
      
      if (deleteResult.success) {
        console.log('✅ Test file cleaned up successfully');
      } else {
        console.log('⚠️ Failed to clean up test file:', deleteResult.error);
      }
      
    } else {
      console.error('❌ Upload failed:', result.error);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }

  console.log('Storage integration test complete!');
}

// Run the test
if (require.main === module) {
  testStorageIntegration()
    .then(() => {
      console.log('Test completed!');
      process.exit(0);
    })
    .catch(error => {
      console.error('Test failed:', error);
      process.exit(1);
    });
}
