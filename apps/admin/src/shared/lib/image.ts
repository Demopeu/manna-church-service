import { FieldValues, UseFormSetError } from 'react-hook-form';
import imageCompression from 'browser-image-compression';

interface imageToWebpConverterParams {
  file: File;
  title: string;
}

export const imageToWebpConverter = async ({
  file,
  title,
}: imageToWebpConverterParams): Promise<File> => {
  if (typeof window === 'undefined') {
    return file;
  }

  const options = {
    maxSizeMB: 0.1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: 'image/webp',
    initialQuality: 0.7,
  };

  try {
    const compressedBlob = await imageCompression(file, options);
    const newFileName = title + '.webp';

    return new File([compressedBlob], newFileName, {
      type: 'image/webp',
      lastModified: new Date().getTime(),
    });
  } catch (error) {
    console.error('❌ 이미지 압축 실패 (원본 사용):', error);
    return file;
  }
};

type ConverterType = 'image-to-webp';

const CONVERTER_MAP = {
  'image-to-webp': imageToWebpConverter,
} as const;

interface ImageConverterParams<T extends FieldValues> {
  formData: FormData;
  file: File | undefined;
  title: string;
  setError: UseFormSetError<T>;
  type: ConverterType;
  fieldKey?: string;
}

export async function imageConverter<T extends FieldValues>({
  formData,
  file,
  title,
  setError,
  type,
  fieldKey = 'photoFile',
}: ImageConverterParams<T>): Promise<boolean> {
  if (!file) return true;

  const selectedConverter = CONVERTER_MAP[type];
  if (!selectedConverter) {
    console.error(`❌ 지원하지 않는 변환 타입입니다: ${type}`);
    setError('root', {
      type: 'client',
      message: '이미지 변환에 실패했습니다. 지원하지 않는 변환 타입입니다.',
    });
    return false;
  }
  try {
    const compressedFile = await selectedConverter({
      file,
      title,
    });

    formData.set(fieldKey, compressedFile);
    return true;
  } catch (error) {
    console.error('이미지 압축 에러:', error);

    setError('root', {
      type: 'client',
      message: '이미지 변환에 실패했습니다. 다른 이미지를 사용해주세요.',
    });

    return false;
  }
}
