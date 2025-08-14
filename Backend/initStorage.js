const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const { supabaseAdmin } = require('./config/supabase');

async function initializeStorageBuckets() {
  console.log('Initializing Supabase Storage buckets...');

  const buckets = [
    {
      name: 'qr-codes',
      public: true,
      allowedMimeTypes: ['image/png', 'image/jpeg'],
      fileSizeLimit: 5242880 // 5MB
    },
    {
      name: 'profile-images',
      public: true,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg'],
      fileSizeLimit: 10485760 // 10MB
    },
    {
      name: 'uploads',
      public: true,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'],
      fileSizeLimit: 20971520 // 20MB
    }
  ];

  for (const bucket of buckets) {
    try {
      // Check if bucket exists
      const { data: existingBuckets, error: listError } = await supabaseAdmin.storage.listBuckets();
      
      if (listError) {
        console.error('Error listing buckets:', listError);
        continue;
      }

      const bucketExists = existingBuckets.some(b => b.name === bucket.name);

      if (!bucketExists) {
        console.log(`Creating bucket: ${bucket.name}`);
        
        const { data, error } = await supabaseAdmin.storage.createBucket(bucket.name, {
          public: bucket.public,
          allowedMimeTypes: bucket.allowedMimeTypes,
          fileSizeLimit: bucket.fileSizeLimit
        });

        if (error) {
          console.error(`Error creating bucket ${bucket.name}:`, error);
        } else {
          console.log(`✅ Successfully created bucket: ${bucket.name}`);
        }
      } else {
        console.log(`✅ Bucket ${bucket.name} already exists`);
      }

    } catch (error) {
      console.error(`Error with bucket ${bucket.name}:`, error);
    }
  }

  console.log('Bucket initialization complete!');
}

// Run the initialization
if (require.main === module) {
  initializeStorageBuckets()
    .then(() => {
      console.log('All done!');
      process.exit(0);
    })
    .catch(error => {
      console.error('Initialization failed:', error);
      process.exit(1);
    });
}

module.exports = { initializeStorageBuckets };
