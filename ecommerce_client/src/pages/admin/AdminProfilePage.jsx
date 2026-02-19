import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import apiService from '../../services/api.service';

const AdminProfilePage = () => {
    const [profile, setProfile] = useState({
        email: '',
        displayName: '',
        phone: '',
        role: '',
        status: '',
        createdAt: '',
        lastLoginAt: ''
    });

    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        displayName: '',
        phone: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await apiService.get('/users/me');
            
            setProfile({
                email: response.email || '',
                displayName: response.displayName || '',
                phone: response.phone || '',
                role: response.role || '',
                status: response.status || '',
                createdAt: response.createdAt || '',
                lastLoginAt: response.lastLoginAt || ''
            });

            setFormData({
                displayName: response.displayName || '',
                phone: response.phone || ''
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);

            // Validate inputs
            if (!formData.displayName.trim()) {
                toast.error('Display name is required');
                return;
            }

            const response = await apiService.put('/users/me', formData);
            
            toast.success('Profile updated successfully!');
            
            // Update local profile state
            setProfile(prev => ({
                ...prev,
                displayName: response.user.displayName,
                phone: response.user.phone
            }));

            setEditMode(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            displayName: profile.displayName,
            phone: profile.phone
        });
        setEditMode(false);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div style={{textAlign: 'center', padding: '80px 20px'}}>
                <div style={{fontSize: '3em', marginBottom: '20px'}}>⏳</div>
                <div style={{fontSize: '1.2em', color: '#565959'}}>Loading profile...</div>
            </div>
        );
    }

    return (
        <div className="admin-profile-page">
            <style>{`
                .admin-profile-page {
                    max-width: 900px;
                    margin: 0 auto;
                }

                h1 { 
                    font-size: 2em; 
                    margin-bottom: 10px; 
                    color: #0F1111;
                }

                .subtitle { 
                    color: #565959; 
                    margin-bottom: 30px; 
                }

                .profile-header {
                    background: linear-gradient(135deg, #FF9900 0%, #F08804 100%);
                    padding: 40px;
                    border-radius: 8px;
                    margin-bottom: 30px;
                    color: white;
                    display: flex;
                    align-items: center;
                    gap: 30px;
                }

                .profile-avatar {
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    background: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 3em;
                    color: #FF9900;
                    font-weight: bold;
                    flex-shrink: 0;
                }

                .profile-header-info h2 {
                    margin: 0 0 10px 0;
                    font-size: 1.8em;
                }

                .profile-header-info p {
                    margin: 5px 0;
                    opacity: 0.9;
                }

                .role-badge {
                    display: inline-block;
                    background: rgba(255, 255, 255, 0.2);
                    padding: 5px 15px;
                    border-radius: 20px;
                    font-size: 0.9em;
                    margin-top: 10px;
                }

                .section {
                    background: #FFFFFF;
                    padding: 30px;
                    border-radius: 8px;
                    border: 1px solid #D5D9D9;
                    margin-bottom: 20px;
                }

                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 25px;
                    padding-bottom: 15px;
                    border-bottom: 2px solid #F7F8F8;
                }

                .section-title {
                    font-size: 1.4em;
                    font-weight: 600;
                    color: #0F1111;
                }

                .btn-edit {
                    background: #FF9900;
                    color: white;
                    border: none;
                    padding: 8px 20px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 0.95em;
                }

                .btn-edit:hover {
                    background: #F08804;
                }

                .form-group {
                    margin-bottom: 25px;
                }

                .form-label {
                    display: block;
                    font-weight: 600;
                    margin-bottom: 8px;
                    color: #0F1111;
                    font-size: 0.95em;
                }

                .form-input {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid #D5D9D9;
                    border-radius: 4px;
                    font-size: 1em;
                    box-sizing: border-box;
                }

                .form-input:focus {
                    outline: none;
                    border-color: #FF9900;
                    box-shadow: 0 0 0 3px rgba(255, 153, 0, 0.1);
                }

                .form-input:disabled {
                    background: #F7F8F8;
                    color: #565959;
                    cursor: not-allowed;
                }

                .info-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 30px;
                    margin-bottom: 20px;
                }

                .info-item {
                    padding: 15px;
                    background: #F7F8F8;
                    border-radius: 6px;
                }

                .info-label {
                    font-size: 0.85em;
                    color: #565959;
                    margin-bottom: 5px;
                    font-weight: 600;
                }

                .info-value {
                    font-size: 1.1em;
                    color: #0F1111;
                    font-weight: 500;
                }

                .status-badge {
                    display: inline-block;
                    padding: 4px 12px;
                    border-radius: 4px;
                    font-size: 0.9em;
                    font-weight: 600;
                }

                .status-active {
                    background: #E6F4F1;
                    color: #067D62;
                }

                .status-blocked {
                    background: #FEE;
                    color: #C7511F;
                }

                .button-group {
                    display: flex;
                    gap: 10px;
                    justify-content: flex-end;
                    margin-top: 30px;
                }

                .btn-primary {
                    background: #FF9900;
                    color: white;
                    border: none;
                    padding: 12px 30px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 1em;
                }

                .btn-primary:hover {
                    background: #F08804;
                }

                .btn-primary:disabled {
                    background: #D5D9D9;
                    cursor: not-allowed;
                }

                .btn-secondary {
                    background: white;
                    color: #0F1111;
                    border: 1px solid #D5D9D9;
                    padding: 12px 30px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 1em;
                }

                .btn-secondary:hover {
                    background: #F7F8F8;
                }

                @media (max-width: 768px) {
                    .profile-header {
                        flex-direction: column;
                        text-align: center;
                    }

                    .info-row {
                        grid-template-columns: 1fr;
                    }

                    .button-group {
                        flex-direction: column;
                    }

                    .btn-primary, .btn-secondary {
                        width: 100%;
                    }
                }
            `}</style>

            <h1>My Profile</h1>
            <p className="subtitle">Manage your account information and settings</p>

            <div className="profile-header">
                <div className="profile-avatar">
                    {profile.displayName ? profile.displayName.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="profile-header-info">
                    <h2>{profile.displayName || 'Admin User'}</h2>
                    <p>{profile.email}</p>
                    <span className="role-badge">
                        {profile.role === 'admin' ? '👑 Administrator' : profile.role}
                    </span>
                </div>
            </div>

            <div className="section">
                <div className="section-header">
                    <h3 className="section-title">Personal Information</h3>
                    {!editMode && (
                        <button className="btn-edit" onClick={() => setEditMode(true)}>
                            ✏️ Edit Profile
                        </button>
                    )}
                </div>

                <div className="form-group">
                    <label className="form-label">Display Name *</label>
                    <input
                        type="text"
                        name="displayName"
                        className="form-input"
                        value={editMode ? formData.displayName : profile.displayName}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        placeholder="Enter your display name"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                        type="email"
                        className="form-input"
                        value={profile.email}
                        disabled
                    />
                    <small style={{color: '#565959', fontSize: '0.85em'}}>
                        Email cannot be changed
                    </small>
                </div>

                <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                        type="tel"
                        name="phone"
                        className="form-input"
                        value={editMode ? formData.phone : profile.phone}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        placeholder="Enter your phone number"
                    />
                </div>

                {editMode && (
                    <div className="button-group">
                        <button 
                            className="btn-secondary" 
                            onClick={handleCancel}
                            disabled={saving}
                        >
                            Cancel
                        </button>
                        <button 
                            className="btn-primary" 
                            onClick={handleSave}
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                )}
            </div>

            <div className="section">
                <h3 className="section-title">Account Information</h3>

                <div className="info-row">
                    <div className="info-item">
                        <div className="info-label">Account Status</div>
                        <div className="info-value">
                            <span className={`status-badge status-${profile.status}`}>
                                {profile.status === 'active' ? '✓ Active' : profile.status}
                            </span>
                        </div>
                    </div>

                    <div className="info-item">
                        <div className="info-label">Role</div>
                        <div className="info-value">
                            {profile.role === 'admin' ? 'Administrator' : profile.role}
                        </div>
                    </div>
                </div>

                <div className="info-row">
                    <div className="info-item">
                        <div className="info-label">Member Since</div>
                        <div className="info-value">{formatDate(profile.createdAt)}</div>
                    </div>

                    <div className="info-item">
                        <div className="info-label">Last Login</div>
                        <div className="info-value">{formatDate(profile.lastLoginAt)}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProfilePage;
