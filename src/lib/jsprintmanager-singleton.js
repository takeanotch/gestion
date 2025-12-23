class JSPrintManagerSingleton {
  constructor() {
    this.instance = null;
    this.isInitialized = false;
    this.listeners = new Set();
    this.connectionStatus = false;
  }

  async initialize() {
    if (this.isInitialized) return this.instance;

    try {
      const jsPrintManagerModule = await import('jsprintmanager');
      this.instance = jsPrintManagerModule;
      
      const { JSPrintManager, WSStatus } = jsPrintManagerModule;
      
      JSPrintManager.auto_reconnect = true;
      JSPrintManager.start();

      JSPrintManager.WS.onStatusChanged = () => {
        const connected = JSPrintManager.websocket_status === WSStatus.Open;
        this.connectionStatus = connected;
        
        // Notifier tous les écouteurs
        this.listeners.forEach(listener => listener(connected));
        
        console.log('JSPrintManager Singleton:', connected ? 'Connected' : 'Disconnected');
      };

      this.isInitialized = true;
      return this.instance;
    } catch (error) {
      console.error('JSPrintManager Singleton initialization error:', error);
      throw error;
    }
  }

  getInstance() {
    if (!this.isInitialized) {
      throw new Error('JSPrintManager not initialized. Call initialize() first.');
    }
    return this.instance;
  }

  isConnected() {
    return this.connectionStatus;
  }

  addStatusListener(callback) {
    this.listeners.add(callback);
    // Retourner immédiatement le statut actuel
    callback(this.connectionStatus);
    
    // Fonction de cleanup
    return () => this.listeners.delete(callback);
  }

  async stop() {
    if (this.instance?.JSPrintManager?.stop) {
      this.instance.JSPrintManager.stop();
    }
    this.isInitialized = false;
    this.instance = null;
    this.listeners.clear();
  }
}

// Export d'une instance unique
export const jsPrintManager = new JSPrintManagerSingleton();