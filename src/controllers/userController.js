// User controller for managing user-related API calls
import { userApi } from '../lib/api';

/* ================= FETCH PROFILE ================= */
export const fetchUserProfile = async (uid) => {
  try {
    if (!uid) {
      throw new Error('User ID is required');
    }

    
    // Fetch from backend API using Firebase UID
    const userData = await userApi.getUser(uid);

    // Return data as-is from backend
    return { success: true, data: userData };
  } catch (err) {
    return { success: false, error: err.message || 'Failed to load profile' };
  }
};

/* ================= UPDATE PROFILE ================= */
export const updateUserProfile = async (userProfile, editForm) => {
  try {
    
    // Prepare update data with backend field names
    const updateData = {
      displayName: editForm.displayName,
      phoneNumber: editForm.phoneNumber,
      address: editForm.address,
      photoURL: editForm.photoURL,
    };
    
    
    // Use Firebase UID to update user
    const uid = userProfile.uid || userProfile.firebaseUid;
    const updatedUser = await userApi.updateUser(uid, updateData);
    

    return { success: true, data: updatedUser };
  } catch (error) {
    return { success: false, error: error.message || 'Update failed' };
  }
};