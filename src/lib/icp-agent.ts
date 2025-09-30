// src/lib/icp-agent.ts
// Momentum - Simplified ICP Agent

import { Actor, HttpAgent } from '@dfinity/agent';
import type { Identity } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import { Principal } from '@dfinity/principal';

// Import IDL definitions - Placeholder for now
// This will be loaded dynamically after backend deployment
let userManagementIdl: any = null;

// Configuration
const CONFIG = {
  HOST: import.meta.env.VITE_IC_HOST || 'http://localhost:4943',
  INTERNET_IDENTITY_URL:
    import.meta.env.VITE_INTERNET_IDENTITY_URL ||
    'http://localhost:4943/?canisterId=uxrrr-q7777-77774-qaaaq-cai',
  NFID_URL: import.meta.env.VITE_NFID_URL || 'https://nfid.one/authenticate',
  USER_MANAGEMENT_CANISTER_ID:
    import.meta.env.VITE_USER_MANAGEMENT_CANISTER_ID || 'uzt4z-lp777-77774-qaabq-cai',
  INTERNET_IDENTITY_CANISTER_ID:
    import.meta.env.VITE_INTERNET_IDENTITY_CANISTER_ID || 'uxrrr-q7777-77774-qaaaq-cai',
};

console.log('🔧 ICP Agent Configuration:', CONFIG);

class ICPAgentManager {
  private authClient: AuthClient | null = null;
  private agent: HttpAgent | null = null;
  private userManagementActor: any = null;
  private identity: Identity | null = null;

  async init(): Promise<void> {
    try {
      console.log('🚀 Initializing ICP Agent...');

      // Try to load IDL if not already loaded
      await this.loadIDL();

      this.authClient = await AuthClient.create({
        idleOptions: {
          idleTimeout: 1000 * 60 * 30, // 30 minutes
          disableDefaultIdleCallback: true,
        },
      });

      if (await this.authClient.isAuthenticated()) {
        console.log('✅ User already authenticated');
        this.identity = this.authClient.getIdentity();
        await this.createAgent();
        await this.createUserManagementActor();
      } else {
        console.log('ℹ️ User not authenticated');
      }
    } catch (error) {
      console.error('❌ Failed to initialize ICP agent:', error);
    }
  }

  private async loadIDL(): Promise<void> {
    if (userManagementIdl) return;

    try {
      // Try to load from declarations
      const declarations = await import('../declarations/user_management/service.did.js');
      userManagementIdl = declarations.idlFactory;
      console.log('✅ User management IDL loaded successfully');
    } catch (error) {
      console.warn('⚠️ Could not load user management IDL');
      console.warn('💡 Run: cp -r .dfx/local/canisters/user_management src/declarations/');
    }
  }

  private async createAgent(): Promise<void> {
    if (!this.identity) {
      throw new Error('No identity available');
    }

    console.log('🔗 Creating HTTP agent...');

    this.agent = new HttpAgent({
      host: CONFIG.HOST,
      identity: this.identity,
    });

    if (import.meta.env.DEV) {
      try {
        await this.agent.fetchRootKey();
        console.log('🔑 Root key fetched for local development');
      } catch (error) {
        console.warn('⚠️ Failed to fetch root key:', error);
      }
    }
  }

  private async createUserManagementActor(): Promise<void> {
    if (!this.agent || !userManagementIdl) {
      console.log('⚠️ Missing agent or IDL');
      return;
    }

    try {
      console.log('🎭 Creating user management actor...');

      this.userManagementActor = Actor.createActor(userManagementIdl, {
        agent: this.agent,
        canisterId: CONFIG.USER_MANAGEMENT_CANISTER_ID,
      });

      console.log('✅ User management actor created successfully');
    } catch (error) {
      console.error('❌ Failed to create user management actor:', error);
    }
  }

  async authenticateWithII(): Promise<boolean> {
    console.log('🔐 Starting Internet Identity authentication...');

    if (!this.authClient) {
      await this.init();
    }

    // Ensure IDL is loaded
    await this.loadIDL();

    return new Promise((resolve, reject) => {
      this.authClient!.login({
        identityProvider: CONFIG.INTERNET_IDENTITY_URL,
        maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000),
        onSuccess: async () => {
          try {
            console.log('✅ Internet Identity authentication successful');
            this.identity = this.authClient!.getIdentity();
            await this.createAgent();
            await this.createUserManagementActor();
            resolve(true);
          } catch (error) {
            console.error('❌ Post-auth setup failed:', error);
            reject(error);
          }
        },
        onError: (error) => {
          console.error('❌ Internet Identity authentication failed:', error);
          reject(new Error('Internet Identity authentication failed'));
        },
      });
    });
  }

  async authenticateWithNFID(): Promise<boolean> {
    console.log('🔐 Starting NFID authentication...');

    if (!this.authClient) {
      await this.init();
    }

    // Ensure IDL is loaded
    await this.loadIDL();

    return new Promise((resolve, reject) => {
      this.authClient!.login({
        identityProvider: CONFIG.NFID_URL,
        maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000),
        windowOpenerFeatures:
          'toolbar=0,location=0,menubar=0,width=500,height=500,left=100,top=100',
        onSuccess: async () => {
          try {
            console.log('✅ NFID authentication successful');
            this.identity = this.authClient!.getIdentity();
            await this.createAgent();
            await this.createUserManagementActor();
            resolve(true);
          } catch (error) {
            console.error('❌ NFID auth setup failed:', error);
            reject(error);
          }
        },
        onError: (error) => {
          console.error('❌ NFID authentication failed:', error);
          reject(new Error('NFID authentication failed'));
        },
      });
    });
  }

  async logout(): Promise<void> {
    if (this.authClient) {
      console.log('👋 Logging out...');
      await this.authClient.logout();
      this.identity = null;
      this.agent = null;
      this.userManagementActor = null;
      console.log('✅ Logout successful');
    }
  }

  async isAuthenticated(): Promise<boolean> {
    if (!this.authClient) {
      await this.init();
    }
    const isAuth = this.authClient?.isAuthenticated() || false;
    console.log('🔍 Authentication status:', isAuth);
    return isAuth;
  }

  getIdentity(): Identity | null {
    return this.identity;
  }

  getPrincipal(): Principal | null {
    const principal = this.identity?.getPrincipal() || null;
    console.log('🔑 Principal:', principal?.toText());
    return principal;
  }

  getUserManagementActor() {
    if (!this.userManagementActor) {
      console.warn('⚠️ User management actor not available');
    }
    return this.userManagementActor;
  }

  async healthCheck(): Promise<boolean> {
    try {
      if (!this.userManagementActor) {
        console.log('⚠️ No actor available for health check');
        return false;
      }
      const result = await this.userManagementActor.healthCheck();
      const isHealthy = result?.status === 'healthy';
      console.log('🏥 Health check result:', isHealthy ? 'HEALTHY' : 'UNHEALTHY');
      return isHealthy;
    } catch (error) {
      console.error('❌ Health check failed:', error);
      return false;
    }
  }
}

// Export singleton
export const IcpAgent = new ICPAgentManager();

// Helper functions
export const connectWallet = async (method: 'nfid' | 'internet-identity'): Promise<boolean> => {
  try {
    console.log(`🔗 Wallet connection with ${method}...`);

    if (method === 'nfid') {
      return await IcpAgent.authenticateWithNFID();
    } else {
      return await IcpAgent.authenticateWithII();
    }
  } catch (error) {
    console.error('❌ Wallet connection failed:', error);
    throw error;
  }
};

export const disconnectWallet = async (): Promise<void> => {
  await IcpAgent.logout();
};

export const isWalletConnected = async (): Promise<boolean> => {
  return await IcpAgent.isAuthenticated();
};

export const getCurrentPrincipal = (): string | null => {
  const principal = IcpAgent.getPrincipal();
  return principal ? principal.toText() : null;
};

// Initialize on load
if (typeof window !== 'undefined') {
  console.log('🚀 Initializing ICP agent...');
  IcpAgent.init().catch(console.error);
}
