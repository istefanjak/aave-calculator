export class RefreshLimitError extends Error {
    constructor() {
      super("Etherscan refresh limit reached.");
      this.name = "Refresh limit error";
    }
  }