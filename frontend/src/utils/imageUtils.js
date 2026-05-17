import { API_BASE_URL } from "./apiConfig";

export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return `${API_BASE_URL}/images/no-image.png`;
  
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }
  
  if (imageUrl.startsWith("/")) {
    if (imageUrl.startsWith("/images/")) {
      return `${API_BASE_URL}${imageUrl}`;
    }
    return `${API_BASE_URL}/images${imageUrl}`;
  }
  
  return `${API_BASE_URL}/images/${imageUrl}`;
};

export const getDefaultImage = () => {
  return `${API_BASE_URL}/images/no-image.png`;
};

export const getAvatarUrl = (avatarUrl) => {
  if (!avatarUrl) return `${API_BASE_URL}/images/Avatar/default-avatar.png`;
  
  if (avatarUrl.startsWith("http://") || avatarUrl.startsWith("https://")) {
    return avatarUrl;
  }
  
  if (avatarUrl.startsWith("/")) {
    if (avatarUrl.startsWith("/images/")) {
      return `${API_BASE_URL}${avatarUrl}`;
    }
    return `${API_BASE_URL}/images${avatarUrl}`;
  }
  
  return `${API_BASE_URL}/images/Avatar/${avatarUrl}`;
};
