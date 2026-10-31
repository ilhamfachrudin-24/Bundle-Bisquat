import { Project, CatalogWallet } from '@/types/solbundler';

// Empty initial projects since user has not created any project yet
export const INITIAL_PROJECTS: Project[] = [];

// Empty initial wallet catalog - all wallets deleted as requested
// User can generate or import new wallet batches when needed
export const INITIAL_CATALOG_WALLETS: CatalogWallet[] = [];

// Empty initial archived projects
export const INITIAL_ARCHIVED_PROJECTS: Project[] = [];
