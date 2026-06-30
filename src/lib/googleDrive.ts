import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth';
import { db, isFirebaseEnabled } from './firebase';

// Cache the access token in memory
let cachedAccessToken: string | null = null;
let googleUser: User | null = null;
let isSigningIn = false;

// Initialize Google Auth Provider with the requested scopes
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/drive.file');
provider.addScope('https://www.googleapis.com/auth/userinfo.email');
provider.addScope('https://www.googleapis.com/auth/userinfo.profile');

export const initGoogleAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  const auth = getAuth();
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        googleUser = user;
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        googleUser = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      googleUser = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const signInWithGoogle = async (): Promise<{ user: User; accessToken: string } | null> => {
  const auth = getAuth();
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to get access token from Google Auth.');
    }

    cachedAccessToken = credential.accessToken;
    googleUser = result.user;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Sign-In error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getGoogleAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const getGoogleUser = (): User | null => {
  return googleUser;
};

export const logoutGoogle = async () => {
  const auth = getAuth();
  await auth.signOut();
  cachedAccessToken = null;
  googleUser = null;
};

/**
 * Searches for a folder named "Bird" or creates it in the user's Google Drive.
 * @param token Google OAuth access token
 * @returns The ID of the "Bird" folder
 */
export const getOrCreateBirdFolder = async (token: string): Promise<string> => {
  try {
    // 1. Search for existing "Bird" folder
    const searchUrl = `https://www.googleapis.com/drive/v3/files?q=name='Bird'+and+mimeType='application/vnd.google-apps.folder'+and+trashed=false&fields=files(id)`;
    const searchRes = await fetch(searchUrl, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!searchRes.ok) {
      throw new Error(`Search folder failed: ${searchRes.statusText}`);
    }

    const searchData = await searchRes.json();
    if (searchData.files && searchData.files.length > 0) {
      return searchData.files[0].id;
    }

    // 2. Create the "Bird" folder if it doesn't exist
    const createUrl = 'https://www.googleapis.com/drive/v3/files';
    const createRes = await fetch(createUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Bird',
        mimeType: 'application/vnd.google-apps.folder'
      })
    });

    if (!createRes.ok) {
      throw new Error(`Create folder failed: ${createRes.statusText}`);
    }

    const folderData = await createRes.json();
    return folderData.id;
  } catch (error) {
    console.error('Error in getOrCreateBirdFolder:', error);
    throw error;
  }
};

/**
 * Sets a Google Drive file's permissions so that anyone with the link can view it.
 * @param token Google OAuth access token
 * @param fileId Google Drive file ID
 */
export const setFilePublic = async (token: string, fileId: string): Promise<void> => {
  try {
    const url = `https://www.googleapis.com/drive/v3/files/${fileId}/permissions`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        role: 'reader',
        type: 'anyone'
      })
    });

    if (!res.ok) {
      console.warn('Failed to set file public, non-critical:', res.statusText);
    }
  } catch (error) {
    console.error('Error in setFilePublic:', error);
  }
};

/**
 * Uploads a file (Blob or File) to the "Bird" folder on Google Drive and returns its public thumbnail link.
 * @param token Google OAuth access token
 * @param file The File/Blob to upload
 * @param fileName Custom name for the file
 * @returns The public thumbnail link of the file
 */
export const uploadFileToBirdFolder = async (
  token: string,
  file: File | Blob,
  fileName: string
): Promise<{ fileId: string; url: string }> => {
  try {
    // 1. Get or create the "Bird" folder
    const folderId = await getOrCreateBirdFolder(token);

    // 2. Create file metadata in Google Drive
    const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: fileName,
        parents: [folderId]
      })
    });

    if (!createRes.ok) {
      throw new Error(`File metadata creation failed: ${createRes.statusText}`);
    }

    const metaData = await createRes.json();
    const fileId = metaData.id;

    // 3. Upload file binary data (media)
    const uploadUrl = `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`;
    const uploadRes = await fetch(uploadUrl, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': file.type || 'image/jpeg'
      },
      body: file
    });

    if (!uploadRes.ok) {
      throw new Error(`File upload media content failed: ${uploadRes.statusText}`);
    }

    // 4. Set permissions to public viewable
    await setFilePublic(token, fileId);

    // 5. Build public thumbnail image link (high resolution sz=w1000)
    // This allows the image to be directly rendered inside an <img> tag without needing access tokens or sign-in on the viewer's side
    const url = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;

    return { fileId, url };
  } catch (error) {
    console.error('Error in uploadFileToBirdFolder:', error);
    throw error;
  }
};
