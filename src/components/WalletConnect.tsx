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
        <div className="px-4 py-2 border-3 border-black bg-neo-green shadow-neo-sm flex items-center gap-2">
          <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
          <span className="text-black font-bold text-sm">
            {formatAddress(currentAccount.address)}
          </span>
        </div>
        <button
          onClick={() => disconnect()}
          className="btn-neo-outline text-xs px-4 py-2"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <ConnectModal
      open={isModalOpen}
      onOpenChange={setIsModalOpen}
      trigger={
        <button className="btn-neo">
          Connect Wallet
        </button>
      }
    />
  );
}
