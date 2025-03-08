import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';

const ResumeUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setUploadStatus('idle');
        setErrorMessage('');
      } else {
        setErrorMessage('Please upload a PDF file');
        setFile(null);
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setUploadStatus('idle');

    try {
      // TODO: Implement file upload logic
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated upload
      setUploadStatus('success');
      // Clear form after successful upload
      setFile(null);
      if (e.target instanceof HTMLFormElement) {
        e.target.reset();
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadStatus('error');
      setErrorMessage('Failed to upload resume. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <div className="text-center mb-8">
            <FileText className="mx-auto h-12 w-12 text-primary-600" />
            <h2 className="mt-4 text-3xl font-bold text-gray-900">Upload Your Resume</h2>
            <p className="mt-2 text-gray-600">Upload your resume in PDF format to apply for jobs in Germany</p>
          </div>

          <form onSubmit={handleUpload} className="space-y-6">
            <div className="relative">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="resume-upload"
              />
              <motion.label
                htmlFor="resume-upload"
                className={`relative block w-full border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
                  ${file ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-500'}
                  transition-colors duration-200`}
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
              >
                <Upload className={`mx-auto h-12 w-12 ${file ? 'text-primary-600' : 'text-gray-400'}`} />
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  {file ? file.name : 'Drop your resume here or click to browse'}
                </span>
                <span className="mt-1 block text-xs text-gray-500">PDF up to 10MB</span>
              </motion.label>
            </div>

            {errorMessage && (
              <motion.div
                className="flex items-center space-x-2 text-red-600 bg-red-50/60 backdrop-blur-[2px] p-3 rounded-lg text-sm"
                initial={{ opacity: 0, y: -3 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
              >
                <AlertCircle className="h-4 w-4" />
                <span>{errorMessage}</span>
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={!file || isUploading}
              className={`w-full flex items-center justify-center space-x-2 px-6 py-3 text-white rounded-lg transition-colors ${
                !file || isUploading ? 'bg-primary-400 cursor-not-allowed' : 'bg-primary-500 hover:bg-primary-600'
              }`}
              whileHover={file && !isUploading ? { scale: 1.01 } : {}}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            >
              {isUploading ? (
                <>
                  <motion.div
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  <span className="text-white/90">Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Upload Resume</span>
                </>
              )}
            </motion.button>

            {uploadStatus === 'success' && (
              <motion.div
                className="flex items-center space-x-2 text-green-600 bg-green-50/60 backdrop-blur-[2px] p-3 rounded-lg text-sm"
                initial={{ opacity: 0, y: -3 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Resume uploaded successfully!</span>
              </motion.div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;
