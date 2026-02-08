import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface TeacherProfileData {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    profile_photo: string | null;
    subject_expertise: string;
    institution: string;
    bio: string;
}

interface TeacherProfileSettingsProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const TeacherProfileSettings = ({ open, onOpenChange }: TeacherProfileSettingsProps) => {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [profileData, setProfileData] = useState<TeacherProfileData | null>(null);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        subject_expertise: "",
        institution: "",
        bio: "",
    });
    const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    // Fetch profile data when modal opens
    useEffect(() => {
        if (open) {
            fetchProfile();
        }
    }, [open]);

    const fetchProfile = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");

        try {
            const response = await fetch("http://127.0.0.1:8000/api/users/profile/", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setProfileData(data);
                setFormData({
                    first_name: data.first_name || "",
                    last_name: data.last_name || "",
                    subject_expertise: data.subject_expertise || "",
                    institution: data.institution || "",
                    bio: data.bio || "",
                });
                setPhotoPreview(data.profile_photo);
            } else {
                toast.error("Failed to load profile");
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
            toast.error("Error loading profile");
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfilePhoto(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        const token = localStorage.getItem("token");

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("first_name", formData.first_name);
            formDataToSend.append("last_name", formData.last_name);
            formDataToSend.append("subject_expertise", formData.subject_expertise);
            formDataToSend.append("institution", formData.institution);
            formDataToSend.append("bio", formData.bio);

            if (profilePhoto) {
                formDataToSend.append("profile_photo", profilePhoto);
            }

            const response = await fetch("http://127.0.0.1:8000/api/users/profile/update/", {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formDataToSend,
            });

            if (response.ok) {
                toast.success("Profile updated successfully!");
                onOpenChange(false);
            } else {
                const errorData = await response.json();
                toast.error(errorData.detail || "Failed to update profile");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Error updating profile");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                {/* Close button in top-right corner */}
                <button
                    onClick={() => onOpenChange(false)}
                    className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </button>

                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold gradient-text">
                        Profile & Identity Settings
                    </DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="flex justify-center items-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="space-y-6 py-4">
                        {/* Profile Photo */}
                        <div className="space-y-2">
                            <Label htmlFor="profile-photo">Profile Photo</Label>
                            <div className="flex items-center gap-4">
                                {photoPreview ? (
                                    <img
                                        src={photoPreview}
                                        alt="Profile"
                                        className="w-20 h-20 rounded-full object-cover border-2 border-primary/20"
                                    />
                                ) : (
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center text-2xl font-bold text-white">
                                        {formData.first_name?.[0] || "T"}
                                    </div>
                                )}
                                <div className="flex-1">
                                    <Input
                                        id="profile-photo"
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                        className="cursor-pointer"
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Upload a profile picture (JPG, PNG)
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Name Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="first_name">First Name</Label>
                                <Input
                                    id="first_name"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleInputChange}
                                    placeholder="Enter first name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="last_name">Last Name</Label>
                                <Input
                                    id="last_name"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleInputChange}
                                    placeholder="Enter last name"
                                />
                            </div>
                        </div>

                        {/* Subject Expertise */}
                        <div className="space-y-2">
                            <Label htmlFor="subject_expertise">Subject Expertise</Label>
                            <Input
                                id="subject_expertise"
                                name="subject_expertise"
                                value={formData.subject_expertise}
                                onChange={handleInputChange}
                                placeholder="e.g., Mathematics, Physics, Chemistry"
                            />
                        </div>

                        {/* Institution */}
                        <div className="space-y-2">
                            <Label htmlFor="institution">Institution / Class</Label>
                            <Input
                                id="institution"
                                name="institution"
                                value={formData.institution}
                                onChange={handleInputChange}
                                placeholder="e.g., Springfield High School, Grade 10"
                            />
                        </div>

                        {/* Bio */}
                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio / Introduction</Label>
                            <Textarea
                                id="bio"
                                name="bio"
                                value={formData.bio}
                                onChange={handleInputChange}
                                placeholder="Tell us about yourself..."
                                rows={4}
                                className="resize-none"
                            />
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={saving}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={saving}
                                className="bg-gradient-to-r from-primary to-accent"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default TeacherProfileSettings;
