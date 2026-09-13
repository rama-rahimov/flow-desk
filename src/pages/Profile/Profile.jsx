import { useEffect, useState } from 'react';
import './Profile.css';
import {currentUser, editProfile, uploadFileAvatar} from "../../api.js";
import {useNavigate} from "react-router-dom";

export default function Profile() {
    const [user, setUser] = useState(null);
    const [file, setFile] = useState({});
    const [form, setForm] = useState({firstName: '', lastName: '', email: ''});
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isChange, setIsChange] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        (async () => {
            try {
               const response = await currentUser();
               setForm(response);
               if(response?.id){
                   setUser(1)
               }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        })()
    }, [isChange]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleDashboard = () => {
        navigate(`/${form.company.link}/dashboard`);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };
    const handleSubmit2 = async (e) => {
        e.preventDefault();
        try {
            const response = await uploadFileAvatar(file);
            setUser(response);
            setIsEditing(false);
            setIsChange((prevState) => !prevState);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await editProfile(form);
            setUser(response);
            setIsEditing(false);
            setIsChange((prevState) => !prevState);
        } catch (error) {
            console.error(error);
        }
    };
    if (loading) {
        return <div className="profile-loading">Loading...</div>;
    }
    if (!user) {
        return <div className="profile-loading">User not found</div>;
    }
    console.log({file: file.name, avatar: (form.avatar || {}).url});
    return (
        <div className="profile-page">
            <div className="profile-card">

                <div className="profile-header">
                    <div>
                        <h1>Profile</h1>
                        <p>Your personal information</p>
                    </div>
                    <button
                        className="profile-edit"
                        onClick={handleDashboard}
                    >
                        Dashboard
                    </button>
                    {!isEditing && (
                        <button
                            className="profile-edit"
                            onClick={handleEdit}
                        >
                            Edit
                        </button>
                    )}
                </div>
                <form onSubmit={handleSubmit2}>
                    {
                        (form.avatar || {}).url && <div className="profile-field">
                            <img
                                src={(form.avatar || {}).url}
                                alt="Avatar"
                                width="100"
                                height="100"
                            />
                        </div>
                    }
                    <div className="profile-field">
                        <input
                            type="file"
                            key='file'
                            name="file"
                            onChange={(event) => {
                                console.log({event: event.target.files[0]});
                                setFile(event.target.files[0])
                            }}
                            disabled={!isEditing}
                        />
                    </div>
                    {isEditing && (
                        <div className="profile-actions">
                            <button
                                type="button"
                                className="profile-cancel"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="profile-save"
                            >
                                Save changes
                            </button>
                        </div>
                    )}
                </form>
                <form onSubmit={handleSubmit}>
                    <div className="profile-field">
                        <label>First name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={form.firstName}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>
                    <div className="profile-field">
                        <label>Last name</label>
                        <input
                            type="text"
                            name="lastName"
                            value={form.lastName}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>
                    <div className="profile-field">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>
                    {isEditing && (
                        <div className="profile-actions">
                            <button
                                type="button"
                                className="profile-cancel"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="profile-save"
                            >
                                Save changes
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}