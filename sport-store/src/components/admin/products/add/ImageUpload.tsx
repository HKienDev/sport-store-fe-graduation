import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Upload, X, Plus, Loader2 } from "lucide-react";
import Image from "next/image";
import { ProductFormData } from "@/types/product";
import { toast } from "sonner";

interface ImageUploadProps {
  formData: ProductFormData;
  onFieldChange: (field: keyof ProductFormData, value: string | string[] | null) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const CLOUDINARY_CLOUD_NAME = 'dta6mizzm'; // Thay thế bằng cloud name của bạn
const CLOUDINARY_UPLOAD_PRESET = 'sport-store'; // Thay thế bằng upload preset của bạn

export default function ImageUpload({
  formData,
  onFieldChange,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const validateFile = (file: File): boolean => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error('Chỉ chấp nhận file ảnh định dạng JPG, PNG hoặc WebP');
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error(`Kích thước file không được vượt quá ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
      return false;
    }

    return true;
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('folder', 'sport-store/products');

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Cloudinary error:', errorData);
        throw new Error(`Lỗi Cloudinary: ${errorData.error?.message || 'Không xác định'}`);
      }

      const data = await response.json();
      console.log('Upload successful:', data);
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw new Error('Không thể tải ảnh lên Cloudinary');
    }
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateFile(file)) return;

    try {
      setIsUploading(true);
      toast.info('Đang tải ảnh lên...');
      const imageUrl = await uploadToCloudinary(file);
      onFieldChange('mainImage', imageUrl);
      toast.success('Tải ảnh lên thành công');
    } catch (err) {
      console.error('Lỗi khi tải ảnh lên:', err);
      toast.error('Đã xảy ra lỗi khi tải ảnh lên');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (formData.subImages.length + files.length > 5) {
      toast.error('Không được phép upload quá 5 ảnh phụ');
      return;
    }

    try {
      setIsUploading(true);
      toast.info('Đang tải ảnh lên...');
      
      const uploadPromises = Array.from(files).map(async (file) => {
        if (!validateFile(file)) return null;
        return uploadToCloudinary(file);
      });

      const uploadedUrls = (await Promise.all(uploadPromises)).filter(Boolean) as string[];
      onFieldChange('subImages', [...formData.subImages, ...uploadedUrls]);
      
      if (uploadedUrls.length > 0) {
        toast.success(`Đã tải lên ${uploadedUrls.length} ảnh thành công`);
      }
    } catch (err) {
      console.error('Lỗi khi tải ảnh lên:', err);
      toast.error('Đã xảy ra lỗi khi tải ảnh lên');
    } finally {
      setIsUploading(false);
    }
  };

  const handleMainImageRemove = () => {
    onFieldChange('mainImage', null);
    toast.info('Đã xóa ảnh chính');
  };

  const handleSubImageRemove = (index: number) => {
    const newSubImages = [...formData.subImages];
    newSubImages.splice(index, 1);
    onFieldChange('subImages', newSubImages);
    toast.info('Đã xóa ảnh phụ');
  };

  return (
    <div className="space-y-5">
      <div>
        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Upload className="w-4 h-4" />
          HÌNH ẢNH CHÍNH
        </Label>
        <div className="border-2 border-dashed rounded-xl p-6 text-center transition-colors border-gray-300 hover:border-blue-500 mt-1.5">
          {isUploading ? (
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              <p className="mt-2 text-sm text-gray-500">Đang tải ảnh lên...</p>
            </div>
          ) : formData.mainImage ? (
            <div className="relative w-48 h-48 mx-auto">
              <Image src={formData.mainImage} alt="Main product" fill className="object-contain rounded-lg" />
              <button
                onClick={handleMainImageRemove}
                className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <Upload className="w-10 h-10 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">Kéo thả hoặc nhấp để tải ảnh lên</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG hoặc WebP (tối đa 5MB)</p>
              <label className="mt-3 cursor-pointer">
                <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors text-sm">
                  Chọn ảnh
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleMainImageUpload}
                />
              </label>
            </div>
          )}
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Upload className="w-4 h-4" />
          HÌNH ẢNH PHỤ
        </Label>
        <div className="border-2 border-dashed rounded-xl p-6 text-center transition-colors border-gray-300 hover:border-blue-500 mt-1.5">
          {isUploading ? (
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              <p className="mt-2 text-sm text-gray-500">Đang tải ảnh lên...</p>
            </div>
          ) : formData.subImages.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {formData.subImages.map((image, index) => (
                <div key={index} className="relative w-full aspect-square">
                  <Image src={image} alt={`Sub product ${index + 1}`} fill className="object-contain rounded-lg" />
                  <button
                    onClick={() => handleSubImageRemove(index)}
                    className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))}
              {formData.subImages.length < 5 && (
                <label className="w-full aspect-square border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors">
                  <Plus className="w-8 h-8 text-gray-400" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleSubImagesUpload}
                    multiple
                  />
                </label>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <Upload className="w-10 h-10 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">Kéo thả hoặc nhấp để tải ảnh lên</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG hoặc WebP (tối đa 5 ảnh)</p>
              <label className="mt-3 cursor-pointer">
                <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors text-sm">
                  Chọn ảnh
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleSubImagesUpload}
                  multiple
                />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 