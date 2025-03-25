import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Box, TextField, Button, Typography } from "@mui/material";

const ProfileAccordion = ({ userId }) => {
    const [open, setOpen] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [profileData, setProfileData] = useState({ fullName: "", email: "", password: "" });

    // Fetch user data
    useEffect(() => {
        let isMounted = true;
        const userId = localStorage.getItem("id");
        axios.get(`http://localhost:5000/api/users/${userId}`)
            .then((res) => setProfileData(res.data))
            .catch((err) => console.error("Error fetching user:", err));
        return () => { isMounted = false };
    }, [userId]);

    // Handle input change
    const handleChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        const userId = localStorage.getItem("id");
        axios.put(`http://localhost:5000/api/users/${userId}`, profileData)
            .then((res) => {
                alert("Profile updated successfully!");
                setOpen(false); // Close the modal
            })
            .catch((err) => console.error("Error updating profile:", err));
    };

    return (
        <div>
            <Button variant="contained" onClick={() => setOpen(true)}>Edit Profile</Button>

            {/* Modal for editing profile */}
            <Modal open={open} onClose={() => setOpen(false)}>
                <Box sx={{ width: 400, margin: "100px auto", padding: 3, backgroundColor: "white", borderRadius: "10px" }}>
                    <Typography variant="h6">Edit Profile</Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField label="Full Name" name="fullName" value={profileData.fullName} onChange={handleChange} fullWidth margin="normal" />
                        <TextField label="Email" name="email" value={profileData.email} onChange={handleChange} fullWidth margin="normal" />
                        {/* <TextField label="Password" name="password" type="password" onChange={handleChange} fullWidth margin="normal" /> */}
                        <div className="password-container" style={{ width:"400px"}}>
                           <TextField 
                             label="Password" 
                             name="password" 
                             type={passwordVisible ? "text" : "password"} 
                             onChange={handleChange} 
                             fullWidth margin="normal" 
                            />
                        <span className="eye-icon" onClick={() => setPasswordVisible(!passwordVisible)}>
                            {passwordVisible ? "👁️" : "👁️‍🗨️"}
                        </span>
                        </div>
                        <Button type="submit" variant="contained" style={{marginLeft:"120px",width:"inherit"}} color="primary" fullWidth>Save Changes</Button>
                    </form>
                </Box>
            </Modal>
        </div>
    );
};

export default ProfileAccordion;
