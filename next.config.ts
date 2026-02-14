
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/resources/google-business-profile-optimization-2025',
        destination: '/resources/google-business-profile-optimization',
        permanent: true, // 301
      },
      {
        source: '/resources/google-business-profile-optimization-2025/',
        destination: '/resources/google-business-profile-optimization',
        permanent: true,
      },
    ];
  },
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https' ,
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'soaacpusdhyxwucjhhpy.supabase.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'iemgpccgdlwpsrsjuumo.supabase.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ouqeoizufbofdqbuiwvx.supabase.co',
        port: '',
        pathname: '/**',
      }
    ],
  },
  env: {
    ADMIN_UID: process.env.ADMIN_UID,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    STARTER_PLAN_PRICE_ID: process.env.STARTER_PLAN_PRICE_ID,
    GROWTH_PLAN_PRICE_ID: process.env.GROWTH_PLAN_PRICE_ID,
    ENTERPRISE_PLAN_PRICE_ID: process.env.ENTERPRISE_PLAN_PRICE_ID,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  },
};

export default nextConfig;

    
