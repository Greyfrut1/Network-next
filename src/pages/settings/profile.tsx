import { useState, useEffect } from 'react';
import Layout from "@/components/layout";
import { Camera } from "lucide-react";
import NextImage from "next/image";

interface FormData {
    name?: string;
    email?: string;
    image?: File | null;
}

const API_URL = process.env.NEXT_PUBLIC_BACK_API_URL as string;
const STORAGE_URL = process.env.NEXT_PUBLIC_STORAGE_URL as string;

export default function ProfileSettings() {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Функція для вибору зображення
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
        setFormData({ ...formData, image: file });
      };
      reader.readAsDataURL(file);
    }
  };

  // Функція для обрізання зображення
  const cropImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
  
      img.onload = () => {
        const targetSize = 200;
        let targetWidth = targetSize;
        let targetHeight = targetSize;
  
        if (img.width > img.height) {
          targetWidth = (targetSize * img.width) / img.height;
        } else {
          targetHeight = (targetSize * img.height) / img.width;
        }
  
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
  
        if (ctx) {
          ctx.drawImage(
            img,
            0,
            0,
            img.width,
            img.height,
            0,
            0,
            targetWidth,
            targetHeight
          );
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob'));
            }
          }, 'image/jpeg', 0.7);
        } else {
          reject(new Error('Failed to get canvas context'));
        }
      };
      img.onerror = (err) => reject(err);
    });
  };
  
  // Функція для надсилання форми
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getCookieValue('token');
  
    if (formData?.image) {
      try {
        const croppedImageBlob = await cropImage(formData.image);
  
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name || '');
        formDataToSend.append('email', formData.email || '');
        formDataToSend.append('image', croppedImageBlob, 'profile.jpg');
    
        fetch(`${API_URL}/settings/profile`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Profile updated:", data);
            setSuccessMessage("Profile info updated");
          })
          .catch((error) => {
            console.error("Failed to update profile:", error);
          });
      
      } catch (err) {
        console.error("Failed to crop image:", err);
      }
    } else {
      // Відправлення форми без зображення
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData?.name || '');
      formDataToSend.append('email', formData?.email || '');
  
      fetch(`${API_URL}/settings/profile`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Profile updated:", data);
          setSuccessMessage("Дані успішно збережені!");
        })
        .catch((error) => {
          console.error("Failed to update profile:", error);
        });
    }
  };

  useEffect(() => {
    const token = getCookieValue('token');
    fetch(`${API_URL}/user`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`, // Передаємо токен
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setFormData(data[0]);
        const profilePhotoUrl = data[0].profile_photo_url;

        // Check if the profile photo URL is a complete link or just a path from backend
        if (profilePhotoUrl && !profilePhotoUrl.startsWith("http")) {
          setPreviewImage(STORAGE_URL + profilePhotoUrl);
        } else {
          setPreviewImage(profilePhotoUrl);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const getCookieValue = (cookieName: string): string | null => {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(`${cookieName}=`)) {
        return cookie.substring(cookieName.length + 1);
      }
    }
    return null;
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            {successMessage}
          </div>
        )}

        {/* Profile Photo Section */}
        <div className="mb-8 flex items-center">
          <div className="relative">
            {previewImage ? (
              <NextImage src={previewImage} alt="Profile Preview" className="w-24 h-24 rounded-full object-cover" width={200} height={200}/>
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                <Camera className="w-8 h-8 text-gray-400" />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute bottom-0 right-0 bg-blue-500 p-1.5 rounded-full text-white hover:bg-blue-600"
              style={{ display: 'none' }}
              id="file-input"
            />
            <label htmlFor="file-input" className="absolute bottom-0 right-0 bg-blue-500 p-1.5 rounded-full text-white hover:bg-blue-600 cursor-pointer">
              <Camera className="w-4 h-4" />
            </label>
          </div>
          <div className="ml-6">
            <h3 className="text-lg font-medium">Profile Photo</h3>
            <p className="text-sm text-gray-500">JPG, GIF or PNG. Max size 2MB</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData?.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData?.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
