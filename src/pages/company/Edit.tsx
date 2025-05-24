import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updateCompany, getCompany } from "../../lib/api";
import { useAuth } from "../../lib/AuthContext";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";
import {
  FiTrello,
  FiUsers,
  FiHeart,
  FiGlobe,
  FiSave,
  FiArrowLeft,
  FiUpload,
} from "react-icons/fi";
import ConfirmDialog from "../../components/ConfirmDialog";
import Input from "../../components/forms/Input";
import TextArea from "../../components/forms/TextArea";
import Select from "../../components/forms/Select";

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

interface ValidationErrors {
  [key: string]: string;
}

const FormSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => (
  <div className="bg-white shadow-sm rounded-lg overflow-hidden">
    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center">
      <span className="text-gray-500 mr-3">{icon}</span>
      <h2 className="text-lg font-medium text-gray-900">{title}</h2>
    </div>
    <div className="px-6 py-4">{children}</div>
  </div>
);

function EditCompany() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [newBenefit, setNewBenefit] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    size: "",
    industry: "",
    logo_url: "",
    founded_year: new Date().getFullYear(),
    headquarters: "",
    benefits: [] as string[],
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

  useEffect(() => {
    loadCompany();
  }, [id]);

  const loadCompany = async () => {
    if (!id) return;
    try {
      const companyData = await getCompany(id);
      if (!companyData) {
        toast.error("Company not found");
        navigate("/dashboard/companies/manage");
        return;
      }
      setFormData({
        name: companyData.name || "",
        description: companyData.description || "",
        website: companyData.website || "",
        location: companyData.location || "",
        size: companyData.size || "",
        industry: companyData.industry || "",
        logo_url: companyData.logo_url || "",
        founded_year: companyData.founded_year || new Date().getFullYear(),
        headquarters: companyData.headquarters || "",
        benefits: companyData.benefits || [],
        culture: companyData.culture || "",
        mission: companyData.mission || "",
        values: companyData.values || "",
        funding_stage: companyData.funding_stage || "",
        tech_stack: companyData.tech_stack || "",
        linkedin_url: companyData.linkedin_url || "",
        twitter_url: companyData.twitter_url || "",
        facebook_url: companyData.facebook_url || "",
        contact_person_name: companyData.contact_person_name || "",
        contact_person_number: companyData.contact_person_number || "",
      });
    } catch (error) {
      console.error("Error loading company:", error);
      toast.error("Failed to load company");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Required fields validation
    if (!formData.name.trim()) {
      newErrors.name = "Company name is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Company description is required";
    }
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }
    if (!formData.industry) {
      newErrors.industry = "Industry is required";
    }
    if (!formData.size) {
      newErrors.size = "Company size is required";
    }

    // URL validations
    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website =
        "Please enter a valid URL starting with http:// or https://";
    }
    if (
      formData.linkedin_url &&
      !/^https?:\/\/.+/.test(formData.linkedin_url)
    ) {
      newErrors.linkedin_url = "Please enter a valid LinkedIn URL";
    }
    if (formData.twitter_url && !/^https?:\/\/.+/.test(formData.twitter_url)) {
      newErrors.twitter_url = "Please enter a valid Twitter URL";
    }
    if (
      formData.facebook_url &&
      !/^https?:\/\/.+/.test(formData.facebook_url)
    ) {
      newErrors.facebook_url = "Please enter a valid Facebook URL";
    }

    // Founded year validation
    const currentYear = new Date().getFullYear();
    if (formData.founded_year > currentYear) {
      newErrors.founded_year = "Founded year cannot be in the future";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
        const { [name]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleSaveChanges = async () => {
    if (!validateForm() || !id) return;

    try {
      setLoading(true);
      await updateCompany(id, {
        ...formData,
        benefits: formData.benefits,
      });
      toast.success("Company updated successfully");
      navigate("/dashboard/companies/manage");
    } catch (error) {
      console.error("Error updating company:", error);
      toast.error("Failed to update company");
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirm(true);
  };

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
    } catch (error) {
      console.error("Error removing logo:", error);
      toast.error("Failed to remove logo");
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <button
            onClick={() => navigate("/dashboard/companies/manage")}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <FiArrowLeft className="mr-2" /> Back to Companies
          </button>
          <h1 className="mt-2 text-2xl font-bold text-gray-900">
            Edit Company
          </h1>
        </div>
        <button
          onClick={() => setShowConfirm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <FiSave className="mr-2" /> Save Changes
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Logo Upload Section */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">
                <div className="h-24 w-24 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200">
                  {formData.logo_url ? (
                    <img
                      src={formData.logo_url}
                      alt={formData.name}
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
                      Upload a high-quality logo to make your company stand out
                    </p>
                  </div>
                  <div className="flex items-center space-x-4 flex-col md:flex-row space-y-4">
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
                        className="inline-flex items-center px-6 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Remove Logo
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <FormSection title="Basic Information" icon={<FiTrello size={20} />}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Input
              label="Company Name"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
            />
            <Input
              label="Website"
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              error={errors.website}
            />
            <Input
              label="Location"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              error={errors.location}
              required
            />
            <Input
              label="Headquarters"
              id="headquarters"
              name="headquarters"
              value={formData.headquarters}
              onChange={handleChange}
            />
            <Select
              label="Industry"
              id="industry"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              error={!!errors.industry}
              options={INDUSTRIES.map((industry) => ({
                value: industry,
                label: industry,
              }))}
            />
            <Select
              label="Company Size"
              id="size"
              name="size"
              value={formData.size}
              onChange={handleChange}
              error={!!errors.size}
              options={COMPANY_SIZES.map((size) => ({
                value: size,
                label: size,
              }))}
            />
            <Input
              label="Founded Year"
              type="number"
              id="founded_year"
              name="founded_year"
              value={formData.founded_year}
              onChange={handleChange}
              error={errors.founded_year}
            />
            <Input
              label="Contact Person Name"
              id="contact_person_name"
              name="contact_person_name"
              value={formData.contact_person_name}
              onChange={handleChange}
              error={errors.contact_person_name}
            />
            <Input
              label="Contact Person Number"
              id="contact_person_number"
              name="contact_person_number"
              value={formData.contact_person_number}
              onChange={handleChange}
              error={errors.contact_person_number}
            />
          </div>
        </FormSection>

        <FormSection title="Company Description" icon={<FiUsers size={20} />}>
          <div className="space-y-6">
            <TextArea
              label="Description"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              error={errors.description}
              required
              rows={4}
            />
          </div>
        </FormSection>

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

        {/* <FormSection title="Technical Details" icon={<FiHeart size={20} />}>
          <div className="space-y-6">
            <TextArea
              label="Tech Stack"
              id="tech_stack"
              name="tech_stack"
              value={formData.tech_stack}
              onChange={handleChange}
              placeholder="List your company's tech stack"
              rows={3}
            />
            <Input
              label="Funding Stage"
              id="funding_stage"
              name="funding_stage"
              value={formData.funding_stage}
              onChange={handleChange}
              placeholder="e.g., Seed, Series A, Series B"
            />
          </div>
        </FormSection> */}

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
              error={errors.facebook_url}
            />
          </div>
        </FormSection>
      </form>

      <ConfirmDialog
        isOpen={showConfirm}
        title="Save Changes"
        message="Are you sure you want to save these changes to your company profile?"
        onConfirm={handleSaveChanges}
        onClose={() => setShowConfirm(false)}
      />
    </div>
  );
}

export default EditCompany;
