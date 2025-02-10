import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Plus, MoreVertical, Pencil, Trash2, Eye, Users, Clock } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import ConfirmDialog from '../../components/ConfirmDialog';
import { Company, getCompanyByOwner, deleteCompany } from '../../lib/api';
import { toast } from 'react-hot-toast';

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
    if (!user || !profile || profile.user_type !== 'employer') return;

    try {
      setIsLoading(true);
      const companyData = await getCompanyByOwner(user.id);
      setCompany(companyData);
    } catch (error) {
      console.error('Error loading company:', error);
      toast.error('Failed to load company');
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
      toast.success('Company deleted successfully');
      setCompany(null);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting company:', error);
      toast.error('Failed to delete company');
    }
  };

  const handleEditCompany = () => {
    if (!company) return;
    navigate(`/dashboard/companies/${company.id}/edit`);
  };

  const handleViewCompany = () => {
    if (!company) return;
    navigate(`/companies/${company.id}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Clock className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Company Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your company profile and view performance
          </p>
        </div>
        {!company && (
          <button
            onClick={() => navigate('/dashboard/companies/new')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Company
          </button>
        )}
      </div>

      {company ? (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {/* Company Details */}
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 flex-shrink-0 rounded bg-gray-100 flex items-center justify-center">
                  {company.logo_url ? (
                    <img src={company.logo_url} alt={company.name} className="h-14 w-14 rounded object-cover" />
                  ) : (
                    <Building2 className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{company.name}</h2>
                  <p className="mt-1 text-sm text-gray-500">{company.industry} • {company.location}</p>
                  {company.website && (
                    <a 
                      href={company.website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="mt-1 text-sm text-indigo-600 hover:text-indigo-500"
                    >
                      {company.website}
                    </a>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
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

            {/* Company Details Grid */}
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Size</h3>
                <p className="mt-1 text-lg font-semibold text-gray-900">{company.size}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Founded</h3>
                <p className="mt-1 text-lg font-semibold text-gray-900">{company.founded_year || 'Not specified'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Headquarters</h3>
                <p className="mt-1 text-lg font-semibold text-gray-900">{company.headquarters || company.location}</p>
              </div>
            </div>

            {/* Company Description */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900">About</h3>
              <p className="mt-2 text-gray-600 whitespace-pre-wrap">{company.description}</p>
            </div>

            {/* Additional Sections */}
            {company.mission && (
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900">Mission</h3>
                <p className="mt-2 text-gray-600">{company.mission}</p>
              </div>
            )}

            {company.values && (
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900">Values</h3>
                <p className="mt-2 text-gray-600">{company.values}</p>
              </div>
            )}

            {company.culture && (
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900">Culture</h3>
                <p className="mt-2 text-gray-600">{company.culture}</p>
              </div>
            )}

            {company.benefits && company.benefits.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900">Benefits</h3>
                <ul className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {company.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 mr-2"></span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {company.tech_stack && (
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900">Tech Stack</h3>
                <p className="mt-2 text-gray-600">{company.tech_stack}</p>
              </div>
            )}

            {/* Social Media Links */}
            {(company.linkedin_url || company.twitter_url || company.facebook_url) && (
              <div className="mt-8 flex space-x-4">
                {company.linkedin_url && (
                  <a
                    href={company.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-indigo-600"
                  >
                    LinkedIn
                  </a>
                )}
                {company.twitter_url && (
                  <a
                    href={company.twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-indigo-600"
                  >
                    Twitter
                  </a>
                )}
                {company.facebook_url && (
                  <a
                    href={company.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-indigo-600"
                  >
                    Facebook
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        // Empty State
        <div className="text-center py-12 bg-white shadow-sm rounded-lg">
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No Company Profile</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating your company profile.</p>
          <div className="mt-6">
            <button
              onClick={() => navigate('/dashboard/companies/new')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Company
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Delete Company"
        message="Are you sure you want to delete your company? This action cannot be undone and will also delete all associated job postings."
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
};

export default CompaniesManagement;
