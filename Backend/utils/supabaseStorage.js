const { supabase, supabaseAdmin } = require('../config/supabase');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

class SupabaseStorage {
  constructor() {
    this.buckets = {
      QR_CODES: 'qr-codes',
      PROFILE_IMAGES: 'profile-images',
      UPLOADS: 'uploads'
    };
  }

  /**
   * Upload a file to Supabase Storage
   * @param {Buffer|File} file - File buffer or file object
   * @param {string} bucket - Bucket name
   * @param {string} fileName - Custom file name (optional)
   * @param {string} folder - Folder path (optional)
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async uploadFile(file, bucket, fileName = null, folder = '') {
    try {
      // Generate unique filename if not provided
      const timestamp = Date.now();
      const uniqueId = uuidv4().split('-')[0];
      const fileExtension = fileName ? path.extname(fileName) : '.png';
      const finalFileName = fileName || `file_${timestamp}_${uniqueId}${fileExtension}`;
      
      // Construct full path
      const fullPath = folder ? `${folder}/${finalFileName}` : finalFileName;

      // Upload to Supabase Storage
      const { data, error } = await supabaseAdmin.storage
        .from(bucket)
        .upload(fullPath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Supabase upload error:', error);
        return { success: false, error: error.message };
      }

      // Get public URL
      const { data: urlData } = supabaseAdmin.storage
        .from(bucket)
        .getPublicUrl(fullPath);

      return {
        success: true,
        data: {
          path: data.path,
          fullPath: data.fullPath,
          publicUrl: urlData.publicUrl,
          fileName: finalFileName
        }
      };

    } catch (error) {
      console.error('Upload error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Upload QR Code
   * @param {Buffer} qrBuffer - QR code image buffer
   * @param {string} teacherId - Teacher ID
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async uploadQRCode(qrBuffer, teacherId) {
    const fileName = `teacher_${teacherId}_${Date.now()}.png`;
    return await this.uploadFile(qrBuffer, this.buckets.QR_CODES, fileName, 'teachers');
  }

  /**
   * Upload Profile Image
   * @param {Buffer} imageBuffer - Image buffer
   * @param {string} teacherId - Teacher ID
   * @param {string} originalName - Original file name
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async uploadProfileImage(imageBuffer, teacherId, originalName) {
    const fileExtension = path.extname(originalName);
    const fileName = `teacher_${teacherId}_profile${fileExtension}`;
    return await this.uploadFile(imageBuffer, this.buckets.PROFILE_IMAGES, fileName, 'teachers');
  }

  /**
   * Delete a file from Supabase Storage
   * @param {string} bucket - Bucket name
   * @param {string} filePath - File path to delete
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async deleteFile(bucket, filePath) {
    try {
      const { error } = await supabaseAdmin.storage
        .from(bucket)
        .remove([filePath]);

      if (error) {
        console.error('Delete error:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Delete error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get file public URL
   * @param {string} bucket - Bucket name
   * @param {string} filePath - File path
   * @returns {string} Public URL
   */
  getPublicUrl(bucket, filePath) {
    const { data } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  }

  /**
   * Download file as buffer
   * @param {string} bucket - Bucket name
   * @param {string} filePath - File path
   * @returns {Promise<{success: boolean, data?: Buffer, error?: string}>}
   */
  async downloadFile(bucket, filePath) {
    try {
      const { data, error } = await supabaseAdmin.storage
        .from(bucket)
        .download(filePath);

      if (error) {
        return { success: false, error: error.message };
      }

      const buffer = Buffer.from(await data.arrayBuffer());
      return { success: true, data: buffer };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * List files in a bucket/folder
   * @param {string} bucket - Bucket name
   * @param {string} folder - Folder path (optional)
   * @returns {Promise<{success: boolean, data?: any[], error?: string}>}
   */
  async listFiles(bucket, folder = '') {
    try {
      const { data, error } = await supabaseAdmin.storage
        .from(bucket)
        .list(folder);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = new SupabaseStorage();
