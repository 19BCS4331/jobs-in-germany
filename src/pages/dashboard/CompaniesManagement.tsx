import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Plus,
  Pencil,
  Trash2,
  Clock,
  MapPin,
  Globe,
  Briefcase,
  Users,
  Phone,
  User,
} from "lucide-react";
import { useAuth } from "../../lib/AuthContext";
import ConfirmDialog from "../../components/ConfirmDialog";
import { Company, getCompanyByOwner, deleteCompany } from "../../lib/api";
import { toast } from "react-hot-toast";

const CompaniesManagement: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [company, setCompany] = useState<Company | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    loadCompany();
  }, [user]);

  const loadCompany = async () => {
    if (!user || !profile || profile.user_type !== "employer") return;

    try {
      setIsLoading(true);
      const companyData = await getCompanyByOwner(user.id);
      setCompany(companyData);
    } catch (error) {
      console.error("Error loading company:", error);
      toast.error("Failed to load company");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCompany = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!company) return;

    try {
      await deleteCompany(company.id!);
      toast.success("Company deleted successfully");
      setCompany(null);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Error deleting company:", error);
      toast.error("Failed to delete company");
    }
  };

  const handleEditCompany = () => {
    if (!company) return;
    navigate(`/dashboard/companies/edit/${company.id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <Clock className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        </div>
      </div>
    );
  }

  console.log("company", company);

  return (
    <div className="min-h-screen bg-gray-50 pt-5 pb-10 md:pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Company Management
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {company
                  ? "Manage your company profile and view performance"
                  : "Create and manage your company profile"}
              </p>
            </div>
            {!company && (
              <button
                onClick={() => navigate("/company/new")}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Company
              </button>
            )}
          </div>
        </div>

        {company ? (
          <div className="space-y-6">
            {/* Company Overview Card */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 flex-shrink-0 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                      {company.logo_url ? (
                        <img
                          src={company.logo_url}
                          alt={company.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Building2 className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {company.name}
                      </h2>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <Briefcase className="h-4 w-4 mr-1" />
                        <span>{company.industry}</span>
                        <span className="mx-2">•</span>
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{company.headquarters || company.location}</span>
                      </div>
                      {company.website && (
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                        >
                          <Globe className="h-4 w-4 mr-1" />
                          {company.website}
                        </a>
                      )}
                      <div className="space-x-2 flex md:hidden mt-2">
                    <button
                      onClick={handleEditCompany}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={handleDeleteCompany}
                      className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </button>
                  </div>
                    </div>
                    
                  </div>
                  <div className="space-x-2 hidden md:flex">
                    <button
                      onClick={handleEditCompany}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={handleDeleteCompany}
                      className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="border-t border-gray-200 bg-gray-50">
                <div className="grid grid-cols-1 divide-y divide-gray-200 sm:grid-cols-3 sm:divide-y-0 sm:divide-x">
                  <div className="px-6 py-5">
                    <div className="text-sm font-medium text-gray-500">
                      Company Size
                    </div>
                    <div className="mt-1 flex items-baseline">
                      <div className="text-lg font-semibold text-gray-900">
                        {company.size}
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-5">
                    <div className="text-sm font-medium text-gray-500">
                      Founded
                    </div>
                    <div className="mt-1 flex items-baseline">
                      <div className="text-lg font-semibold text-gray-900">
                        {company.founded_year || "Not specified"}
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-5">
                    <div className="text-sm font-medium text-gray-500">
                      Headquarters
                    </div>
                    <div className="mt-1 flex items-baseline">
                      <div className="text-lg font-semibold text-gray-900">
                        {company.headquarters || company.location}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            {(company.contact_person_name || company.contact_person_number) && (
              <div className="border-t border-gray-200 bg-white px-6 py-5">
                <h3 className="text-lg font-medium text-gray-900">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-5">
                  {company.contact_person_name && (
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <div className="text-xs text-gray-500">
                          Contact Person
                        </div>
                        <div className="text-sm font-medium">
                          {company.contact_person_name}
                        </div>
                      </div>
                    </div>
                  )}
                  {company.contact_person_number && (
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <div className="text-xs text-gray-500">
                          Contact Number
                        </div>
                        <div className="text-sm font-medium">
                          {company.contact_person_number}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Company Details */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="px-6 py-5">
                <h3 className="text-lg font-medium text-gray-900">About</h3>
                <p className="mt-2 text-sm text-gray-500 whitespace-pre-wrap">
                  {company.description}
                </p>
              </div>
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-1">
              

              {/* Culture & Benefits */}
              <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div className="px-6 py-5">
                  <h3 className="text-lg font-medium text-gray-900">
                    Culture & Benefits
                  </h3>
                  {company.culture && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-500">
                        Culture
                      </h4>
                      <p className="mt-1 text-sm text-gray-900">
                        {company.culture}
                      </p>
                    </div>
                  )}
                  {company.benefits && company.benefits.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-500">
                        Benefits
                      </h4>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {company.benefits.map((benefit, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                          >
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-lg">
            <div className="px-6 py-12">
              <div className="text-center">
                <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  No Company Profile
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating a company profile
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => navigate("/company/new")}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Company
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Company"
        message="Are you sure you want to delete your company? This action cannot be undone."
        onConfirm={confirmDelete}
        onClose={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
};

export default CompaniesManagement;
