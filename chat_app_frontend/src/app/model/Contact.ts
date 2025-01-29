// types/Contact.ts
export interface Contact {
    id?: string;
    name: string;
    email: string;
    phoneNumber?: string;
    address?: string;
    picture?: string;
    description?: string;
    favorite?: boolean;
    userId: string;
    links?: Array<{ id?: string; link: string; title: string }>;
    contact_image:File | null;
  }
  