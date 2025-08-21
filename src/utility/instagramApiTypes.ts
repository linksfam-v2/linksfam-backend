// Instagram Graph API response types
export interface InstagramMediaResponse {
  id: string;
  media_type: string;
  media_url: string;
  thumbnail_url?: string;
}

export interface InstagramApiError {
  error: {
    message: string;
    type: string;
    code: number;
    error_subcode?: number;
    fbtrace_id: string;
  };
} 