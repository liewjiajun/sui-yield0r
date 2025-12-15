import { useCurrentAccount, useDisconnectWallet, ConnectModal } from '@mysten/dapp-kit';
import { useState } from 'react';

export function WalletConnect() {
  const currentAccount = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (currentAccount) {
    return (
      <div className="flex items-center gap-3">
        <div className="card-brutal px-3 py-2 flex items-center gap-2">
          <div className="w-2 h-2 bg-terminal-green rounded-full animate-pulse" />
          <span className="text-terminal-green font-mono text-sm">
            {formatAddress(currentAccount.address)}
          </span>
        </div>
        <button
          onClick={() => disconnect()}
          className="btn-brutal text-xs"
        >
          DISCONNECT
        </button>
      </div>
    );
  }

  return (
    <ConnectModal
      open={isModalOpen}
      onOpenChange={setIsModalOpen}
      trigger={
        <button className="btn-brutal">
          <span className="flex items-center gap-2">
            <span className="text-terminal-amber">&gt;</span>
            CONNECT_WALLET
          </span>
        </button>
      }
    />
  );
}
