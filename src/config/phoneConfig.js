// Phone and SIP Configuration
export const phoneConfig = {
  // SIP Client Configuration
  sip: {
    // Default SIP client to use
    defaultClient: "microsip", // Options: 'microsip', 'zoiper', 'x-lite', 'custom'

    // Protocol priorities for call initiation
    protocols: [
      "sip", // SIP protocol
      "tel", // Telephone protocol
      "callto", // Windows callto protocol
      "skype", // Skype protocol (if available)
    ],

    // MicroSIP specific settings
    microsip: {
      protocol: "sip:",
      port: 5060,
      domain: "your-sip-domain.com",
    },

    // Zoiper specific settings
    zoiper: {
      protocol: "sip:",
      port: 5060,
    },
  },

  // Security Settings
  security: {
    // Phone number masking patterns
    masking: {
      enabled: true,
      // Show first N digits and last N digits
      visibleDigits: {
        first: 3,
        last: 2,
      },
      // Mask character
      maskChar: "*",
    },

    // Role-based access control
    roles: {
      admin: {
        canViewPhone: true,
        canMakeCalls: true,
        canViewHistory: true,
        canExport: true,
      },
      manager: {
        canViewPhone: true,
        canMakeCalls: true,
        canViewHistory: true,
        canExport: false,
      },
      employee: {
        canViewPhone: true,
        canMakeCalls: true,
        canViewHistory: true,
        canExport: false,
      },
      viewer: {
        canViewPhone: false,
        canMakeCalls: false,
        canViewHistory: false,
        canExport: false,
      },
    },
  },

  // Call Settings
  call: {
    // Require confirmation before making calls
    requireConfirmation: true,

    // Call logging settings
    logging: {
      enabled: true,
      logReasons: true,
      logDuration: true,
      logNotes: true,
    },

    // Call history retention (in days)
    historyRetention: 365,

    // Maximum call duration (in seconds) - 0 for unlimited
    maxDuration: 0,
  },

  // UI Settings
  ui: {
    // Phone number display variants
    variants: ["default", "compact", "chip"],

    // Default variant
    defaultVariant: "compact",

    // Show call button
    showCallButton: true,

    // Show security indicator
    showSecurityIndicator: true,

    // Show call history button
    showCallHistoryButton: true,
  },

  // Integration Settings
  integration: {
    // CRM integration
    crm: {
      logCalls: true,
      updateLeadStatus: true,
      createTasks: true,
    },

    // External phone systems
    external: {
      // Twilio integration
      twilio: {
        enabled: false,
        accountSid: "",
        authToken: "",
        phoneNumber: "",
      },

      // Vonage integration
      vonage: {
        enabled: false,
        apiKey: "",
        apiSecret: "",
        phoneNumber: "",
      },
    },
  },
};

// Helper functions
export const getPhoneConfig = (key) => {
  const keys = key.split(".");
  let value = phoneConfig;

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = value[k];
    } else {
      return undefined;
    }
  }

  return value;
};

export const hasPermission = (role, permission) => {
  const roleConfig = phoneConfig.security.roles[role];
  return roleConfig ? roleConfig[permission] : false;
};

export default phoneConfig;
