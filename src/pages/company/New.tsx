import React, { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createCompany } from "../../lib/api";
import { useAuth } from "../../lib/AuthContext";
import toast from "react-hot-toast";
import {
  FiTrello,
  FiUsers,
  FiAward,
  FiHeart,
  FiGlobe,
  FiSave,
  FiArrowLeft,
  FiUpload,
} from "react-icons/fi";
import ConfirmDialog from "../../components/ConfirmDialog";
import { supabase } from "../../lib/supabase";

// Constants
const INDUSTRIES = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
  "Retail",
  "Hospitality",
  "Construction",
  "Entertainment",
  "Automotive",
  "Energy",
  "Agriculture",
  "Transportation",
  "Real Estate",
  "Consulting",
].sort();

const COMPANY_SIZES = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1000+",
];

const BENEFITS = [
  { id: "health", label: "Health Insurance", icon: "🏥" },
  { id: "dental", label: "Dental Insurance", icon: "🦷" },
  { id: "vision", label: "Vision Insurance", icon: "👓" },
  { id: "life", label: "Life Insurance", icon: "🛡️" },
  { id: "401k", label: "401(k)", icon: "💰" },
  { id: "remote", label: "Remote Work", icon: "🏠" },
  { id: "flexible", label: "Flexible Hours", icon: "⏰" },
  { id: "pto", label: "Paid Time Off", icon: "✈️" },
  { id: "parental", label: "Parental Leave", icon: "👶" },
  { id: "development", label: "Professional Development", icon: "📚" },
  { id: "gym", label: "Gym Membership", icon: "💪" },
  { id: "events", label: "Company Events", icon: "🎉" },
  { id: "stock", label: "Stock Options", icon: "📈" },
  { id: "bonus", label: "Performance Bonus", icon: "🎯" },
  { id: "relocation", label: "Relocation Assistance", icon: "🚚" },
];

interface ValidationErrors {
  [key: string]: string;
}

function NewCompany() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [newBenefit, setNewBenefit] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showConfirm, setShowConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    website: string;
    location: string;
    size: string;
    industry: string;
    logo_url: string;
    founded_year: number;
    headquarters: string;
    benefits: string[];
    culture: string;
    mission: string;
    values: string;
    funding_stage: string;
    tech_stack: string;
    linkedin_url: string;
    twitter_url: string;
    facebook_url: string;
    contact_person_name: string;
    contact_person_number: string;
  }>({
    name: "",
    description: "",
    website: "",
    location: "",
    size: "",
    industry: "",
    logo_url: "",
    founded_year: new Date().getFullYear(),
    headquarters: "",
    benefits: [],
    culture: "",
    mission: "",
    values: "",
    funding_stage: "",
    tech_stack: "",
    linkedin_url: "",
    twitter_url: "",
    facebook_url: "",
    contact_person_name: "",
    contact_person_number: "",
  });

  // Add this at the beginning of the NewCompany component
  useEffect(() => {
    // Check if we have temporary profile data from signup
    const tempProfileData = localStorage.getItem("tempProfileData");

    if (tempProfileData) {
      try {
        const parsedData = JSON.parse(tempProfileData);
        // Verify this is an employer profile
        if (parsedData.user_type === "employer") {
          // Clear the temporary data after using it
          localStorage.removeItem("tempProfileData");
        } else {
          toast.error("Only employers can create company profiles", {
            duration: 4000,
            position: "bottom-right",
          });
          navigate("/dashboard");
        }
      } catch (err) {
        console.error("Error parsing temporary profile data:", err);
      }
    } else if (!user) {
      // If no user and no temp data, redirect to sign in
      navigate("/signin");
    }
  }, [user, navigate]);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Required fields validation
    if (!formData.name.trim()) {
      newErrors.name = "Company name is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Company description is required";
    }
    if (!formData.industry) {
      newErrors.industry = "Industry is required";
    }
    if (!formData.size) {
      newErrors.size = "Company size is required";
    }
    if (!formData.contact_person_name) {
      newErrors.contact_person_name = "Contact person name is required";
    }
    if (!formData.contact_person_number) {
      newErrors.contact_person_number = "Contact person number is required";
    }

    // URL validations
    const urlRegex = /^https?:\/\/.+/;
    if (formData.website && !urlRegex.test(formData.website)) {
      newErrors.website =
        "Please enter a valid URL starting with http:// or https://";
    }
    if (formData.logo_url && !urlRegex.test(formData.logo_url)) {
      newErrors.logo_url =
        "Please enter a valid URL starting with http:// or https://";
    }

    // Social media validations
    if (
      formData.linkedin_url &&
      !/^[a-zA-Z0-9-]+$/.test(formData.linkedin_url)
    ) {
      newErrors.linkedin_url = "Please enter a valid LinkedIn company name";
    }
    if (formData.twitter_url && !/^[a-zA-Z0-9_]+$/.test(formData.twitter_url)) {
      newErrors.twitter_url = "Please enter a valid Twitter handle";
    }

    // Founded year validation
    const currentYear = new Date().getFullYear();
    if (formData.founded_year < 1800 || formData.founded_year > currentYear) {
      newErrors.founded_year = `Year must be between 1800 and ${currentYear}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addBenefit = () => {
    if (newBenefit.trim()) {
      setFormData((prev) => ({
        ...prev,
        benefits: [...prev.benefits, newBenefit.trim()],
      }));
      setNewBenefit("");
    }
  };

  const removeBenefit = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index),
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting", {
        duration: 4000,
        position: "bottom-right",
      });
      return;
    }

    setShowConfirm(true);
  };

  const handleConfirmSubmit = async () => {
    setLoading(true);

    try {
      await createCompany({
        ...formData,
        owner_id: user?.id as string,
      });
      toast.success("Company profile created successfully!", {
        duration: 5000,
        position: "bottom-right",
        style: {
          background: "#10B981",
          color: "#fff",
          padding: "16px",
          borderRadius: "8px",
        },
      });
      navigate("/dashboard");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to create company",
        {
          duration: 5000,
          position: "bottom-right",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const FormSection = useCallback(
    ({
      title,
      children,
      icon,
    }: {
      title: string;
      children: React.ReactNode;
      icon: React.ReactNode;
    }) => (
      <div className="bg-white rounded-xl shadow-sm p-8 space-y-6 transition-all duration-200 hover:shadow-md">
        <div className="flex items-center space-x-3 pb-4 border-b border-gray-100">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">{icon}</div>
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        </div>
        {children}
      </div>
    ),
    []
  );

  const Input = useCallback(
    ({
      label,
      required,
      error,
      ...props
    }: {
      label: string;
      required?: boolean;
      error?: string;
    } & React.InputHTMLAttributes<HTMLInputElement>) => (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
          className={`block w-full rounded-lg border ${
            error ? "border-red-500" : "border-gray-300"
          } px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors duration-200`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    ),
    []
  );

  const TextArea = useCallback(
    ({
      label,
      required,
      error,
      ...props
    }: {
      label: string;
      required?: boolean;
      error?: string;
    } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <textarea
          className={`block w-full rounded-lg border ${
            error ? "border-red-500" : "border-gray-300"
          } px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors duration-200`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    ),
    []
  );

  const Select = useCallback(
    ({
      label,
      required,
      error,
      options,
      ...props
    }: {
      label: string;
      required?: boolean;
      error?: string;
      options: string[];
    } & React.SelectHTMLAttributes<HTMLSelectElement>) => (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <select
          className={`block w-full rounded-lg border ${
            error ? "border-red-500" : "border-gray-300"
          } px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors duration-200`}
          {...props}
        >
          <option value="">Select {label.toLowerCase()}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    ),
    []
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    try {
      setUploadingLogo(true);

      // Generate a unique file name
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;
      const filePath = `company-logos/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from("company-assets")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("company-assets").getPublicUrl(filePath);

      setFormData((prev) => ({ ...prev, logo_url: publicUrl }));
      toast.success("Logo uploaded successfully");
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast.error("Failed to upload logo");
    } finally {
      setUploadingLogo(false);
      // Reset the file input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveLogo = async () => {
    if (!formData.logo_url) return;

    try {
      // Extract the file path from the URL
      const url = new URL(formData.logo_url);
      const pathParts = url.pathname.split("/");
      const filePath = pathParts
        .slice(pathParts.indexOf("company-logos"))
        .join("/");

      // Delete from Supabase Storage
      const { error } = await supabase.storage
        .from("company-assets")
        .remove([filePath]);

      if (error) {
        throw error;
      }

      setFormData((prev) => ({ ...prev, logo_url: "" }));
      toast.success("Logo removed successfully");

      // Reset the file input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error removing logo:", error);
      toast.error("Failed to remove logo");
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Create Your Company Profile
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Tell potential candidates about your company and what makes it
              special.
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <FiArrowLeft className="mr-2" />
            Back
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FormSection
            title="Essential Information"
            icon={<FiTrello size={20} />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Input
                  label="Company Name"
                  required
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Acme Corporation"
                  error={errors.name}
                />
              </div>

              <div className="md:col-span-2">
                <TextArea
                  label="Company Description"
                  required
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell us about your company..."
                  error={errors.description}
                />
              </div>

              <Input
                label="Website"
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://www.example.com"
                error={errors.website}
              />

              {/* Logo Upload Section */}
              <div className="flex items-center space-x-6 mb-6">
                <div className="flex-shrink-0">
                  <div className="h-24 w-24 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200">
                    {formData.logo_url ? (
                      <img
                        src={formData.logo_url}
                        alt={formData.name || "Company logo"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <FiTrello className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Company Logo
                      </label>
                      <p className="mt-1 text-sm text-gray-500">
                        Upload a high-quality logo to make your company stand
                        out (5MB max)
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={handleUploadClick}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        disabled={uploadingLogo}
                      >
                        <FiUpload className="mr-2 h-4 w-4" />
                        {uploadingLogo ? "Uploading..." : "Upload Logo"}
                      </button>
                      {formData.logo_url && (
                        <button
                          type="button"
                          onClick={handleRemoveLogo}
                          className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Remove Logo
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FormSection>

          <FormSection title="Company Details" icon={<FiUsers size={20} />}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Select
                label="Industry"
                required
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                options={INDUSTRIES}
                error={errors.industry}
              />

              <Select
                label="Company Size"
                required
                id="size"
                name="size"
                value={formData.size}
                onChange={handleChange}
                options={COMPANY_SIZES}
                error={errors.size}
              />

              <Input
                label="Founded Year"
                type="number"
                id="founded_year"
                name="founded_year"
                value={formData.founded_year}
                onChange={handleChange}
                min="1800"
                max={new Date().getFullYear()}
                error={errors.founded_year}
              />

              <Input
                label="Headquarters"
                type="text"
                id="headquarters"
                name="headquarters"
                value={formData.headquarters}
                onChange={handleChange}
                placeholder="e.g., Berlin, Germany"
              />

              <Input
                label="Contact Person Name"
                type="text"
                id="contact_person_name"
                name="contact_person_name"
                value={formData.contact_person_name}
                onChange={handleChange}
                placeholder="e.g., John Doe"
              />

              <Input
                label="Contact Person Number"
                type="text"
                id="contact_person_number"
                name="contact_person_number"
                value={formData.contact_person_number}
                onChange={handleChange}
                placeholder="e.g., +123456789"
              />
            </div>
          </FormSection>

          {/* <FormSection title="Benefits & Perks" icon={<FiHeart size={20} />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {BENEFITS.map((benefit) => (
                <div
                  key={benefit.id}
                  className={`relative flex items-center p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                    formData.benefits.includes(benefit.label)
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                  onClick={() => {
                    const newBenefits = [...formData.benefits];
                    if (newBenefits.includes(benefit.label)) {
                      newBenefits.splice(newBenefits.indexOf(benefit.label), 1);
                    } else {
                      newBenefits.push(benefit.label);
                    }
                    setFormData((prev) => ({ ...prev, benefits: newBenefits }));
                  }}
                >
                  <div className="mr-3 text-xl">{benefit.icon}</div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {benefit.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </FormSection> */}

          <FormSection title="Benefits & Perks" icon={<FiHeart size={20} />}>
            <div className="space-y-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Benefits
                </label>
                <p className="text-sm text-gray-500 mb-3">
                  Add the benefits your company offers to attract top talent
                </p>

                <div className="flex items-center space-x-2 mb-3">
                  <input
                    type="text"
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors duration-200"
                    placeholder="Type a benefit and press Enter or Add"
                    value={newBenefit}
                    onChange={(e) => setNewBenefit(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newBenefit.trim()) {
                        e.preventDefault();
                        addBenefit();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addBenefit}
                    disabled={!newBenefit.trim()}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Benefits tags display */}
              <div className="flex flex-wrap gap-2">
                {formData.benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium group"
                  >
                    <span>{benefit}</span>
                    <button
                      type="button"
                      onClick={() => removeBenefit(index)}
                      className="ml-1.5 text-blue-400 hover:text-blue-600 focus:outline-none"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                ))}

                {formData.benefits.length === 0 && (
                  <p className="text-sm text-gray-500 italic">
                    No benefits added yet. Add some to make your company more
                    attractive!
                  </p>
                )}
              </div>
            </div>
          </FormSection>

          <FormSection title="Social Media" icon={<FiGlobe size={20} />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="LinkedIn URL"
                type="url"
                id="linkedin_url"
                name="linkedin_url"
                value={formData.linkedin_url}
                onChange={handleChange}
                placeholder="https://www.linkedin.com/company/your-company"
                error={errors.linkedin_url}
              />

              <Input
                label="Twitter URL"
                type="url"
                id="twitter_url"
                name="twitter_url"
                value={formData.twitter_url}
                onChange={handleChange}
                placeholder="https://twitter.com/your_company"
                error={errors.twitter_url}
              />

              <Input
                label="Facebook URL"
                type="url"
                id="facebook_url"
                name="facebook_url"
                value={formData.facebook_url}
                onChange={handleChange}
                placeholder="https://www.facebook.com/your-company"
              />
            </div>
          </FormSection>

          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-200"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating...
                </>
              ) : (
                <>
                  <FiSave className="mr-2" />
                  Create Company
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmSubmit}
        title="Create Company Profile"
        message="Are you sure you want to create this company profile? You can edit it later from your dashboard."
        confirmText="Create Profile"
        type="info"
      />
    </div>
  );
}

export default NewCompany;
